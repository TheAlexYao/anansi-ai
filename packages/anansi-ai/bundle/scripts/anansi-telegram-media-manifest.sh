#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: anansi-telegram-media-manifest.sh PROJECT_SLUG [--stage STAGE] [--as-document]

Print MEDIA: attachment tags for generated Anansi review artifacts so
Hermes/Telegram will upload the files instead of pointing the team to a folder path.

Stages:
  all        every reviewable artifact under the project
  brief      branded brief PDFs
  mood       moodboard images / PDFs
  story      story/treatment artifacts
  strategy   brief + mood + story artifacts
  scene      storyboard images / PDFs
  keyframes  generated scene stills
  previsualization storyboard + keyframes
  runway     rendered Runway clips
  final      HyperFrames composition previews / final exports

Examples:
  anansi-telegram-media-manifest.sh hinter --stage brief
  anansi-telegram-media-manifest.sh hinter --stage keyframes --as-document
EOF
}

if [[ $# -lt 1 ]]; then
  usage >&2
  exit 64
fi

PROJECT_SLUG="$1"
shift

STAGE="all"
AS_DOCUMENT="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --stage)
      STAGE="${2:-}"
      shift 2
      ;;
    --as-document)
      AS_DOCUMENT="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 64
      ;;
  esac
done

PROJECT_ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT_SLUG"
AGENT_HOME="{{ANANSI_AGENT_HOME}}"

if [[ ! -d "$PROJECT_ROOT" ]]; then
  echo "Project folder not found: $PROJECT_ROOT" >&2
  exit 1
fi

case "$STAGE" in
  all)
    SEARCH_DIRS=("$PROJECT_ROOT")
    ;;
  brief)
    SEARCH_DIRS=("$PROJECT_ROOT/brief")
    ;;
  mood)
    SEARCH_DIRS=("$PROJECT_ROOT/mood")
    ;;
  story)
    SEARCH_DIRS=("$PROJECT_ROOT/story")
    ;;
  strategy)
    SEARCH_DIRS=("$PROJECT_ROOT/brief" "$PROJECT_ROOT/mood" "$PROJECT_ROOT/story")
    ;;
  scene|storyboard)
    SEARCH_DIRS=("$PROJECT_ROOT/storyboard")
    ;;
  keyframes)
    SEARCH_DIRS=("$PROJECT_ROOT/keyframes")
    ;;
  previsualization)
    SEARCH_DIRS=("$PROJECT_ROOT/storyboard" "$PROJECT_ROOT/keyframes")
    ;;
  runway)
    SEARCH_DIRS=("$PROJECT_ROOT/runway/clips" "$PROJECT_ROOT/runway")
    ;;
  final)
    SEARCH_DIRS=("$PROJECT_ROOT/final" "$PROJECT_ROOT/edit/previews" "$PROJECT_ROOT/edit/hyperframes")
    ;;
  *)
    echo "Unknown stage: $STAGE" >&2
    usage >&2
    exit 64
    ;;
esac

if [[ "$STAGE" == "brief" || "$STAGE" == "strategy" ]]; then
  brief_dir="$PROJECT_ROOT/brief"
  if [[ -d "$brief_dir" ]] && ! find "$brief_dir" -maxdepth 1 -type f -iname '*.pdf' -print -quit | grep -q .; then
    brief_md="$(find "$brief_dir" -maxdepth 1 -type f -iname '*.md' ! -iname '*handoff*' -print | sort | head -1 || true)"
    if [[ -n "$brief_md" ]]; then
      "$AGENT_HOME/scripts/anansi-brief-pdf.sh" "$brief_md" "$brief_dir/${PROJECT_SLUG}-creative-brief.pdf" >"$brief_dir/brief-pdf-render.log" 2>&1 || true
    fi
  fi
fi

if [[ "$STAGE" == "brief" || "$STAGE" == "strategy" ]]; then
  if ! find "$PROJECT_ROOT/brief" -maxdepth 1 -type f -iname '*.pdf' -print -quit 2>/dev/null | grep -q .; then
    echo "No branded creative brief PDF found for stage '$STAGE' in $PROJECT_ROOT/brief" >&2
    exit 2
  fi
fi

if [[ "$STAGE" == "final" ]]; then
  if [[ ! -d "$PROJECT_ROOT/edit/hyperframes" ]]; then
    echo "No HyperFrames composition found: $PROJECT_ROOT/edit/hyperframes" >&2
    exit 2
  fi
fi

FILES=()
for dir in "${SEARCH_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  while IFS= read -r -d '' file; do
    FILES+=("$file")
  done < <(
    find "$dir" -type f \( \
      -iname '*.pdf' -o \
      -iname '*.png' -o \
      -iname '*.jpg' -o \
      -iname '*.jpeg' -o \
      -iname '*.webp' -o \
      -iname '*.gif' -o \
      -iname '*.mp4' -o \
      -iname '*.mov' -o \
      -iname '*.html' -o \
      -iname '*.docx' -o \
      -iname '*.pptx' -o \
      -iname '*.srt' -o \
      -iname '*.vtt' -o \
      -iname '*.edl' -o \
      -iname '*.fcpxml' \
    \) -print0 | sort -z
  )
done

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No generated media artifacts found for stage '$STAGE' in $PROJECT_ROOT" >&2
  exit 2
fi

echo "Attach these files in Telegram by including these hidden MEDIA tags in the message:"
echo

if [[ "$AS_DOCUMENT" == "true" ]]; then
  echo "[[as_document]]"
fi

for file in "${FILES[@]}"; do
  echo "MEDIA:\"$file\""
done
