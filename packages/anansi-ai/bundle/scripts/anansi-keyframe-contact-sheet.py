#!/usr/bin/env python3
"""Build a compact contact sheet for Anansi keyframes."""

from __future__ import annotations

import argparse
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path("{{ANANSI_PROJECTS_DIR}}")


def project_root(slug: str) -> Path:
    return PROJECT_ROOT / slug


def scene_images(project: Path) -> list[Path]:
    keyframes = project / "keyframes"
    return sorted(
        path
        for path in keyframes.glob("scene-*.png")
        if path.is_file() and "contact" not in path.name.lower()
    )


def font(size: int) -> ImageFont.ImageFont:
    for candidate in [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def fit_image(image: Image.Image, width: int, height: int) -> Image.Image:
    image = image.convert("RGB")
    image.thumbnail((width, height), Image.Reteampling.LANCZOS)
    canvas = Image.new("RGB", (width, height), "#f4f1eb")
    x = (width - image.width) // 2
    y = (height - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def update_state(project: Path, contact_sheet: Path, images: list[Path]) -> None:
    state_path = project / "project.json"
    if not state_path.exists():
        return
    try:
        data = json.loads(state_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return

    data.setdefault("artifacts", {}).setdefault("keyframes", [])
    artifacts = data["artifacts"]["keyframes"]
    for path in [contact_sheet, *images]:
        value = str(path)
        if value not in artifacts:
            artifacts.append(value)

    data.setdefault("stage_status", {})["keyframes"] = "complete"
    completed = data.setdefault("completed_stages", [])
    if "keyframes" not in completed:
        completed.append("keyframes")
    data["current_stage"] = "previsualization-review"
    data["last_updated"] = datetime.now(timezone.utc).isoformat()
    state_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def write_contact_sheet(slug: str, output: Path | None = None) -> Path:
    project = project_root(slug)
    if not project.exists():
        raise SystemExit(f"No Anansi project found: {project}")

    images = scene_images(project)
    if not images:
        raise SystemExit(f"No scene keyframes found in {project / 'keyframes'}")

    output = output or project / "keyframes" / "keyframe-contact-sheet.jpg"
    output.parent.mkdir(parents=True, exist_ok=True)

    columns = min(4, max(1, math.ceil(math.sqrt(len(images)))))
    rows = math.ceil(len(images) / columns)
    tile_w = 520
    tile_h = 780
    label_h = 44
    gap = 18
    margin = 28
    title_h = 72

    width = margin * 2 + columns * tile_w + (columns - 1) * gap
    height = margin * 2 + title_h + rows * (tile_h + label_h) + (rows - 1) * gap
    sheet = Image.new("RGB", (width, height), "#f8f5ef")
    draw = ImageDraw.Draw(sheet)
    title_font = font(30)
    label_font = font(20)
    small_font = font(15)

    draw.text((margin, margin), f"{slug} keyframes", fill="#211b2d", font=title_font)
    draw.text(
        (margin, margin + 40),
        f"{len(images)} stills for Previsualization Gate",
        fill="#6e6678",
        font=small_font,
    )

    for index, path in enumerate(images):
        row = index // columns
        col = index % columns
        x = margin + col * (tile_w + gap)
        y = margin + title_h + row * (tile_h + label_h + gap)
        framed = fit_image(Image.open(path), tile_w, tile_h)
        sheet.paste(framed, (x, y))
        draw.rectangle((x, y, x + tile_w, y + tile_h), outline="#d3cadc", width=2)
        draw.text((x, y + tile_h + 10), path.stem, fill="#211b2d", font=label_font)

    sheet.save(output, quality=92)
    update_state(project, output, images)
    print(f"OK  contact sheet: {output}")
    return output


def main() -> int:
    parser = argparse.ArgumentParser(description="Create Anansi keyframe contact sheet.")
    parser.add_argument("project_slug")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    write_contact_sheet(args.project_slug, args.output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
