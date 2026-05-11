#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: anansi-brief-pdf.sh INPUT_BRIEF.md OUTPUT_BRIEF.pdf"
  echo "Example: anansi-brief-pdf.sh ~/anansi/projects/hinter/brief/Creative\\ Brief.md ~/anansi/projects/hinter/brief/Hinter\\ Creative\\ Brief.pdf"
}

if [[ $# -lt 2 ]]; then
  usage
  exit 1
fi

INPUT_MD="$1"
OUTPUT_PDF="$2"
AGENT_HOME="{{ANANSI_AGENT_HOME}}"

if [[ ! -f "$INPUT_MD" ]]; then
  echo "Input markdown not found: $INPUT_MD"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_PDF")"

HTML_OUT="${OUTPUT_PDF%.pdf}.html"
python3 "$AGENT_HOME/scripts/anansi-brief-pdf.py" "$INPUT_MD" "$HTML_OUT"

browser_bin=""
for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
do
  if [[ -x "$candidate" ]]; then
    browser_bin="$candidate"
    break
  fi
done

if [[ -z "$browser_bin" ]]; then
  echo "NO  Chrome/Brave/Chromium not found for PDF rendering."
  echo "OK  Branded HTML was created instead: $HTML_OUT"
  exit 2
fi

"$browser_bin" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --print-to-pdf="$OUTPUT_PDF" \
  "file://$HTML_OUT" >/dev/null 2>&1

if [[ -f "$OUTPUT_PDF" ]]; then
  echo "OK  wrote $OUTPUT_PDF"
  echo "OK  companion HTML: $HTML_OUT"
else
  echo "NO  PDF render failed. HTML is available: $HTML_OUT"
  exit 1
fi
