#!/usr/bin/env python3
"""Prepare and check Anansi keyframe generation packets.

This script intentionally does not call Hermes' built-in image tool. In the
current Hermes runtime, that tool is backed by FAL and fails when FAL_KEY is not
configured. Anansi's default keyframe gate is therefore:

1. extract still prompts from the project package,
2. write one prompt file per scene,
3. create a concise generation packet,
4. verify which approved local images exist before Runway rendering.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


PROJECT_ROOT = Path("{{ANANSI_PROJECTS_DIR}}")


def slug_root(slug: str) -> Path:
    return PROJECT_ROOT / slug


def read_package(project: Path) -> str | None:
    candidates = [
        project / "Anansi Production Package.md",
        project / "Production Package.md",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.read_text(encoding="utf-8")
    return None


def read_existing_prompt_files(project: Path) -> list[tuple[str, str]]:
    prompts_dir = project / "keyframes" / "prompts"
    if not prompts_dir.exists():
        return []
    prompts: list[tuple[str, str]] = []
    for prompt_file in sorted(prompts_dir.glob("scene-*.txt")):
        text = prompt_file.read_text(encoding="utf-8", errors="ignore").strip()
        if text:
            prompts.append((prompt_file.stem, text))
    return prompts


def storyboard_images(project: Path) -> list[Path]:
    folder = project / "storyboard"
    if not folder.exists():
        return []
    images: list[Path] = []
    for path in folder.iterdir():
        if not path.is_file():
            continue
        lower = path.name.lower()
        if not lower.endswith((".png", ".jpg", ".jpeg", ".webp")):
            continue
        if "contact" in lower or "keyframe" in lower:
            continue
        if lower == "storyboard.png" or "storyboard" in lower:
            images.append(path)
    return sorted(images)


def require_storyboard(project: Path) -> int:
    images = storyboard_images(project)
    if images:
        print("Storyboard gate:")
        for image in images:
            print(f"OK  storyboard image: {image}")
        return 0

    print("Storyboard gate:")
    print("NO  real storyboard image missing")
    print()
    print("A keyframe contact sheet is not a storyboard. Generate the storyboard first:")
    print(
        f'"{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-storyboard-hermes.sh" {project.name}'
    )
    return 3


def extract_universal_addendum(text: str) -> str:
    match = re.search(
        r"## Universal Still Prompt Addendum\s+(.*?)(?=\n## Scene \d+ Keyframe Prompt|\Z)",
        text,
        flags=re.S,
    )
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else ""


def extract_scene_prompts(text: str) -> list[tuple[str, str]]:
    matches = re.finditer(
        r"## Scene\s+(\d+)\s+Keyframe Prompt\s+(.*?)(?=\n## Scene \d+ Keyframe Prompt|\n---|\Z)",
        text,
        flags=re.S,
    )
    prompts: list[tuple[str, str]] = []
    for match in matches:
        scene_id = f"scene-{int(match.group(1)):02d}"
        prompt = re.sub(r"\s+", " ", match.group(2)).strip()
        if prompt:
            prompts.append((scene_id, prompt))
    return prompts


def packet_text(slug: str, project: Path, addendum: str, prompts: list[tuple[str, str]]) -> str:
    keyframes = project / "keyframes"
    lines = [
        f"# {slug} Keyframe Generation Packet",
        "",
        "Use this packet to generate approved stills before Runway.",
        "",
        "Default image path: Hermes native GPT Image 2 through ChatGPT/Codex OAuth.",
        "Generate one test still first:",
        "`{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-keyframes-hermes.sh "
        f"{slug} --scene scene-01`",
        "If approved, generate the full set:",
        "`{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-keyframes-hermes.sh "
        f"{slug}`",
        "Do not use OpenAI API or FAL unless the team explicitly chooses that backend.",
        "",
        f"Save approved PNGs into `{keyframes}` using exact filenames:",
        "",
    ]
    for scene_id, _ in prompts:
        lines.append(f"- `{scene_id}.png`")
    lines.extend(
        [
            "",
            "## Universal Addendum",
            "",
            addendum or "No universal addendum found.",
            "",
            "## Scene Prompts",
            "",
        ]
    )
    for scene_id, prompt in prompts:
        full_prompt = f"{prompt} {addendum}".strip()
        lines.extend(
            [
                f"### {scene_id}",
                "",
                f"Save as: `{keyframes / f'{scene_id}.png'}`",
                "",
                full_prompt,
                "",
                "Negative constraints: no text, no logos, no fake CGI gloss, no permanent infrastructure, no generic luxury advertising, no lifestyle posing.",
                "",
            ]
        )
    return "\n".join(lines).rstrip() + "\n"


def prepare(slug: str) -> int:
    project = slug_root(slug)
    storyboard_status = require_storyboard(project)
    if storyboard_status:
        return storyboard_status

    text = read_package(project)
    if text is None:
        prompts = read_existing_prompt_files(project)
        addendum = ""
        if not prompts:
            raise SystemExit(
                f"No production package or existing keyframe prompt files found in {project}"
            )
    else:
        addendum = extract_universal_addendum(text)
        prompts = extract_scene_prompts(text)
    if not prompts:
        raise SystemExit("No `## Scene XX Keyframe Prompt` sections found.")

    prompts_dir = project / "keyframes" / "prompts"
    prompts_dir.mkdir(parents=True, exist_ok=True)
    if text is not None:
        for scene_id, prompt in prompts:
            full_prompt = f"{prompt} {addendum}".strip()
            (prompts_dir / f"{scene_id}.txt").write_text(full_prompt + "\n", encoding="utf-8")

    packet = project / "Keyframe Generation Packet.md"
    packet.write_text(packet_text(slug, project, addendum, prompts), encoding="utf-8")

    print(f"OK  wrote {packet}")
    print(f"OK  wrote {len(prompts)} prompt file(s) to {prompts_dir}")
    return status(slug)


def status(slug: str) -> int:
    project = slug_root(slug)
    storyboard_status = require_storyboard(project)
    if storyboard_status:
        return storyboard_status

    prompts_dir = project / "keyframes" / "prompts"
    if not prompts_dir.exists():
        print(f"NO  prompt directory missing: {prompts_dir}")
        return 1

    prompt_files = sorted(prompts_dir.glob("scene-*.txt"))
    if not prompt_files:
        print(f"NO  no prompt files found in {prompts_dir}")
        return 1

    missing: list[str] = []
    present: list[str] = []
    for prompt_file in prompt_files:
        image = project / "keyframes" / f"{prompt_file.stem}.png"
        if image.exists():
            present.append(image.name)
        else:
            missing.append(image.name)

    print()
    print("Keyframe status:")
    for name in present:
        print(f"OK  {name}")
    for name in missing:
        print(f"NO  {name}")

    if missing:
        print()
        print(f"Missing {len(missing)} approved keyframe(s). Do not call Runway yet.")
        return 2

    print()
    print("OK  all approved keyframes are present. Runway render may proceed after approval.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Prepare/check Anansi keyframe gate.")
    parser.add_argument("project_slug")
    parser.add_argument("--status", action="store_true", help="Only check keyframe file status.")
    args = parser.parse_args()
    if args.status:
        return status(args.project_slug)
    return prepare(args.project_slug)


if __name__ == "__main__":
    sys.exit(main())
