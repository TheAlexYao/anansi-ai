#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: anansi-runway-stage.sh PROJECT_SLUG [--payload-file PATH] [--overwrite] [--status]

Runs or resumes the Runway stage as one compact action:
- checks approved keyframes
- loads prepared Runway payloads or scene prompt files
- renders missing clips
- writes runway/Runway Handoff.md
- updates project.json
- prints only compact Telegram-safe output and MEDIA tags
EOF
}

if [[ $# -lt 1 ]]; then
  usage >&2
  exit 64
fi

PROFILE_ENV="{{ANANSI_HERMES_PROFILE}}/.env"
if [[ -f "$PROFILE_ENV" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$PROFILE_ENV"
  set +a
fi

STATUS_ONLY=0
for arg in "$@"; do
  if [[ "$arg" == "--status" ]]; then
    STATUS_ONLY=1
  fi
done

PYTHON="${ANANSI_PYTHON:-}"
if [[ -z "$PYTHON" ]]; then
  for candidate in \
    "/Library/Developer/CommandLineTools/usr/bin/python3" \
    "/usr/bin/python3" \
    "python3"
  do
    if [[ "$STATUS_ONLY" -eq 1 ]]; then
      if command -v "$candidate" >/dev/null 2>&1 || [[ -x "$candidate" ]]; then
        PYTHON="$candidate"
        break
      fi
    elif "$candidate" - <<'PY' >/dev/null 2>&1
import runwayml
PY
    then
      PYTHON="$candidate"
      break
    fi
  done
fi

if [[ -z "$PYTHON" ]]; then
  echo "NO Python with runwayml installed. Run: python3 -m pip install --user runwayml" >&2
  exit 1
fi

"$PYTHON" "{{ANANSI_AGENT_HOME}}/scripts/anansi-runway-stage.py" "$@"
