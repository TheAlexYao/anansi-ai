#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: anansi-previsualization-stage.sh PROJECT_SLUG [--overwrite-storyboard] [--overwrite-keyframes]"
  echo "Runs storyboard generation, keyframe packet prep, keyframe generation, contact sheet, and project-state update as one compact stage action."
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

PROJECT_SLUG="$1"
shift || true

OVERWRITE_STORYBOARD=0
OVERWRITE_KEYFRAMES=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --overwrite-storyboard)
      OVERWRITE_STORYBOARD=1
      shift
      ;;
    --overwrite-keyframes)
      OVERWRITE_KEYFRAMES=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

AGENT_HOME="{{ANANSI_AGENT_HOME}}"
PROJECT_ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT_SLUG"
LOG_DIR="$PROJECT_ROOT/logs/previsualization"
STORYBOARD="$PROJECT_ROOT/storyboard/storyboard.png"
CONTACT_SHEET="$PROJECT_ROOT/keyframes/keyframe-contact-sheet.jpg"

if [[ ! -d "$PROJECT_ROOT" ]]; then
  echo "NO project folder: $PROJECT_ROOT" >&2
  exit 2
fi

mkdir -p "$LOG_DIR"

run_logged() {
  local label="$1"
  local log="$2"
  shift 2
  echo "RUN $label" >>"$LOG_DIR/previsualization-stage.log"
  set +e
  "$@" >"$log" 2>&1
  local status=$?
  set -e
  if [[ "$status" -ne 0 ]]; then
    echo "NO  $label failed"
    echo "    local log: $log"
    exit "$status"
  fi
}

allow_logged() {
  local label="$1"
  local log="$2"
  shift 2
  echo "RUN $label" >>"$LOG_DIR/previsualization-stage.log"
  set +e
  "$@" >"$log" 2>&1
  local status=$?
  set -e
  if [[ "$status" -ne 0 && "$status" -ne 2 ]]; then
    echo "NO  $label failed"
    echo "    local log: $log"
    exit "$status"
  fi
  return 0
}

"$AGENT_HOME/scripts/anansi-session-hygiene-proactive.sh" --quiet >/dev/null 2>&1 || true

if [[ ! -f "$STORYBOARD" || "$OVERWRITE_STORYBOARD" -eq 1 ]]; then
  storyboard_args=("$PROJECT_SLUG")
  if [[ "$OVERWRITE_STORYBOARD" -eq 1 ]]; then
    storyboard_args+=("--overwrite")
  fi
  run_logged "storyboard generation" "$LOG_DIR/storyboard-generation.log" \
    "$AGENT_HOME/scripts/anansi-generate-storyboard-hermes.sh" "${storyboard_args[@]}"
fi

allow_logged "keyframe packet/gate" "$LOG_DIR/keyframe-gate.log" \
  "$AGENT_HOME/scripts/anansi-keyframe-gate.sh" "$PROJECT_SLUG"

keyframe_args=("$PROJECT_SLUG")
if [[ "$OVERWRITE_KEYFRAMES" -eq 1 ]]; then
  keyframe_args+=("--overwrite")
fi
allow_logged "keyframe generation" "$LOG_DIR/keyframe-generation.log" \
  "$AGENT_HOME/scripts/anansi-generate-keyframes-hermes.sh" "${keyframe_args[@]}"

set +e
"$AGENT_HOME/scripts/anansi-keyframe-contact-sheet.sh" "$PROJECT_SLUG" >"$LOG_DIR/keyframe-contact-sheet.log" 2>&1
CONTACT_STATUS=$?
set -e

python3 - "$PROJECT_ROOT" "$STORYBOARD" "$CONTACT_SHEET" <<'PY'
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

project = Path(sys.argv[1])
storyboard = Path(sys.argv[2])
contact_sheet = Path(sys.argv[3])
state_path = project / "project.json"
if not state_path.exists():
    raise SystemExit(0)
try:
    data = json.loads(state_path.read_text(encoding="utf-8"))
except json.JSONDecodeError:
    raise SystemExit(0)

completed = data.setdefault("completed_stages", [])
stage_status = data.setdefault("stage_status", {})
artifacts = data.setdefault("artifacts", {})

for stage in ["scene", "keyframes"]:
    stage_status[stage] = "complete"
    if stage not in completed:
        completed.append(stage)

artifacts.setdefault("scene", [])
if storyboard.exists() and str(storyboard) not in artifacts["scene"]:
    artifacts["scene"].append(str(storyboard))

artifacts.setdefault("keyframes", [])
for path in [contact_sheet, *sorted((project / "keyframes").glob("scene-*.png"))]:
    if path.exists() and str(path) not in artifacts["keyframes"]:
        artifacts["keyframes"].append(str(path))

data["current_stage"] = "previsualization-review"
data["last_updated"] = datetime.now(timezone.utc).isoformat()
state_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
PY

keyframe_count="$(find "$PROJECT_ROOT/keyframes" -maxdepth 1 -type f -name 'scene-*.png' | wc -l | tr -d ' ')"

echo "OK previsualization ready"
echo "Storyboard: OK"
echo "Keyframes: $keyframe_count"
if [[ -f "$CONTACT_SHEET" ]]; then
  echo "Contact sheet: OK"
else
  echo "Contact sheet: skipped"
fi
echo "Next: Previsualization Gate"
echo
echo "[[as_document]]"
echo "MEDIA:\"$STORYBOARD\""
if [[ -f "$CONTACT_SHEET" ]]; then
  echo "[[as_document]]"
  echo "MEDIA:\"$CONTACT_SHEET\""
fi
for image in "$PROJECT_ROOT"/keyframes/scene-*.png; do
  [[ -f "$image" ]] || continue
  echo "MEDIA:\"$image\""
done
