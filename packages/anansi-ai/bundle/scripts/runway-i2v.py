#!/usr/bin/env python3
"""Send a local image to Runway Gen-4.5 image-to-video and download the result.

This script reads the Runway API key from `RUNWAYML_API_SECRET` or
`RUNWAY_API_KEY` when present, otherwise from macOS Keychain service
`anansi-runway-api-key`. It does not print the key.
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


KEYCHAIN_SERVICE = "anansi-runway-api-key"


def keychain_secret() -> str:
    env_secret = os.environ.get("RUNWAYML_API_SECRET") or os.environ.get("RUNWAY_API_KEY")
    if env_secret:
        return env_secret.strip()
    try:
        return subprocess.check_output(
            [
                "security",
                "find-generic-password",
                "-a",
                os.environ.get("USER", "teambrukhman"),
                "-s",
                KEYCHAIN_SERVICE,
                "-w",
            ],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except subprocess.CalledProcessError:
        print(
            "Runway key not found. Run scripts/setup-runway-key.sh first, or set RUNWAYML_API_SECRET in the private Hermes profile environment.",
            file=sys.stderr,
        )
        sys.exit(1)


def image_as_data_uri(path: Path) -> str:
    mime, _ = mimetypes.guess_type(path)
    if mime is None:
        mime = "image/png"
    encoded = base64.b64encode(path.read_bytes()).decode("utf-8")
    return f"data:{mime};base64,{encoded}"


def download(url: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as response:
        output_path.write_bytes(response.read())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Local keyframe image path")
    parser.add_argument("--prompt", required=True, help="Runway motion prompt")
    parser.add_argument("--out", required=True, help="Output .mp4 path")
    parser.add_argument("--model", default="gen4.5")
    parser.add_argument("--ratio", default="720:1280")
    parser.add_argument("--duration", type=int, default=5)
    args = parser.parse_args()

    image_path = Path(args.image).expanduser().resolve()
    output_path = Path(args.out).expanduser().resolve()
    if not image_path.exists():
        raise SystemExit(f"Image not found: {image_path}")

    os.environ["RUNWAYML_API_SECRET"] = keychain_secret()

    try:
        from runwayml import RunwayML, TaskFailedError
    except ImportError:
        raise SystemExit(
            "Missing Python package `runwayml`. Run: python3 -m pip install --user runwayml"
        )

    client = RunwayML()

    print("Submitting Runway image-to-video task...")
    started = time.time()
    try:
        task = client.image_to_video.create(
            model=args.model,
            prompt_image=image_as_data_uri(image_path),
            prompt_text=args.prompt,
            ratio=args.ratio,
            duration=args.duration,
        ).wait_for_task_output()
    except TaskFailedError as exc:
        details = getattr(exc, "task_details", None)
        print("Runway task failed.", file=sys.stderr)
        if details:
            print(json.dumps(details, indent=2, default=str), file=sys.stderr)
        sys.exit(1)

    outputs = getattr(task, "output", None) or []
    if not outputs:
        raise SystemExit("Runway task completed but returned no output URLs.")

    download(outputs[0], output_path)

    metadata_path = output_path.with_suffix(".task.json")
    metadata = {
        "model": args.model,
        "ratio": args.ratio,
        "duration": args.duration,
        "prompt_image": str(image_path),
        "prompt_text": args.prompt,
        "output_file": str(output_path),
        "elapsed_seconds": round(time.time() - started, 1),
        "raw_output_url_redacted": True,
    }
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n")

    print(f"Downloaded video: {output_path}")
    print(f"Wrote metadata: {metadata_path}")


if __name__ == "__main__":
    main()
