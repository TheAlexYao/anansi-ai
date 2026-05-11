#!/usr/bin/env python3
"""Render an Anansi creative brief markdown file to branded HTML.

The companion shell script prints the HTML to PDF with a local browser when
available. This file intentionally has no third-party Python dependencies.
"""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path


BRAND = {
    "bg": "#12061f",
    "bg_deep": "#070516",
    "panel": "#211d32",
    "panel_strong": "#2a253d",
    "line": "#bf9fff",
    "line_soft": "#e0d2ff",
    "text": "#fbf8ff",
    "muted": "#e2d9f0",
    "dim": "#baa0a2",
    "violet": "#8e68ff",
    "violet_2": "#b59aff",
    "cyan": "#69dbff",
    "rose": "#d9b8c7",
}


def inline_md(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    return escaped


def convert_markdown(markdown: str) -> str:
    lines = markdown.splitlines()
    out: list[str] = []
    in_ul = False
    in_table = False

    def close_ul() -> None:
        nonlocal in_ul
        if in_ul:
            out.append("</ul>")
            in_ul = False

    def close_table() -> None:
        nonlocal in_table
        if in_table:
            out.append("</tbody></table>")
            in_table = False

    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()

        if not stripped:
            close_ul()
            close_table()
            continue

        if stripped.startswith("|") and stripped.endswith("|"):
            close_ul()
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            if all(set(c) <= {"-", ":", " "} for c in cells):
                continue
            if not in_table:
                out.append("<table><tbody>")
                in_table = True
            tag = "th" if not any("<tr>" in row for row in out[-1:]) else "td"
            if cells and all(cells):
                row = "".join(f"<{tag}>{inline_md(c)}</{tag}>" for c in cells)
                out.append(f"<tr>{row}</tr>")
            continue

        close_table()

        heading = re.match(r"^(#{1,4})\s+(.+)$", stripped)
        if heading:
            close_ul()
            level = min(len(heading.group(1)), 4)
            text = inline_md(heading.group(2))
            out.append(f"<h{level}>{text}</h{level}>")
            continue

        bullet = re.match(r"^[-*]\s+(.+)$", stripped)
        if bullet:
            if not in_ul:
                out.append("<ul>")
                in_ul = True
            out.append(f"<li>{inline_md(bullet.group(1))}</li>")
            continue

        close_ul()
        out.append(f"<p>{inline_md(stripped)}</p>")

    close_ul()
    close_table()
    return "\n".join(out)


def html_doc(title: str, markdown: str) -> str:
    body = convert_markdown(markdown)
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)}</title>
  <style>
    @page {{
      size: Letter;
      margin: 0.55in;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      color: {BRAND["text"]};
      background:
        radial-gradient(circle at 16% 8%, #8e68ff42, transparent 22rem),
        radial-gradient(circle at 86% 18%, #69dbff24, transparent 22rem),
        linear-gradient(145deg, {BRAND["bg"]}, {BRAND["bg_deep"]});
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .page {{
      min-height: 10in;
      padding: 0.38in;
      border: 1px solid #e0d2ff42;
      border-radius: 18px;
      background: linear-gradient(#211d32d9, #12061fd9);
      box-shadow: inset 0 1px #ffffff1c;
    }}
    .brand {{
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding-bottom: 18px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e0d2ff33;
    }}
    .brand h1 {{
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 34pt;
      line-height: 0.92;
      letter-spacing: 0;
    }}
    .brand p {{
      margin: 8px 0 0;
      color: {BRAND["muted"]};
      font-size: 10pt;
    }}
    .badge {{
      align-self: flex-start;
      color: {BRAND["violet_2"]};
      border: 1px solid #bf9fff73;
      border-radius: 999px;
      padding: 7px 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 8.5pt;
      white-space: nowrap;
    }}
    h1, h2, h3, h4 {{
      break-after: avoid;
      letter-spacing: 0;
    }}
    h1 {{
      margin: 22px 0 10px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 25pt;
      line-height: 1;
    }}
    h2 {{
      margin: 20px 0 9px;
      color: {BRAND["violet_2"]};
      font-size: 13pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }}
    h3 {{
      margin: 14px 0 6px;
      color: {BRAND["rose"]};
      font-size: 11.5pt;
    }}
    h4 {{
      margin: 12px 0 4px;
      color: {BRAND["cyan"]};
      font-size: 10.5pt;
    }}
    p {{
      margin: 5px 0 9px;
      color: #fbf8ffe8;
    }}
    ul {{
      margin: 6px 0 12px 0;
      padding: 0;
      list-style: none;
    }}
    li {{
      margin: 4px 0;
      padding-left: 14px;
      position: relative;
      color: #e2d9f0e0;
    }}
    li:before {{
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: {BRAND["violet"]};
      position: absolute;
      left: 0;
      top: 0.58em;
    }}
    code {{
      color: #d8caff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.92em;
    }}
    strong {{
      color: {BRAND["text"]};
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 14px;
      break-inside: avoid;
    }}
    th, td {{
      border: 1px solid #e0d2ff33;
      padding: 7px 8px;
      vertical-align: top;
      color: #e2d9f0e0;
    }}
    th {{
      color: {BRAND["text"]};
      background: #8e68ff2b;
      font-size: 8.8pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    footer {{
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e0d2ff2b;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      color: {BRAND["dim"]};
      font-size: 8.5pt;
    }}
  </style>
</head>
<body>
  <main class="page">
    <header class="brand">
      <div>
        <h1>Anansi</h1>
        <p>Creative direction, kept human. From brief to final frame.</p>
      </div>
      <div class="badge">Creative Brief</div>
    </header>
    {body}
    <footer>
      <span>Cinematic. Intentional. On brand.</span>
      <span>Generated by Anansi</span>
    </footer>
  </main>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="Create branded Anansi brief HTML from markdown.")
    parser.add_argument("input_md")
    parser.add_argument("output_html")
    parser.add_argument("--title", default="Anansi Creative Brief")
    args = parser.parse_args()

    source = Path(args.input_md)
    output = Path(args.output_html)
    output.parent.mkdir(parents=True, exist_ok=True)
    markdown = source.read_text(encoding="utf-8")
    output.write_text(html_doc(args.title, markdown), encoding="utf-8")
    print(f"OK  wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
