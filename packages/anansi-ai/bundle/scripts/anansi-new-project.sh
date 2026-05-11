#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: anansi-new-project.sh PROJECT_SLUG"
  echo "Example: anansi-new-project.sh hinter-test"
  exit 1
fi

PROJECT="$1"
PROJECTS_ROOT="{{ANANSI_PROJECTS_DIR}}"
ROOT="$PROJECTS_ROOT/$PROJECT"

mkdir -p \
  "$ROOT/brief" \
  "$ROOT/mood" \
  "$ROOT/story" \
  "$ROOT/storyboard" \
  "$ROOT/keyframes" \
  "$ROOT/runway/payloads" \
  "$ROOT/runway/clips" \
  "$ROOT/edit" \
  "$ROOT/final"

STATE="$ROOT/project.json"
if [[ ! -f "$STATE" ]]; then
  cat > "$STATE" <<JSON
{
  "project": "$PROJECT",
  "status": "created",
  "workflow": "brief -> mood -> story -> scene -> images -> runway -> final-cut",
  "paths": {
    "root": "$ROOT",
    "brief": "$ROOT/brief",
    "mood": "$ROOT/mood",
    "story": "$ROOT/story",
    "storyboard": "$ROOT/storyboard",
    "keyframes": "$ROOT/keyframes",
    "runway_payloads": "$ROOT/runway/payloads",
    "runway_clips": "$ROOT/runway/clips",
    "edit": "$ROOT/edit",
    "final": "$ROOT/final"
  },
  "current_stage": "intake",
  "stage_order": [
    "intake",
    "brief",
    "mood",
    "story",
    "strategy-review",
    "scene",
    "keyframes",
    "previsualization-review",
    "runway",
    "final-cut",
    "render-review",
    "learning",
    "complete"
  ],
  "completed_stages": [],
  "stage_status": {
    "intake": "created"
  },
  "artifacts": {},
  "open_blockers": [],
  "reliability": {
    "stage_isolated": true,
    "max_major_skill_per_turn": 1,
    "continue_from_handoffs": true
  },
  "notes": []
}
JSON
fi

printf "%s\n" "$PROJECT" > "$PROJECTS_ROOT/.current-project"

cat <<TXT
Created Anansi project:
$ROOT

Use these folders:
- keyframes: $ROOT/keyframes
- Runway clips: $ROOT/runway/clips
- final exports: $ROOT/final

State file:
$STATE
TXT
