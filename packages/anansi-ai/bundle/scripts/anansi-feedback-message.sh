#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: anansi-feedback-message.sh PROJECT_SLUG --gate GATE [--stage STAGE]

Prints a compact Telegram review message with native MEDIA attachment tags.

Gates:
  intake             questions before the brief
  stage              non-gate stage complete; asks for CONTINUE
  strategy           brief + mood + story review
  previsualization   storyboard + keyframes review
  render             clips + final cut review

Examples:
  anansi-feedback-message.sh hinter --gate strategy
  anansi-feedback-message.sh hinter --gate previsualization
  anansi-feedback-message.sh hinter --gate stage --stage mood
EOF
}

if [[ $# -lt 1 ]]; then
  usage >&2
  exit 64
fi

PROJECT_SLUG="$1"
shift

GATE=""
STAGE=""
PROJECT_ROOT="{{ANANSI_PROJECTS_DIR}}/$PROJECT_SLUG"
AGENT_HOME="{{ANANSI_AGENT_HOME}}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --gate)
      GATE="${2:-}"
      shift 2
      ;;
    --stage)
      STAGE="${2:-}"
      shift 2
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

if [[ -z "$GATE" ]]; then
  echo "Missing --gate" >&2
  usage >&2
  exit 64
fi

if [[ "$GATE" != "intake" && ! -d "$PROJECT_ROOT" ]]; then
  echo "Project folder not found: $PROJECT_ROOT" >&2
  exit 1
fi

media_for_dir() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
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
  \) -print | sort
}

is_media_file() {
  local file="$1"
  local lower
  lower="$(printf '%s' "$file" | tr '[:upper:]' '[:lower:]')"
  case "$lower" in
    *.pdf|*.png|*.jpg|*.jpeg|*.webp|*.gif|*.mp4|*.mov|*.html|*.docx|*.pptx|*.srt|*.vtt|*.edl|*.fcpxml)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

