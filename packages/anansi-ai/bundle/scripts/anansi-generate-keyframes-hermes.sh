#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: anansi-generate-keyframes-hermes.sh PROJECT_SLUG [--scene scene-01] [--overwrite]"
  echo "Example: anansi-generate-keyframes-hermes.sh hinter --scene scene-01"
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

PROJECT_SLUG="$1"
shift || true

SCENE_FILTER=""
OVERWRITE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --scene)
      SCENE_FILTER="${2:-}"
      if [[ -z "$SCENE_FILTER" ]]; then
        echo "Missing value for --scene"
        exit 1
      fi
      shift 2
      ;;
    --overwrite)
      OVERWRITE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

AGENT_HOME="{{ANANSI_AGENT_HOME}}"
PROJECT_ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT_SLUG"
PROMPTS_DIR="$PROJECT_ROOT/keyframes/prompts"
KEYFRAMES_DIR="$PROJECT_ROOT/keyframes"
OUTPUT_DIR="$KEYFRAMES_DIR/hermes-output"
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
  echo "Hermes binary not found: $HERMES"
  echo "Note: inside Hermes, HOME may point at {{ANANSI_HERMES_PROFILE}}/home."
  echo "Use HERMES_BIN={{ANANSI_USER_HOME}}/.local/bin/hermes if you need to override this."
  exit 1
fi

set +e
"$AGENT_HOME/scripts/anansi-keyframe-gate.sh" "$PROJECT_SLUG"
GATE_STATUS=$?
set -e

if [[ "$GATE_STATUS" -ne 0 && "$GATE_STATUS" -ne 2 ]]; then
  exit "$GATE_STATUS"
fi

if [[ ! -d "$PROMPTS_DIR" ]]; then
  echo "Prompt directory missing: $PROMPTS_DIR"
  exit 1
fi

mkdir -p "$KEYFRAMES_DIR" "$OUTPUT_DIR"

shopt -s nullglob
PROMPT_FILES=("$PROMPTS_DIR"/scene-*.txt)
shopt -u nullglob

if [[ "${#PROMPT_FILES[@]}" -eq 0 ]]; then
  echo "No scene prompt files found in: $PROMPTS_DIR"
  exit 1
fi

extract_image_path() {
  python3 - "$1" <<'PY'
import re
import sys

text = open(sys.argv[1], encoding="utf-8", errors="ignore").read()
matches = re.findall(r"/Users/[^\s`]+?\.png", text)
if matches:
    print(matches[-1])
PY
}

generated=0
skipped=0

for prompt_file in "${PROMPT_FILES[@]}"; do
  scene_id="$(basename "$prompt_file" .txt)"
  if [[ -n "$SCENE_FILTER" && "$scene_id" != "$SCENE_FILTER" ]]; then
    continue
  fi

  target="$KEYFRAMES_DIR/$scene_id.png"
  if [[ -f "$target" && "$OVERWRITE" -ne 1 ]]; then
    echo "SKIP $scene_id already exists: $target"
    skipped=$((skipped + 1))
    continue
  fi

  prompt="$(cat "$prompt_file")"
  request="$(cat <<EOF
Use the image generation tool to create one cinematic Anansi keyframe image.

This must use the configured Hermes image generation backend. Do not ask for an API key.

Scene id: $scene_id

Requirements:
- single production still, not a mood board and not a storyboard
- no text, logos, labels, watermarks, UI, or captions inside the image
- physically realistic and Runway-ready
- preserve the subject, materials, light behavior, atmosphere, and camera logic
- avoid synthetic gloss, generic luxury advertising, permanent infrastructure, and fake CGI

Prompt:
$prompt

After generating, return only the saved local image path.
EOF
)"

  log_file="$OUTPUT_DIR/$scene_id.txt"
  echo "GENERATE $scene_id with Hermes GPT Image 2 / Codex OAuth..."
  set +e
  (
    cd "$AGENT_HOME"
    "$HERMES" -p anansi -t image_gen -z "$request"
  ) >"$log_file" 2>&1
  status=$?
  set -e

  if [[ "$status" -ne 0 ]]; then
    echo "NO  Hermes image generation failed for $scene_id. See: $log_file"
    cat "$log_file"
    exit "$status"
  fi

  generated_path="$(extract_image_path "$log_file")"
  if [[ -z "$generated_path" || ! -f "$generated_path" ]]; then
    echo "NO  Could not find generated image path for $scene_id. See: $log_file"
    cat "$log_file"
    exit 1
  fi

  cp "$generated_path" "$target"
  echo "OK  $scene_id -> $target"
  generated=$((generated + 1))
done

if [[ -n "$SCENE_FILTER" && "$generated" -eq 0 && "$skipped" -eq 0 ]]; then
  echo "No matching scene prompt found for: $SCENE_FILTER"
  exit 1
fi

echo
echo "Generated: $generated"
echo "Skipped:   $skipped"
echo
"$AGENT_HOME/scripts/anansi-keyframe-gate.sh" "$PROJECT_SLUG" --status
