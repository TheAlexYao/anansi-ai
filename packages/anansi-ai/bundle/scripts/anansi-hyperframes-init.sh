#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: anansi-hyperframes-init.sh PROJECT_SLUG [--example blank]"
  echo "Example: anansi-hyperframes-init.sh hinter --example blank"
  exit 1
fi

PROJECT_SLUG="$1"
shift || true

EXAMPLE="blank"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --example)
      EXAMPLE="${2:-blank}"
      shift 2
      ;;
    -h|--help)
      echo "Usage: anansi-hyperframes-init.sh PROJECT_SLUG [--example blank]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

PROJECT_ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT_SLUG"
EDIT_ROOT="$PROJECT_ROOT/edit"
HYPERFRAMES_ROOT="$EDIT_ROOT/hyperframes"
AGENT_HOME="{{ANANSI_AGENT_HOME}}"

if [[ ! -d "$PROJECT_ROOT" ]]; then
  echo "No Anansi project found: $PROJECT_ROOT"
  exit 1
fi

"$AGENT_HOME/scripts/setup-hyperframes.sh"

if ! command -v node >/dev/null 2>&1; then
  echo "Cannot initialize HyperFrames until Node.js 22+ is installed."
  exit 1
fi

NODE_MAJOR="$(node --version | sed -E 's/^v([0-9]+).*/\1/')"
if [[ ! "$NODE_MAJOR" =~ ^[0-9]+$ || "$NODE_MAJOR" -lt 22 ]]; then
  echo "Cannot initialize HyperFrames: Node.js $(node --version) found, but Node.js 22+ is required."
  exit 1
fi

mkdir -p "$EDIT_ROOT"

if [[ -e "$HYPERFRAMES_ROOT" ]]; then
  echo "HyperFrames project already exists: $HYPERFRAMES_ROOT"
  echo "Leaving it untouched."
else
  cd "$EDIT_ROOT"
  npx hyperframes init hyperframes --non-interactive --example "$EXAMPLE"
fi

mkdir -p "$HYPERFRAMES_ROOT/assets/anansi-clips"

if [[ -d "$PROJECT_ROOT/runway/clips" ]]; then
  find "$PROJECT_ROOT/runway/clips" -maxdepth 1 -type f \( -name '*.mp4' -o -name '*.mov' -o -name '*.m4v' \) -print0 |
    while IFS= read -r -d '' clip; do
      ln -sf "$clip" "$HYPERFRAMES_ROOT/assets/anansi-clips/$(basename "$clip")"
    done
fi

cat > "$HYPERFRAMES_ROOT/ANANSI-HYPERFRAMES-BRIEF.md" <<EOF
# Anansi HyperFrames Composition Brief

Project: $PROJECT_SLUG

Use this HyperFrames project as the Final Cut composition layer.

Inputs to consult:

- $PROJECT_ROOT/Final Assembly Plan.md
- $PROJECT_ROOT/Runway Payloads.md
- $PROJECT_ROOT/runway/clips/
- $PROJECT_ROOT/edit/

Composition goals:

- preserve the approved Anansi story spine
- use approved Runway clips only
- add titles, captions, overlays, lower thirds, CTA cards, and timing polish only when they clarify the edit
- keep typography sparse, tasteful, and safe-zone compliant
- export previews to $PROJECT_ROOT/edit/previews/
- export approved finals to $PROJECT_ROOT/final/

Do not overwrite source clips.
EOF

echo
echo "OK  HyperFrames project ready:"
echo "    $HYPERFRAMES_ROOT"
echo
echo "Preview:"
echo "    cd \"$HYPERFRAMES_ROOT\" && npx hyperframes preview"
echo
echo "Render:"
echo "    cd \"$HYPERFRAMES_ROOT\" && npx hyperframes render --output \"$PROJECT_ROOT/final/${PROJECT_SLUG}-hyperframes.mp4\""
