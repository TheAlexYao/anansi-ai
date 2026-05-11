#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: anansi-keyframe-gate.sh PROJECT_SLUG [--status]"
  echo "Example: anansi-keyframe-gate.sh hinter"
  exit 1
fi

PYTHON="${ANANSI_PYTHON:-}"
if [[ -z "$PYTHON" ]]; then
  for candidate in \
    "/Library/Developer/CommandLineTools/usr/bin/python3" \
    "/usr/bin/python3" \
    "python3"
  do
    if command -v "$candidate" >/dev/null 2>&1 || [[ -x "$candidate" ]]; then
      PYTHON="$candidate"
      break
    fi
  done
fi

if [[ -z "$PYTHON" ]]; then
  echo "No Python found." >&2
  exit 1
fi

"$PYTHON" "{{ANANSI_AGENT_HOME}}/scripts/anansi-keyframe-gate.py" "$@"
