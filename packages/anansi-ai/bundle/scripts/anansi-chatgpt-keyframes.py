#!/usr/bin/env python3
"""Create a no-API ChatGPT keyframe generation packet for Anansi.

This helper does not call OpenAI, FAL, Runway, or any remote API. It turns the
existing Anansi keyframe prompt files into a browser-friendly manual packet so
the team can use the logged-in ChatGPT image experience and save approved images
with the exact filenames Runway expects.
"""

from __future__ import annotations

import argparse
import html
import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path("{{ANANSI_PROJECTS_DIR}}")


def project_root(slug: str) -> Path:
    return PROJECT_ROOT / slug


def read_prompts(project: Path) -> list[tuple[str, str]]:
    prompts_dir = project / "keyframes" / "prompts"
    if not prompts_dir.exists():
        raise SystemExit(f"No prompt directory found: {prompts_dir}")

    prompts: list[tuple[str, str]] = []
    for prompt_file in sorted(prompts_dir.glob("scene-*.txt")):
        text = prompt_file.read_text(encoding="utf-8").strip()
        if text:
            prompts.append((prompt_file.stem, text))

    if not prompts:
        raise SystemExit(f"No scene prompt files found in: {prompts_dir}")
    return prompts


def manual_prompt(scene_id: str, prompt: str) -> str:
    return "\n".join(
        [
            "Create one cinematic keyframe image for this Anansi scene.",
            "",
            "Important:",
            "- This is a single production still, not a mood board and not a storyboard.",
            "- No text, logos, labels, watermarks, UI, or captions inside the image.",
            "- Keep the image physically realistic and Runway-ready.",
            "- Preserve the subject, materials, light behavior, atmosphere, and camera logic exactly.",
            "- If anything feels too synthetic, glossy, generic, or over-designed, make it warmer, more tactile, and more believable.",
            "",
            f"Scene id: {scene_id}",
            "",
            prompt.strip(),
            "",
            "Output only the image.",
        ]
    )


def markdown_packet(slug: str, project: Path, prompts: list[tuple[str, str]]) -> str:
    keyframes = project / "keyframes"
    lines = [
        f"# {slug} ChatGPT Keyframe Manual",
        "",
        "This is the no-API keyframe workflow.",
        "",
        "Use ChatGPT's logged-in image generation experience to create each still.",
        "Do not use OpenAI API keys, FAL, or Hermes' built-in image tool for this path.",
        "",
        "## Steps",
        "",
        "1. Open ChatGPT in the browser.",
        "2. For each scene below, copy the full prompt into ChatGPT image generation.",
        "3. Download or drag the approved image into the keyframes folder.",
        "4. Rename it to the exact filename shown for that scene.",
        "5. Run the keyframe status check before calling Runway.",
        "",
        "Keyframes folder:",
        "",
        f"`{keyframes}`",
        "",
        "Status check:",
        "",
        "```bash",
        f"\"{{ANANSI_AGENT_HOME}}/scripts/anansi-keyframe-gate.sh\" {slug} --status",
        "```",
        "",
        "## Scene Prompts",
        "",
    ]
    for scene_id, prompt in prompts:
        output_path = keyframes / f"{scene_id}.png"
        lines.extend(
            [
                f"### {scene_id}",
                "",
                f"Save approved image as: `{output_path}`",
                "",
                "```txt",
                manual_prompt(scene_id, prompt),
                "```",
                "",
            ]
        )
    return "\n".join(lines).rstrip() + "\n"


