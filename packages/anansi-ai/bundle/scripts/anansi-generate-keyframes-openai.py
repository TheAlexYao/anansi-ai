#!/usr/bin/env python3
"""Generate Anansi keyframes with OpenAI Responses image generation.

Preferred Anansi keyframe backend:
- main model: gpt-5.5
- hosted tool: image_generation

Requires OPENAI_API_KEY in environment or macOS Keychain service
`anansi-openai-api-key`.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


KEYCHAIN_SERVICE = "anansi-openai-api-key"
PROJECT_ROOT = Path("{{ANANSI_PROJECTS_DIR}}")
API_URL = "https://api.openai.com/v1/responses"


def get_openai_key() -> str:
    env_key = os.environ.get("OPENAI_API_KEY")
    if env_key:
        return env_key
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
            "OpenAI key not found. Run scripts/setup-openai-key.sh first.",
            file=sys.stderr,
        )
        sys.exit(1)


def project_root(slug: str) -> Path:
    return PROJECT_ROOT / slug


def prompt_files(project: Path, only_scene: str | None = None) -> list[Path]:
    prompts_dir = project / "keyframes" / "prompts"
    if only_scene:
        path = prompts_dir / f"{only_scene}.txt"
        if not path.exists():
            raise SystemExit(f"Prompt file not found: {path}")
        return [path]
    files = sorted(prompts_dir.glob("scene-*.txt"))
    if not files:
        raise SystemExit(f"No prompt files found in {prompts_dir}. Run anansi-keyframe-gate.sh first.")
    return files


def extract_image_b64(response: dict) -> tuple[str, str | None]:
    for output in response.get("output", []):
        if output.get("type") == "image_generation_call" and output.get("result"):
            return output["result"], output.get("revised_prompt")
    raise RuntimeError("OpenAI response did not include an image_generation_call result.")


def request_image(
    api_key: str,
    prompt: str,
    model: str,
    size: str,
    quality: str,
    output_format: str,
) -> tuple[bytes, dict, str | None]:
    tool = {
        "type": "image_generation",
        "action": "generate",
        "size": size,
        "quality": quality,
        "output_format": output_format,
    }
    payload = {
        "model": model,
        "input": prompt,
        "tools": [tool],
        "tool_choice": {"type": "image_generation"},
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as response:
            raw = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI API error {exc.code}: {detail}") from exc
    parsed = json.loads(raw)
    image_b64, revised_prompt = extract_image_b64(parsed)
    return base64.b64decode(image_b64), parsed, revised_prompt


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Anansi keyframes with OpenAI GPT-5.5 image generation.")
    parser.add_argument("project_slug")
    parser.add_argument("--scene", help="Generate only one scene, e.g. scene-01")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing scene PNGs.")
    parser.add_argument("--model", default=os.environ.get("ANANSI_OPENAI_RESPONSES_MODEL", "gpt-5.5"))
    parser.add_argument("--size", default=os.environ.get("ANANSI_OPENAI_IMAGE_SIZE", "auto"))
    parser.add_argument("--quality", default=os.environ.get("ANANSI_OPENAI_IMAGE_QUALITY", "auto"))
    parser.add_argument("--output-format", default=os.environ.get("ANANSI_OPENAI_IMAGE_FORMAT", "png"))
    parser.add_argument("--sleep", type=float, default=1.0, help="Seconds between scene requests.")
    args = parser.parse_args()

    root = project_root(args.project_slug)
    keyframes_dir = root / "keyframes"
    keyframes_dir.mkdir(parents=True, exist_ok=True)
    payload_dir = root / "keyframes" / "openai-responses"
    payload_dir.mkdir(parents=True, exist_ok=True)

    api_key = get_openai_key()
    files = prompt_files(root, args.scene)

    generated = 0
    skipped = 0
    for prompt_file in files:
        scene_id = prompt_file.stem
        out_path = keyframes_dir / f"{scene_id}.png"
        if out_path.exists() and not args.overwrite:
            print(f"SKIP {out_path} already exists")
            skipped += 1
            continue
        prompt = prompt_file.read_text(encoding="utf-8").strip()
        if not prompt:
            print(f"SKIP {prompt_file} is empty")
            skipped += 1
            continue
        print(f"GENERATE {scene_id} with {args.model} image_generation")
        image_bytes, response, revised_prompt = request_image(
            api_key=api_key,
            prompt=prompt,
            model=args.model,
            size=args.size,
            quality=args.quality,
            output_format=args.output_format,
        )
        out_path.write_bytes(image_bytes)
        safe_response = {
            "id": response.get("id"),
            "model": response.get("model"),
            "created_at": response.get("created_at"),
            "scene_id": scene_id,
            "prompt_file": str(prompt_file),
            "output_image": str(out_path),
            "revised_prompt": revised_prompt,
            "usage": response.get("usage"),
        }
        (payload_dir / f"{scene_id}.json").write_text(
            json.dumps(safe_response, indent=2),
            encoding="utf-8",
        )
        print(f"OK  wrote {out_path}")
        generated += 1
        if args.sleep and prompt_file != files[-1]:
            time.sleep(args.sleep)

    print()
    print(f"Generated: {generated}")
    print(f"Skipped: {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
