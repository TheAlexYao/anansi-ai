#!/usr/bin/env python3
"""Prepare and check Anansi storyboard generation.

This gate exists because Scene Weaver must create a real sequential storyboard
image before keyframes. A keyframe contact sheet is useful for review, but it is
not a storyboard.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


PROJECT_ROOT = Path("{{ANANSI_PROJECTS_DIR}}")
VAULT_ROOT = Path("{{ANANSI_VAULT_PATH}}")
STORYBOARD_PROMPT_VERSION = "anansi-storyboard-gate-v2-obsidian-directive"


def slug_root(slug: str) -> Path:
    return PROJECT_ROOT / slug


def storyboard_dir(project: Path) -> Path:
    return project / "storyboard"


def storyboard_images(project: Path) -> list[Path]:
    folder = storyboard_dir(project)
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


def project_state(project: Path) -> dict:
    path = project / "project.json"
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def strategy_gate_approved(project: Path) -> tuple[bool, str]:
    data = project_state(project)
    completed = set(data.get("completed_stages", []))
    stage_status = data.get("stage_status", {})
    strategy_status = stage_status.get("strategy-review") or stage_status.get("strategy")
    if "strategy-review" in completed or strategy_status in {"approved", "complete"}:
        return True, "strategy-review approved"
    notes = data.get("notes", [])
    if any(isinstance(note, str) and "AUTOPILOT" in note.upper() for note in notes):
        return True, "AUTOPILOT noted in project state"
    return False, "strategy-review is not approved in project.json"


def story_handoff_ready(project: Path) -> tuple[bool, str]:
    handoff = project / "story" / "Story Handoff.md"
    if not handoff.exists():
        return False, f"missing {handoff}"
    text = handoff.read_text(encoding="utf-8", errors="ignore").lower()
    has_direction = any(
        marker in text
        for marker in [
            "story direction",
            "selected direction",
            "direction name",
            "selected story",
        ]
    )
    has_arc = "arc" in text or "script spine" in text or "beat" in text
    if has_direction and has_arc:
        return True, "story handoff names direction and arc"
    return False, "story handoff does not clearly name direction and arc"


def strategy_prerequisites(project: Path) -> tuple[bool, list[str]]:
    ok_strategy, strategy_reason = strategy_gate_approved(project)
    ok_story, story_reason = story_handoff_ready(project)
    return ok_strategy and ok_story, [strategy_reason, story_reason]


def latest_matching(project: Path, patterns: list[str]) -> Path | None:
    matches: list[Path] = []
    for pattern in patterns:
        matches.extend(project.glob(pattern))
    matches = [path for path in matches if path.is_file()]
    if not matches:
        return None
    return max(matches, key=lambda path: path.stat().st_mtime)


def read_text(path: Path, limit: int = 12000) -> str:
    text = path.read_text(encoding="utf-8", errors="ignore")
    if len(text) <= limit:
        return text
    return text[:limit] + "\n\n[TRUNCATED FOR STORYBOARD PROMPT]\n"


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            return parts[2].lstrip()
    return text


def extract_sections(text: str, headings: list[str], limit: int = 11000) -> str:
    text = strip_frontmatter(text)
    lines = text.splitlines()
    wanted = {heading.lower() for heading in headings}
    chunks: list[str] = []
    current: list[str] = []
    capturing = False
    for line in lines:
        if line.startswith("## "):
            if capturing and current:
                chunks.append("\n".join(current).strip())
            current = []
            title = line[3:].strip().lower()
            capturing = title in wanted
        if capturing:
            current.append(line)
    if capturing and current:
        chunks.append("\n".join(current).strip())
    result = "\n\n".join(chunk for chunk in chunks if chunk)
    if not result:
        result = strip_frontmatter(text)
    if len(result) > limit:
        return result[:limit] + "\n\n[TRUNCATED OBSIDIAN STORYBOARD DIRECTIVE]\n"
    return result


def storyboard_directive_text(project_text: str) -> tuple[list[str], str]:
    notes: list[Path] = [
        VAULT_ROOT / "19 Mood Systems" / "Storyboard Prompting Directive.md",
        VAULT_ROOT / "11 Retrieval Maps" / "Scene Weaver Obsidian Retrieval Map.md",
    ]
    lower = project_text.lower()
    if "hinter" in lower or "relocatable" in lower or "prefab" in lower or "landscape hotel" in lower:
        notes.append(
            VAULT_ROOT
            / "12 the creative lead Creative Director"
            / "Hinter Storyboard Feedback - Warm Removable Architecture.md"
        )

    headings = [
        "Prime Rule",
        "Format First",
        "Shot Count Defaults",
        "Story Arc",
        "One Job Per Panel",
        "Camera Language",
        "Storyboard Visual Style",
        "Timing",
        "Text, VO, Caption, And Sound",
        "Continuity",
        "Storyboard Negative Constraints",
        "All-Purpose Storyboard Prompt Template",
        "Social Video Storyboards",
        "Commercial Product Storyboards",
        "Relocatable Architecture Storyboards",
        "Absurdist / Parody Storyboards",
        "Storyboard Retrieval Path",
        "Storyboard Output",
    ]
    used: list[str] = []
    chunks: list[str] = []
    for note in notes:
        if not note.exists():
            continue
        raw = read_text(note, limit=40000)
        excerpt = extract_sections(raw, headings=headings)
        used.append(str(note))
        chunks.append(f"## Obsidian Source: {note.relative_to(VAULT_ROOT)}\n\n{excerpt}")
    return used, "\n\n---\n\n".join(chunks).strip()


def existing_prompt(project: Path) -> Path | None:
    folder = storyboard_dir(project)
    candidates = [
        folder / "storyboard-prompt.txt",
        folder / "Storyboard Prompt.md",
        folder / "Storyboard Generation Prompt.md",
    ]
    for path in candidates:
        if path.exists() and path.read_text(encoding="utf-8", errors="ignore").strip():
            return path
    return None


def source_text(project: Path) -> tuple[str, str]:
    source = latest_matching(
        project,
        [
            "storyboard/Scene Handoff*.md",
            "story/Story Handoff*.md",
            "mood/Mood Handoff*.md",
            "Anansi Production Package.md",
            "Production Package.md",
        ],
    )
    if source is None:
        raise SystemExit(f"No scene/story source found in {project}")
    return str(source), read_text(source)


def infer_panel_count(text: str) -> str:
    lower = text.lower()
    scene_count = len(re.findall(r"(?m)^#{2,4}\s*scene\s+\d+", lower))
    if "15s" in lower or "15-second" in lower or "tiktok" in lower or "reels" in lower:
        return "6-panel vertical social storyboard"
    if scene_count and scene_count <= 4:
        return "8-panel commercial storyboard, two panels per major scene when useful"
    return "8-panel commercial storyboard"


def build_prompt(slug: str, source_path: str, text: str) -> tuple[str, list[str]]:
    panel_format = infer_panel_count(text)
    directive_sources, directive = storyboard_directive_text(text)
    return f"""# {STORYBOARD_PROMPT_VERSION}