def html_packet(slug: str, project: Path, prompts: list[tuple[str, str]]) -> str:
    keyframes = project / "keyframes"
    sections = []
    for scene_id, prompt in prompts:
        prompt_text = manual_prompt(scene_id, prompt)
        output_path = keyframes / f"{scene_id}.png"
        sections.append(
            f"""
            <section class="scene">
              <div class="scene-head">
                <h2>{html.escape(scene_id)}</h2>
                <code>{html.escape(str(output_path))}</code>
              </div>
              <button type="button" data-copy="{html.escape(prompt_text, quote=True)}">Copy prompt</button>
              <pre>{html.escape(prompt_text)}</pre>
            </section>
            """
        )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(slug)} ChatGPT Keyframe Manual</title>
  <style>
    :root {{
      color-scheme: light;
      --ink: #171717;
      --muted: #626262;
      --line: #d9d3ca;
      --paper: #f7f3ec;
      --panel: #fffdf8;
      --accent: #7a4a33;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--paper);
      color: var(--ink);
      line-height: 1.45;
    }}
    main {{
      max-width: 980px;
      margin: 0 auto;
      padding: 32px 20px 56px;
    }}
    h1 {{
      margin: 0 0 8px;
      font-size: 30px;
      letter-spacing: 0;
    }}
    .intro {{
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 16px;
    }}
    .path {{
      display: block;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--panel);
      overflow-x: auto;
      white-space: nowrap;
      margin: 10px 0 28px;
    }}
    .scene {{
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      padding: 18px;
      margin: 18px 0;
    }}
    .scene-head {{
      display: grid;
      grid-template-columns: minmax(120px, 1fr) minmax(0, 3fr);
      gap: 12px;
      align-items: baseline;
      margin-bottom: 12px;
    }}
    h2 {{
      margin: 0;
      font-size: 18px;
    }}
    code {{
      color: var(--muted);
      overflow-wrap: anywhere;
    }}
    button {{
      appearance: none;
      border: 1px solid var(--accent);
      border-radius: 6px;
      background: var(--accent);
      color: white;
      padding: 9px 12px;
      font-size: 14px;
      cursor: pointer;
      margin-bottom: 12px;
    }}
    pre {{
      margin: 0;
      white-space: pre-wrap;
      background: #f1ebe1;
      border-radius: 6px;
      padding: 14px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
      line-height: 1.5;
    }}
    @media (max-width: 720px) {{
      .scene-head {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <main>
    <h1>{html.escape(slug)} ChatGPT Keyframe Manual</h1>
    <p class="intro">No API mode. Copy each prompt into logged-in ChatGPT image generation, then save the approved PNG with the exact filename shown.</p>
    <strong>Keyframes folder</strong>
    <code class="path">{html.escape(str(keyframes))}</code>
    {''.join(sections)}
  </main>
  <script>
    document.querySelectorAll("button[data-copy]").forEach((button) => {{
      button.addEventListener("click", async () => {{
        await navigator.clipboard.writeText(button.dataset.copy);
        const original = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => button.textContent = original, 1200);
      }});
    }});
  </script>
</body>
</html>
"""


def write_packets(slug: str, open_files: bool) -> int:
    project = project_root(slug)
    if not project.exists():
        raise SystemExit(f"No Anansi project found: {project}")

    prompts = read_prompts(project)
    keyframes = project / "keyframes"
    keyframes.mkdir(parents=True, exist_ok=True)

    md_path = project / "ChatGPT Keyframe Manual.md"
    html_path = keyframes / "chatgpt-keyframe-manual.html"
    md_path.write_text(markdown_packet(slug, project, prompts), encoding="utf-8")
    html_path.write_text(html_packet(slug, project, prompts), encoding="utf-8")

    print(f"OK  wrote {md_path}")
    print(f"OK  wrote {html_path}")
    print()
    print("No-API next step:")
    print("1. Open the HTML packet.")
    print("2. Copy each prompt into ChatGPT image generation.")
    print("3. Save approved PNGs with the exact scene filenames.")
    print()
    print(f"Open packet: {html_path}")

    if open_files:
        subprocess.run(["open", str(html_path)], check=False)
        subprocess.run(["open", "https://chatgpt.com/"], check=False)

    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Create no-API ChatGPT keyframe packet.")
    parser.add_argument("project_slug")
    parser.add_argument("--open", action="store_true", help="Open the local packet and ChatGPT in the browser.")
    args = parser.parse_args()
    return write_packets(args.project_slug, args.open)


if __name__ == "__main__":
    sys.exit(main())
