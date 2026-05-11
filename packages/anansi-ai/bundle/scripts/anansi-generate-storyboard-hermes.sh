#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: anansi-generate-storyboard-hermes.sh PROJECT_SLUG [--overwrite]" >&2
  echo "Example: anansi-generate-storyboard-hermes.sh hinter" >&2
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

PROJECT_SLUG="$1"
shift || true

OVERWRITE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --overwrite)
      OVERWRITE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

AGENT_HOME="{{ANANSI_AGENT_HOME}}"
PROJECT_ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT_SLUG"
STORYBOARD_DIR="$PROJECT_ROOT/storyboard"
PROMPT_FILE="$STORYBOARD_DIR/storyboard-prompt.txt"
OUTPUT_DIR="$STORYBOARD_DIR/hermes-output"
TARGET="$STORYBOARD_DIR/storyboard.png"
HERMES="${HERMES_BIN:-}"

if [[ -z "$HERMES" ]]; then
  for candidate in \
    "{{ANANSI_USER_HOME}}/.local/bin/hermes" \
    "/opt/homebrew/bin/hermes" \
    "/usr/local/bin/hermes" \
    "$HOME/.local/bin/hermes" \
    "$(command -v hermes 2>/dev/null || true)"
  do
    if [[ -n "$candidate" && -x "$candidate" ]]; then
      HERMES="$candidate"
      break
    fi
  done
fi

if [[ ! -x "$HERMES" ]]; then
  echo "Hermes binary not found: $HERMES" >&2
  echo "Use HERMES_BIN={{ANANSI_USER_HOME}}/.local/bin/hermes if you need to override this." >&2
  exit 1
fi

if [[ -f "$TARGET" && "$OVERWRITE" -ne 1 ]]; then
  echo "SKIP storyboard already exists: $TARGET"
  "$AGENT_HOME/scripts/anansi-storyboard-gate.sh" "$PROJECT_SLUG" --status
  exit 0
fi

set +e
"$AGENT_HOME/scripts/anansi-storyboard-gate.sh" "$PROJECT_SLUG"
GATE_STATUS=$?
set -e

if [[ "$GATE_STATUS" -ne 0 && "$GATE_STATUS" -ne 2 ]]; then
  exit "$GATE_STATUS"
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Storyboard prompt missing: $PROMPT_FILE" >&2
  exit 1
fi

mkdir -p "$STORYBOARD_DIR" "$OUTPUT_DIR"

extract_image_path() {
  python3 - "$1" <<PY
import re
import sys

text = open(sys.argv[1], encoding="utf-8", errors="ignore").read()
matches = re.findall(r"/Users/[^\n\r]+?\.png", text)
if matches:
    print(matches[-1])
PY
}

prompt="$(cat "$PROMPT_FILE")"
request_file="$OUTPUT_DIR/request.txt"
cat >"$request_file" <<EOF_REQUEST
Use the image generation tool to create one Anansi storyboard image.

This must use the configured Hermes image generation backend. Do not ask for an API key.

Hard requirements:
- Create a storyboard, not a mood board.
- It must be a sequential director's storyboard sheet with numbered panels.
- It must not be a keyframe contact sheet.
- It must not be a single poster, collage, splash image, or moodboard.
- Panels must progress left to right and top to bottom.
- Use one clear shot/action per panel.
- Keep captions minimal and sparse. Avoid long readable text.
- Preserve client materials, subject continuity, material logic, light logic, and camera intent.

Prompt:
$prompt

After generating, return only the saved local image path.
EOF_REQUEST
request="$(cat "$request_file")"

log_file="$OUTPUT_DIR/storyboard.txt"
echo "GENERATE storyboard with Hermes GPT Image 2 / Codex OAuth..."
set +e
(
  cd "$AGENT_HOME"
  "$HERMES" -p anansi -t image_gen -z "$request"
) >"$log_file" 2>&1
status=$?
set -e

if [[ "$status" -ne 0 ]]; then
  echo "NO  Hermes storyboard generation failed. See: $log_file" >&2
  cat "$log_file" >&2
  exit "$status"
fi

generated_path="$(extract_image_path "$log_file")"
if [[ -z "$generated_path" || ! -f "$generated_path" ]]; then
  echo "NO  Could not find generated storyboard image path. See: $log_file" >&2
  cat "$log_file" >&2
  exit 1
fi

cp "$generated_path" "$TARGET"
echo "OK  storyboard -> $TARGET"
echo
"$AGENT_HOME/scripts/anansi-storyboard-gate.sh" "$PROJECT_SLUG" --status