media_for_dir_shallow() {
  local dir="$1"
  local file
  [[ -d "$dir" ]] || return 0
  for file in "$dir"/*; do
    [[ -f "$file" ]] || continue
    is_media_file "$file" || continue
    printf '%s\n' "$file"
  done
}

collect_files() {
  local dir
  for dir in "$@"; do
    media_for_dir "$dir"
  done
}

collect_files_shallow() {
  local dir
  for dir in "$@"; do
    media_for_dir_shallow "$dir"
  done
}

media_count() {
  local count=0
  local file
  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    count=$((count + 1))
  done < <(collect_files "$@")
  printf '%s\n' "$count"
}

media_count_shallow() {
  local count=0
  local file
  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    count=$((count + 1))
  done < <(collect_files_shallow "$@")
  printf '%s\n' "$count"
}

pdf_count_shallow() {
  local count=0
  local dir file lower
  for dir in "$@"; do
    [[ -d "$dir" ]] || continue
    for file in "$dir"/*; do
      [[ -f "$file" ]] || continue
      lower="$(printf '%s' "$file" | tr '[:upper:]' '[:lower:]')"
      case "$lower" in
        *.pdf)
          count=$((count + 1))
          ;;
      esac
    done
  done
  printf '%s\n' "$count"
}

image_count_shallow() {
  local count=0
  local dir file lower
  for dir in "$@"; do
    [[ -d "$dir" ]] || continue
    for file in "$dir"/*; do
      [[ -f "$file" ]] || continue
      lower="$(printf '%s' "$file" | tr '[:upper:]' '[:lower:]')"
      case "$lower" in
        *.png|*.jpg|*.jpeg|*.webp|*.gif)
          count=$((count + 1))
          ;;
      esac
    done
  done
  printf '%s\n' "$count"
}

hyperframes_present() {
  local root="$PROJECT_ROOT/edit/hyperframes"
  [[ -d "$root" ]] || return 1
  [[ -f "$root/ANANSI-HYPERFRAMES-BRIEF.md" ]] && return 0
  [[ -f "$root/package.json" ]] && return 0
  find "$root" -maxdepth 2 -type f \( -iname '*.html' -o -iname '*.tsx' -o -iname '*.jsx' -o -iname '*.js' -o -iname '*.css' \) -print -quit | grep -q .
}

ensure_brief_attachment() {
  local brief_dir="$PROJECT_ROOT/brief"
  local md=""
  local output_pdf="$brief_dir/${PROJECT_SLUG}-creative-brief.pdf"
  local render_log="$brief_dir/brief-pdf-render.log"

  [[ -d "$brief_dir" ]] || return 0

  if find "$brief_dir" -maxdepth 1 -type f -iname '*.pdf' -print -quit | grep -q .; then
    return 0
  fi

  md="$(find "$brief_dir" -maxdepth 1 -type f -iname '*.md' ! -iname '*handoff*' -print | sort | head -1 || true)"
  if [[ -z "$md" ]]; then
    return 0
  fi

  "$AGENT_HOME/scripts/anansi-brief-pdf.sh" "$md" "$output_pdf" >"$render_log" 2>&1 || true
}

print_blocked_missing() {
  local gate="$1"
  shift
  echo "Phase: ${gate} blocked"
  echo "Missing required attachment(s):"
  local item
  for item in "$@"; do
    echo "- $item"
  done
  echo
  echo "Fix: generate the missing artifact, then rerun this message helper."
}

print_collected_media() {
  local as_document="$1"
  local max_files="$2"
  shift 2
  local printed="false"
  local count=0
  local file
  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    if [[ "$count" -ge "$max_files" ]]; then
      break
    fi
    if [[ "$printed" == "false" ]]; then
      echo
      if [[ "$as_document" == "true" ]]; then
        echo "[[as_document]]"
      fi
      printed="true"
    fi
    printf 'MEDIA:"%s"\n' "$file"
    count=$((count + 1))
  done < <(collect_files "$@")
}

print_collected_media_shallow() {
  local as_document="$1"
  local max_files="$2"
  shift 2
  local printed="false"
  local count=0
  local file
  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    if [[ "$count" -ge "$max_files" ]]; then
      break
    fi
    if [[ "$printed" == "false" ]]; then
      echo
      if [[ "$as_document" == "true" ]]; then
        echo "[[as_document]]"
      fi
      printed="true"
    fi
    printf 'MEDIA:"%s"\n' "$file"
    count=$((count + 1))
  done < <(collect_files_shallow "$@")
}

print_brief_media() {
  local printed="false"
  local file
  local brief_dir="$PROJECT_ROOT/brief"

  ensure_brief_attachment
  [[ -d "$brief_dir" ]] || return 0

  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    if [[ "$printed" == "false" ]]; then
      echo
      printed="true"
    fi
    printf 'MEDIA:"%s"\n' "$file"
    return 0
  done < <(find "$brief_dir" -maxdepth 1 -type f -iname '*.pdf' -print | sort)

}

print_strategy_media() {
  local printed="false"
  local file

  echo
  echo "[[as_document]]"

  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    printf 'MEDIA:"%s"\n' "$file"
    printed="true"
    break
  done < <(find "$PROJECT_ROOT/brief" -maxdepth 1 -type f -iname '*.pdf' -print 2>/dev/null | sort)

  local count=1
  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    if [[ "$count" -ge 12 ]]; then
      break
    fi
    printf 'MEDIA:"%s"\n' "$file"
    count=$((count + 1))
  done < <(collect_files "$PROJECT_ROOT/mood" "$PROJECT_ROOT/story")
}

print_render_media() {
  local printed="false"
  local count=0
  local file
  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    if [[ "$count" -ge 8 ]]; then
      break
    fi
    if [[ "$printed" == "false" ]]; then
      echo
      printed="true"
    fi
    printf 'MEDIA:"%s"\n' "$file"
    count=$((count + 1))
  done < <(collect_files "$PROJECT_ROOT/final" "$PROJECT_ROOT/edit/previews" "$PROJECT_ROOT/edit/hyperframes")
}

print_previsualization_media() {
  local printed="false"
  local count=0
  local file
  local storyboard="$PROJECT_ROOT/storyboard/storyboard.png"

  if [[ -f "$storyboard" ]]; then
    echo
    echo "[[as_document]]"
    printf 'MEDIA:"%s"\n' "$storyboard"
    printed="true"
    count=$((count + 1))
  fi

  while IFS= read -r file; do
    [[ -f "$file" ]] || continue
    [[ "$file" == "$storyboard" ]] && continue
    if [[ "$count" -ge 14 ]]; then
      break
    fi
    if [[ "$printed" == "false" ]]; then
      echo
      echo "[[as_document]]"
      printed="true"
    fi
    printf 'MEDIA:"%s"\n' "$file"
    count=$((count + 1))
  done < <(collect_files_shallow "$PROJECT_ROOT/storyboard" "$PROJECT_ROOT/keyframes")
}

print_stage_media() {
  case "$STAGE" in
    brief)
      ensure_brief_attachment
      print_brief_media
      ;;
    mood)
      print_collected_media_shallow "true" 8 "$PROJECT_ROOT/mood"
      ;;
    story)
      print_collected_media_shallow "false" 8 "$PROJECT_ROOT/story"
      ;;
    scene|storyboard|keyframes|previsualization)
      print_previsualization_media
      ;;
    runway)
      print_collected_media_shallow "false" 8 "$PROJECT_ROOT/runway/clips" "$PROJECT_ROOT/runway"
      ;;
    final|final-cut)
      print_render_media
      ;;
    *)
      print_collected_media_shallow "false" 8 "$PROJECT_ROOT/$STAGE"
      ;;
  esac
}

stage_missing_requirements() {
  local missing=()
  case "$STAGE" in
    brief)
      ensure_brief_attachment
      if [[ "$(pdf_count_shallow "$PROJECT_ROOT/brief")" -eq 0 ]]; then
        missing+=("branded creative brief PDF")
      fi
      ;;
    mood)
      if [[ "$(image_count_shallow "$PROJECT_ROOT/mood")" -eq 0 ]]; then
        missing+=("generated moodboard image")
      fi
      ;;
    scene|storyboard|keyframes|previsualization)
      if [[ ! -f "$PROJECT_ROOT/storyboard/storyboard.png" ]]; then
        missing+=("storyboard image")
      fi
      if [[ "$(image_count_shallow "$PROJECT_ROOT/keyframes")" -eq 0 ]]; then
        missing+=("generated keyframe images")
      fi
      ;;
    runway)
      if [[ "$(media_count_shallow "$PROJECT_ROOT/runway/clips")" -eq 0 ]]; then
        missing+=("rendered Runway clips")
      fi
      ;;
    final|final-cut)
      if ! hyperframes_present; then
        missing+=("HyperFrames composition project")
      fi
      if [[ "$(media_count "$PROJECT_ROOT/final" "$PROJECT_ROOT/edit/previews" "$PROJECT_ROOT/edit/hyperframes")" -eq 0 ]]; then
        missing+=("HyperFrames preview/export/proof artifact")
      fi
      ;;
  esac

  if [[ "${#missing[@]}" -gt 0 ]]; then
    print_blocked_missing "Stage ${STAGE}" "${missing[@]}"
    return 3
  fi
  return 0
}

case "$GATE" in
  intake)
    cat <<EOF
Phase: Intake
Need only blockers before I brief this:
1. Objective
2. Audience
3. Mandatories/assets

Reply in bullets. If a field is unknown, write ASSUME.
EOF
    ;;

  stage)
    if [[ -z "$STAGE" ]]; then
      echo "Missing --stage for --gate stage" >&2
      exit 64
    fi
    stage_missing_requirements || exit $?
    cat <<EOF
Phase: ${STAGE}
Done: artifact + handoff saved and attached.
Next: continue.

Reply CONTINUE, REVISE: ..., or PAUSE.
EOF
    print_stage_media
    ;;

  strategy)
    ensure_brief_attachment
    missing=()
    if [[ "$(pdf_count_shallow "$PROJECT_ROOT/brief")" -eq 0 ]]; then
      missing+=("branded creative brief PDF")
    fi
    if [[ "$(image_count_shallow "$PROJECT_ROOT/mood")" -eq 0 ]]; then
      missing+=("generated moodboard image")
    fi
    if [[ "${#missing[@]}" -gt 0 ]]; then
      print_blocked_missing "Strategy" "${missing[@]}"
      exit 3
    fi
    cat <<'EOF'
Review: Strategy
Decision: approve story direction before storyboard.
Check: brief truth, visual world, story arc.

Reply: APPROVE | REVISE: ... | AUTOPILOT | PAUSE
EOF
    print_strategy_media
    ;;

  previsualization)
    missing=()
    if [[ ! -f "$PROJECT_ROOT/storyboard/storyboard.png" ]]; then
      missing+=("storyboard image")
    fi
    if [[ "$(image_count_shallow "$PROJECT_ROOT/keyframes")" -eq 0 ]]; then
      missing+=("generated keyframe images")
    fi
    if [[ "${#missing[@]}" -gt 0 ]]; then
      print_blocked_missing "Previsualization" "${missing[@]}"
      exit 3
    fi
    cat <<'EOF'
Review: Previsualization
Decision: approve stills before Runway.
Check: scene order, realism/AI tells, client-material accuracy.

Reply: APPROVE | REVISE: scene-02 warmer; scene-04 fix hand | PAUSE
EOF
    print_previsualization_media
    ;;

  render)
    missing=()
    if ! hyperframes_present; then
      missing+=("HyperFrames composition project")
    fi
    if [[ "$(media_count "$PROJECT_ROOT/final" "$PROJECT_ROOT/edit/previews" "$PROJECT_ROOT/edit/hyperframes")" -eq 0 ]]; then
      missing+=("HyperFrames preview/export/proof artifact")
    fi
    if [[ "${#missing[@]}" -gt 0 ]]; then
      print_blocked_missing "Render" "${missing[@]}"
      exit 3
    fi
    cat <<'EOF'
Review: Render
Decision: keep or revise the cut.
Check: reveal timing, HyperFrames/captions, CTA.

Reply: APPROVE | REVISE: ... | AUTOPILOT | PAUSE
EOF
    print_render_media
    ;;

  *)
    echo "Unknown gate: $GATE" >&2
    usage >&2
    exit 64
    ;;
esac
