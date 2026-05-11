#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: anansi-workflow-state.sh PROJECT_SLUG [--next|--stage STAGE --status STATUS|--artifact STAGE PATH|--blocker TEXT|--clear-blockers]"
  exit 1
fi

PROJECT="$1"
shift || true

ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT"
STATE="$ROOT/project.json"
PROJECTS_ROOT="{{ANANSI_PROJECTS_DIR}}"

if [[ ! -d "$ROOT" ]]; then
  echo "NO project folder: $ROOT"
  echo "Run: {{ANANSI_AGENT_HOME}}/scripts/anansi-new-project.sh $PROJECT"
  exit 2
fi

printf "%s\n" "$PROJECT" > "$PROJECTS_ROOT/.current-project"

python3 - "$STATE" "$@" <<'PY'
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

state_path = Path(sys.argv[1])
args = sys.argv[2:]

stage_order = [
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
    "complete",
]

next_prompts = {
    "intake": "Ask only blocking intake questions, then update intake complete.",
    "brief": "Run anansi-brief only. Produce brief PDF and brief/Brief Handoff.md.",
    "mood": "Run anansi-mood-weaver only. Read brief/Brief Handoff.md, produce moodboard and mood/Mood Handoff.md.",
    "story": "Run anansi-story-weaver only. Read mood/Mood Handoff.md, produce story/Story Handoff.md with direction, arc, and why it works; then present Strategy Gate.",
    "strategy-review": "Wait for Strategy Gate approval before storyboard. the team must approve story direction, visual world, and brief truth.",
    "scene": "Run anansi-scene-weaver only after strategy-review is approved. Then run anansi-previsualization-stage.sh PROJECT as one batch to produce storyboard, scene handoff, keyframes, and contact sheet.",
    "keyframes": "Run anansi-previsualization-stage.sh PROJECT if keyframes/contact sheet are missing; then present Previsualization Gate packet.",
    "previsualization-review": "Wait for Previsualization Gate approval before paid Runway work.",
    "runway": "Run anansi-runway-render only, then use anansi-runway-stage.sh PROJECT as the single render action. It produces/resumes clips and runway/Runway Handoff.md with compact MEDIA output.",
    "final-cut": "Run anansi-final-cut only. Create HyperFrames composition, export/preview, and final/Final Handoff.md.",
    "render-review": "Wait for Render Gate keep/revise/final approval.",
    "learning": "File reusable feedback into project log, client memory, Obsidian, and skill/rule updates when appropriate.",
    "complete": "Workflow complete.",
}

def load_state():
    if not state_path.exists():
        return {}
    try:
        return json.loads(state_path.read_text())
    except json.JSONDecodeError as exc:
        raise SystemExit(f"NO invalid project.json: {exc}")

def save_state(data):
    data.setdefault("stage_order", stage_order)
    data.setdefault("completed_stages", [])
    data.setdefault("stage_status", {})
    data.setdefault("artifacts", {})
    data.setdefault("open_blockers", [])
    data.setdefault("reliability", {
        "stage_isolated": True,
        "max_major_skill_per_turn": 1,
        "continue_from_handoffs": True,
    })
    data["last_updated"] = datetime.now(timezone.utc).isoformat()
    state_path.write_text(json.dumps(data, indent=2) + "\n")

def first_incomplete(data):
    completed = set(data.get("completed_stages", []))
    statuses = data.get("stage_status", {})
    for stage in data.get("stage_order", stage_order):
        if stage == "complete":
            return "complete"
        status = statuses.get(stage)
        if stage not in completed and status not in {"complete", "approved"}:
            return stage
    return "complete"

data = load_state()
data.setdefault("project", state_path.parent.name)
data.setdefault("status", "created")
data.setdefault("paths", {"root": str(state_path.parent)})
data.setdefault("stage_order", stage_order)
data.setdefault("completed_stages", [])
data.setdefault("stage_status", {})
data.setdefault("artifacts", {})
data.setdefault("open_blockers", [])

if not args or args == ["--status"]:
    stage = data.get("current_stage") or first_incomplete(data)
    print(f"Project: {data.get('project')}")
    print(f"Current stage: {stage}")
    print(f"Completed: {', '.join(data.get('completed_stages', [])) or 'none'}")
    blockers = data.get("open_blockers", [])
    if blockers:
        print("Open blockers:")
        for blocker in blockers:
            print(f"- {blocker}")
    sys.exit(0)

if args == ["--next"]:
    stage = first_incomplete(data)
    data["current_stage"] = stage
    save_state(data)
    print(f"NEXT_STAGE={stage}")
    print(next_prompts.get(stage, "Continue from the latest handoff."))
    sys.exit(0)

i = 0
changed = False
while i < len(args):
    arg = args[i]
    if arg == "--stage":
        stage = args[i + 1]
        if stage not in stage_order:
            raise SystemExit(f"NO unknown stage: {stage}")
        data["current_stage"] = stage
        changed = True
        i += 2
    elif arg == "--status":
        status = args[i + 1]
        stage = data.get("current_stage") or first_incomplete(data)
        data.setdefault("stage_status", {})[stage] = status
        if status in {"complete", "approved"} and stage not in data.setdefault("completed_stages", []):
            data["completed_stages"].append(stage)
        if status in {"complete", "approved"}:
            data["current_stage"] = first_incomplete(data)
        changed = True
        i += 2
    elif arg == "--artifact":
        stage = args[i + 1]
        artifact = args[i + 2]
        data.setdefault("artifacts", {}).setdefault(stage, [])
        if artifact not in data["artifacts"][stage]:
            data["artifacts"][stage].append(artifact)
        changed = True
        i += 3
    elif arg == "--blocker":
        blocker = args[i + 1]
        data.setdefault("open_blockers", [])
        if blocker not in data["open_blockers"]:
            data["open_blockers"].append(blocker)
        changed = True
        i += 2
    elif arg == "--clear-blockers":
        data["open_blockers"] = []
        changed = True
        i += 1
    else:
        raise SystemExit(f"NO unknown argument: {arg}")

if changed:
    save_state(data)
    print(f"OK project state updated: {state_path}")
    print(f"Current stage: {data.get('current_stage')}")
    print(f"Completed: {', '.join(data.get('completed_stages', [])) or 'none'}")
PY
