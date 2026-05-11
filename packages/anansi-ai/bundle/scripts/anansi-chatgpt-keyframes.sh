#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: anansi-chatgpt-keyframes.sh PROJECT_SLUG [--open]"
  echo "Example: anansi-chatgpt-keyframes.sh hinter --open"
  exit 1
fi

PROJECT_SLUG="$1"
shift || true

AGENT_HOME="{{ANANSI_AGENT_HOME}}"

set +e
"$AGENT_HOME/scripts/anansi-keyframe-gate.sh" "$PROJECT_SLUG"
GATE_STATUS=$?
set -e

if [[ "$GATE_STATUS" -ne 0 && "$GATE_STATUS" -ne 2 ]]; then
  exit "$GATE_STATUS"
fi

PYTHON="${ANANSI_PYTHON:-python3}"
"$PYTHON" "$AGENT_HOME/scripts/anansi-chatgpt-keyframes.py" "$PROJECT_SLUG" "$@"
