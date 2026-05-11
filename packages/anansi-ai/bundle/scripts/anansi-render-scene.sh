#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 4 ]]; then
  echo "Usage: anansi-render-scene.sh PROJECT_SLUG SCENE_ID IMAGE_PATH PROMPT"
  echo "Example: anansi-render-scene.sh hinter-test scene-01 ~/anansi/projects/hinter-test/keyframes/scene-01.png \"slow push-in through morning fog\""
  exit 1
fi

PROJECT="$1"
SCENE_ID="$2"
IMAGE_PATH="$3"
PROMPT="$4"
ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT"
OUT="$ROOT/runway/clips/$SCENE_ID.mp4"
PROFILE_ENV="{{ANANSI_HERMES_PROFILE}}/.env"

mkdir -p "$ROOT/runway/clips"

if [[ -f "$PROFILE_ENV" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$PROFILE_ENV"
  set +a
fi

PYTHON="${ANANSI_PYTHON:-}"
if [[ -z "$PYTHON" ]]; then
  for candidate in \
    "/Library/Developer/CommandLineTools/usr/bin/python3" \
    "/usr/bin/python3" \
    "python3"
  do
    if "$candidate" - <<'PY' >/dev/null 2>&1
import runwayml
PY
    then
      PYTHON="$candidate"
      break
    fi
  done
fi

if [[ -z "$PYTHON" ]]; then
  echo "No Python with runwayml installed. Run: python3 -m pip install --user runwayml" >&2
  exit 1
fi

"$PYTHON" "{{ANANSI_AGENT_HOME}}/scripts/runway-i2v.py" \
  --image "$IMAGE_PATH" \
  --prompt "$PROMPT" \
  --out "$OUT" \
  --ratio 720:1280 \
  --duration 5

echo "Scene rendered to: $OUT"
