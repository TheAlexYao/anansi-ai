#!/usr/bin/env python3
"""Run the Anansi Runway stage as one compact, resumable batch.

The Telegram agent should call this script instead of manually creating
folders, writing ad hoc status summaries, launching background processes, and
polling. All noisy Runway output is written to local logs; stdout is deliberately
short and attachment-ready.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


AGENT_HOME = Path("{{ANANSI_AGENT_HOME}}")
PROJECTS_ROOT = Path("{{ANANSI_PROJECTS_DIR}}")


def is_media(path: Path) -> bool:
    return path.suffix.lower() in {".mp4", ".mov", ".m4v"}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"NO invalid payload JSON: {path} ({exc})")


def find_payload_file(project: Path, explicit: str | None) -> Path | None:
    if explicit:
        path = Path(explicit).expanduser()
        if not path.is_absolute():
            path = project / path
        if not path.exists():
            raise SystemExit(f"NO payload file not found: {path}")
        return path

    payload_dir = project / "runway" / "payloads"
    candidates = sorted(
        [
            *payload_dir.glob("runway-motion-prompts*.json"),
            *payload_dir.glob("*payload*.json"),
            *payload_dir.glob("*.json"),
        ],
        key=lambda p: p.stat().st_mtime if p.exists() else 0,
        reverse=True,
    )
    return candidates[0] if candidates else None


def scene_id_from_path(path: Path) -> str:
    return path.stem


def prompt_files(project: Path) -> list[Path]:
    roots = [
        project / "runway" / "prompts",
        project / "keyframes" / "runway-prompts",
        project / "keyframes" / "prompts",
    ]
    files: list[Path] = []
    for root in roots:
        if root.exists():
            files.extend(sorted(root.glob("scene-*.txt")))
            if files:
                return files
    return files


def payloads_from_prompt_files(project: Path, model: str, ratio: str, duration: int) -> list[dict[str, Any]]:
    payloads: list[dict[str, Any]] = []
    for prompt_file in prompt_files(project):
        scene_id = scene_id_from_path(prompt_file)
        prompt = prompt_file.read_text(encoding="utf-8", errors="ignore").strip()
        if not prompt:
            continue
        payloads.append(
            {
                "scene_id": scene_id,
                "prompt_text": prompt,
                "prompt_image": str(project / "keyframes" / f"{scene_id}.png"),
                "model": model,
                "ratio": ratio,
                "duration": duration,
            }
        )
    return payloads


def payloads_from_json(data: Any, project: Path, model: str, ratio: str, duration: int) -> list[dict[str, Any]]:
    raw_items: list[Any]
    if isinstance(data, list):
        raw_items = data
    elif isinstance(data, dict):
        for key in ("payloads", "scenes", "items"):
            if isinstance(data.get(key), list):
                raw_items = data[key]
                break
        else:
            raw_items = []
            for key, value in data.items():
                if isinstance(value, str):
                    raw_items.append({"scene_id": key, "prompt_text": value})
                elif isinstance(value, dict):
                    item = dict(value)
                    item.setdefault("scene_id", key)
                    raw_items.append(item)
    else:
        raw_items = []

    payloads: list[dict[str, Any]] = []
    for index, raw in enumerate(raw_items, start=1):
        if not isinstance(raw, dict):
            continue
        scene_id = str(raw.get("scene_id") or raw.get("id") or raw.get("scene") or f"scene-{index:02d}")
        if scene_id.isdigit():
            scene_id = f"scene-{int(scene_id):02d}"
        prompt = str(
            raw.get("prompt_text")
            or raw.get("motion_prompt")
            or raw.get("prompt")
            or raw.get("runway_prompt")
            or raw.get("expected_output")
            or ""
        ).strip()
        image = raw.get("prompt_image") or raw.get("image") or raw.get("keyframe")
        if image:
            image_path = Path(str(image)).expanduser()
            if not image_path.is_absolute():
                image_path = project / image_path
        else:
            image_path = project / "keyframes" / f"{scene_id}.png"

        payloads.append(
            {
                "scene_id": scene_id,
                "prompt_text": prompt,
                "prompt_image": str(image_path),
                "model": str(raw.get("model") or model),
                "ratio": normalize_ratio(str(raw.get("ratio") or ratio)),
                "duration": parse_duration(raw.get("duration") or duration),
                "continuity_anchors": raw.get("continuity_anchors") or raw.get("continuity") or [],
                "failure_watch": raw.get("failure_watch") or [],
            }
        )
    return payloads


def parse_duration(value: Any) -> int:
    text = str(value).strip().lower().removesuffix("s")
    try:
        return int(float(text))
    except ValueError:
        return 5


def normalize_ratio(value: str) -> str:
    clean = value.strip()
    return {
        "9:16": "720:1280",
        "16:9": "1280:720",
        "1:1": "960:960",
        "4:5": "768:960",
    }.get(clean, clean)


def normalize_payloads(project: Path, payload_file: Path | None, model: str, ratio: str, duration: int) -> list[dict[str, Any]]:
    if payload_file:
        payloads = payloads_from_json(load_json(payload_file), project, model, ratio, duration)
    else:
        payloads = payloads_from_prompt_files(project, model, ratio, duration)

    normalized: list[dict[str, Any]] = []
    for payload in payloads:
        scene_id = payload["scene_id"]
        prompt = str(payload.get("prompt_text") or "").strip()
        image = Path(str(payload["prompt_image"]))
        if not prompt:
            continue
        normalized.append(
            {
                **payload,
                "scene_id": scene_id,
                "prompt_text": prompt,
                "prompt_image": str(image),
                "ratio": normalize_ratio(str(payload.get("ratio") or ratio)),
                "duration": parse_duration(payload.get("duration") or duration),
                "output_file": str(project / "runway" / "clips" / f"{scene_id}.mp4"),
            }
        )
    return normalized


def write_handoff(
    project: Path,
    slug: str,
    payload_file: Path,
    payloads: list[dict[str, Any]],
    rendered: list[Path],
    skipped: list[Path],
    failed: list[str],
) -> None:
    handoff = project / "runway" / "Runway Handoff.md"
    clips = sorted([p for p in (project / "runway" / "clips").iterdir() if p.is_file() and is_media(p)])
    lines = [
        "---",
        f"title: {slug} Runway Handoff",
        "type: runway-handoff",
        "status: active",
        "public_safe: false",
        f"updated: {datetime.now(timezone.utc).isoformat()}",
        "---",
        "",
        f"# {slug} Runway Handoff",
        "",
        "## Summary",
        f"- Payload file: `{payload_file}`",
        f"- Expected clips: {len(payloads)}",
        f"- Clips present: {len(clips)}",
        f"- Rendered this pass: {len(rendered)}",
        f"- Reused existing: {len(skipped)}",
        f"- Failed: {', '.join(failed) if failed else 'none'}",
        "",
        "## Selected Clips",
    ]
    for clip in clips:
        lines.append(f"- `{clip}`")
    lines.extend(
        [
            "",
            "## Final Cut Instruction",
            "Use HyperFrames by default for composition, title/caption/CTA layout, branded wrappers, and renderable export structure. Consult Obsidian notes in `20 Final Cut Systems/`, `22 Typography Systems/`, and `23 Social Title Placement/` before assembly.",
            "",
            "## Telegram Rule",
            "Do not paste Runway logs, task ids, raw payloads, FPS/duration inventories, or clip-by-clip reads into Telegram. Send only the compact stage result and attach clips or final review artifacts.",
            "",
        ]
    )
    handoff.write_text("\n".join(lines), encoding="utf-8")


def update_project_state(project: Path, clips: list[Path]) -> None:
    state_path = project / "project.json"
    if not state_path.exists():
        return
    try:
        data = json.loads(state_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return

    completed = data.setdefault("completed_stages", [])
    stage_status = data.setdefault("stage_status", {})
    artifacts = data.setdefault("artifacts", {})

    if clips:
        stage_status["runway"] = "complete"
        if "runway" not in completed:
            completed.append("runway")
        artifacts["runway"] = [str(path) for path in clips]
        data["current_stage"] = "final-cut"

    data["last_updated"] = datetime.now(timezone.utc).isoformat()
    state_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def print_media(clips: list[Path]) -> None:
    for clip in clips[:8]:
        print(f'MEDIA:"{clip}"')


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Anansi Runway stage as a compact batch.")
    parser.add_argument("project_slug")
    parser.add_argument("--payload-file")
    parser.add_argument("--model", default="gen4.5")
    parser.add_argument("--ratio", default="720:1280")
    parser.add_argument("--duration", type=int, default=5)
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--max-scenes", type=int)
    args = parser.parse_args()

    project = PROJECTS_ROOT / args.project_slug
    if not project.exists():
        print(f"NO project folder: {project}", file=sys.stderr)
        return 2

    runway_root = project / "runway"
    payload_dir = runway_root / "payloads"
    clips_dir = runway_root / "clips"
    logs_dir = runway_root / "logs"
    for directory in [payload_dir, clips_dir, logs_dir]:
        directory.mkdir(parents=True, exist_ok=True)

    payload_file = find_payload_file(project, args.payload_file)
    payloads = normalize_payloads(project, payload_file, args.model, args.ratio, args.duration)
    if args.max_scenes:
        payloads = payloads[: args.max_scenes]
    if not payloads:
        print("NO runway payloads or prompt files found.")
        print("Fix: create runway/payloads/runway-motion-prompts-v1.json or scene prompt files.")
        return 3

    normalized_file = payload_dir / "runway-motion-prompts-normalized.json"
    normalized_file.write_text(json.dumps({"payloads": payloads}, indent=2) + "\n", encoding="utf-8")
    payload_file = payload_file or normalized_file

    expected_outputs = [Path(str(payload["output_file"])) for payload in payloads]
    existing_outputs = [path for path in expected_outputs if path.exists()]

    if args.status:
        print("Phase: Runway")
        print(f"Clips: {len(existing_outputs)}/{len(expected_outputs)}")
        if len(existing_outputs) == len(expected_outputs):
            print("Next: Final Cut (HyperFrames).")
            print_media(existing_outputs)
            return 0
        missing = [path.stem for path in expected_outputs if not path.exists()]
        print(f"Missing: {', '.join(missing)}")
        print("Next: rerun the Runway stage helper; it will resume missing clips.")
        return 2

    keyframe_log = logs_dir / "keyframe-gate-before-runway.log"
    keyframe_status = subprocess.run(
        [str(AGENT_HOME / "scripts" / "anansi-keyframe-gate.sh"), args.project_slug, "--status"],
        stdout=keyframe_log.open("w", encoding="utf-8"),
        stderr=subprocess.STDOUT,
        check=False,
    ).returncode
    if keyframe_status != 0:
        print("NO Runway blocked: keyframe gate failed.")
        print(f"Local log: {keyframe_log}")
        return keyframe_status

    rendered: list[Path] = []
    skipped: list[Path] = []
    failed: list[str] = []

    for payload in payloads:
        scene_id = str(payload["scene_id"])
        output = Path(str(payload["output_file"]))
        image = Path(str(payload["prompt_image"]))
        if output.exists() and not args.overwrite:
            skipped.append(output)
            continue
        if not image.exists():
            failed.append(scene_id)
            (logs_dir / f"{scene_id}.runway.log").write_text(f"Missing keyframe: {image}\n", encoding="utf-8")
            continue

        log_path = logs_dir / f"{scene_id}.runway.log"
        with log_path.open("w", encoding="utf-8") as log:
            status = subprocess.run(
                [
                    sys.executable,
                    str(AGENT_HOME / "scripts" / "runway-i2v.py"),
                    "--image",
                    str(image),
                    "--prompt",
                    str(payload["prompt_text"]),
                    "--out",
                    str(output),
                    "--model",
                    str(payload.get("model") or args.model),
                    "--ratio",
                    str(payload.get("ratio") or args.ratio),
                    "--duration",
                    str(payload.get("duration") or args.duration),
                ],
                stdout=log,
                stderr=subprocess.STDOUT,
                check=False,
            ).returncode
        if status == 0 and output.exists():
            rendered.append(output)
        else:
            failed.append(scene_id)

    clips = [path for path in expected_outputs if path.exists()]
    write_handoff(project, args.project_slug, payload_file, payloads, rendered, skipped, failed)
    update_project_state(project, clips)

    if failed:
        print("NO runway stage incomplete")
        print(f"Clips: {len(clips)}/{len(expected_outputs)}")
        print(f"Failed: {', '.join(failed)}")
        print("Fix: inspect local runway/logs for failed scene ids, then rerun this helper.")
        print_media(clips)
        return 4

    print("Phase: Runway")
    print(f"Done: {len(clips)}/{len(expected_outputs)} clips rendered.")
    print("Next: Final Cut (HyperFrames).")
    print_media(clips)
    return 0


if __name__ == "__main__":
    sys.exit(main())