Create a professional storyboard sheet, not a mood board, for the Anansi project `{slug}`.

This must be a sequential visual plan for a short film/commercial, arranged in numbered panels with clear shot progression. It is not a keyframe contact sheet, not a moodboard, not a poster, and not a collage.

Format:
- {panel_format}
- clean director's storyboard sheet
- numbered panels arranged left to right and top to bottom
- one clear action or beat per panel
- minimal short captions/timing notes only
- simple camera arrows where useful
- no long readable text blocks

Visual style:
- professional black-and-white pencil-and-ink storyboard with cinematic shading
- clear framing, camera movement, and continuity
- readable enough for a director/client to approve before keyframe generation

Continuity:
- maintain the teame subject, world, materials, lighting logic, and tone across panels
- preserve client-provided materials and approved mood/story constraints from the source
- if a reveal begins, show the revealed result; never stop at the instant before the reveal
- avoid AI-tell actions: malformed hands, rubbery pages, impossible object contact, warped product geometry, morphing text

Obsidian storyboard directive:

```md
{directive or "No Obsidian storyboard directive found."}
```

Source scene/story material:
{source_path}

```md
{text}
```

Negative constraints:
Avoid mood-board collage, unrelated reference tiles, decorative swatches, concept-art splash page, single-scene illustration, chaotic layout, fake readable text, random objects, inconsistent subject design, generic stock-commercial imagery, and keyframe contact-sheet layout.
""".strip() + "\n", directive_sources


def write_packet(slug: str, project: Path, prompt: str, source_path: str, directive_sources: list[str]) -> Path:
    folder = storyboard_dir(project)
    folder.mkdir(parents=True, exist_ok=True)
    prompt_path = folder / "storyboard-prompt.txt"
    packet_path = folder / "Storyboard Generation Packet.md"
    packet_prompt = prompt.replace("```", "~~~")
    prompt_path.write_text(prompt, encoding="utf-8")
    packet_path.write_text(
        "\n".join(
            [
                f"# {slug} Storyboard Generation Packet",
                "",
                "This packet must produce a real image storyboard before keyframes.",
                "",
                f"- source: `{source_path}`",
                "- Obsidian storyboard context:",
                *[f"  - `{source}`" for source in directive_sources],
                f"- prompt: `{prompt_path}`",
                f"- expected image: `{folder / 'storyboard.png'}`",
                "",
                "Generate with:",
                "",
                "```bash",
                f'"{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-storyboard-hermes.sh" {slug}',
                "```",
                "",
                "## Prompt",
                "",
                "```txt",
                packet_prompt.rstrip(),
                "```",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return prompt_path


def update_project_json(slug: str, project: Path, image: Path | None = None, prompt: Path | None = None) -> None:
    pj = project / "project.json"
    if not pj.exists():
        return
    try:
        data = json.loads(pj.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return
    artifacts = data.setdefault("artifacts", {})
    if image is not None:
        artifacts["storyboard_image"] = str(image)
    if prompt is not None:
        artifacts["storyboard_prompt"] = str(prompt)
    data["last_updated"] = datetime.now(timezone.utc).isoformat()
    pj.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def prepare(slug: str) -> int:
    project = slug_root(slug)
    if not project.exists():
        raise SystemExit(f"Project folder not found: {project}")

    ready, reasons = strategy_prerequisites(project)
    if not ready:
        print("NO  storyboard blocked: story direction approval missing")
        for reason in reasons:
            print(f"- {reason}")
        print()
        print("Show and approve the Strategy Gate before storyboard generation:")
        print(
            f'"{{ANANSI_AGENT_HOME}}/scripts/anansi-feedback-message.sh" {slug} --gate strategy'
        )
        return 3

    prompt_path = existing_prompt(project)
    prompt_needs_refresh = False
    if prompt_path is not None:
        prompt_text = prompt_path.read_text(encoding="utf-8", errors="ignore")
        prompt_needs_refresh = STORYBOARD_PROMPT_VERSION not in prompt_text

    if prompt_path is None or prompt_needs_refresh:
        source_path, text = source_text(project)
        prompt, directive_sources = build_prompt(slug, source_path, text)
        prompt_path = write_packet(slug, project, prompt, source_path, directive_sources)
        verb = "refreshed" if prompt_needs_refresh else "wrote"
        print(f"OK  {verb} storyboard prompt: {prompt_path}")
    else:
        print(f"OK  storyboard prompt exists: {prompt_path}")

    update_project_json(slug, project, prompt=prompt_path)
    return status(slug)


def status(slug: str) -> int:
    project = slug_root(slug)
    prompt_path = existing_prompt(project)
    images = storyboard_images(project)
    ready, reasons = strategy_prerequisites(project)

    print()
    print("Storyboard status:")
    if ready:
        print("OK  story direction approved before storyboard")
    else:
        print("NO  story direction approval missing")
        for reason in reasons:
            print(f"    {reason}")
        print()
        print("Do not generate or approve storyboard/keyframes until Strategy Gate is approved.")
        return 3

    if prompt_path:
        print(f"OK  prompt: {prompt_path}")
    else:
        print("NO  storyboard prompt missing")

    if images:
        for image in images:
            print(f"OK  storyboard image: {image}")
        update_project_json(slug, project, image=images[0], prompt=prompt_path)
        return 0

    print("NO  storyboard image missing")
    print()
    print("Generate it before keyframes:")
    print(
        f'"{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-storyboard-hermes.sh" {slug}'
    )
    return 2 if prompt_path else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Prepare/check Anansi storyboard gate.")
    parser.add_argument("project_slug")
    parser.add_argument("--status", action="store_true", help="Only check storyboard file status.")
    args = parser.parse_args()
    if args.status:
        return status(args.project_slug)
    return prepare(args.project_slug)


if __name__ == "__main__":
    sys.exit(main())
