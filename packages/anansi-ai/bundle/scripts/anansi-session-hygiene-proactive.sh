#!/usr/bin/env bash
set -euo pipefail

PROFILE="{{ANANSI_HERMES_PROFILE}}"
PROJECTS_ROOT="{{ANANSI_PROJECTS_DIR}}"
THRESHOLD_TOKENS=30000
THRESHOLD_BYTES=750000
DRY_RUN="false"
FORCE="false"
QUIET="false"

usage() {
  cat <<'EOF'
Usage: anansi-session-hygiene-proactive.sh [options]

Prevents Anansi Telegram sessions from growing into gateway-shutdown territory.
It writes a compact project handoff, backs up active session mappings, and clears
the mapping so the next Telegram message starts fresh from project files.

Options:
  --profile PATH              Hermes profile path
  --projects-root PATH        Anansi projects root
  --threshold-tokens N        Rotate active sessions at or above N prompt tokens
  --threshold-bytes N         Rotate active session files at or above N bytes
  --dry-run                   Report what would happen without changing files
  --force                     Rotate any active session mapping
  --quiet                     Only print warnings/actions
  -h, --help                  Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --projects-root)
      PROJECTS_ROOT="$2"
      shift 2
      ;;
    --threshold-tokens)
      THRESHOLD_TOKENS="$2"
      shift 2
      ;;
    --threshold-bytes)
      THRESHOLD_BYTES="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    --force)
      FORCE="true"
      shift
      ;;
    --quiet)
      QUIET="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      exit 1
      ;;
  esac
done

python3 - "$PROFILE" "$PROJECTS_ROOT" "$THRESHOLD_TOKENS" "$THRESHOLD_BYTES" "$DRY_RUN" "$FORCE" "$QUIET" <<'PY'
import json
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

profile = Path(sys.argv[1]).expanduser()
projects_root = Path(sys.argv[2]).expanduser()
threshold_tokens = int(sys.argv[3])
threshold_bytes = int(sys.argv[4])
dry_run = sys.argv[5] == "true"
force = sys.argv[6] == "true"
quiet = sys.argv[7] == "true"

now = datetime.now(timezone.utc)
stamp = now.strftime("%Y%m%dT%H%M%SZ")
sessions_dir = profile / "sessions"
sessions_json = sessions_dir / "sessions.json"
backup_dir = sessions_dir / ".rotation-backups" / stamp
log_path = profile / "logs" / "session-hygiene.log"

def say(message, important=False):
    if important or not quiet:
        print(message)

def append_log(message):
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("a", encoding="utf-8") as handle:
        handle.write(f"{stamp} {message}\n")

def load_json(path, default):
    if not path.exists():
        return default
    try:
        raw = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        raw = path.read_text(errors="replace")
    if not raw.strip():
        return default
    return json.loads(raw)

def current_project_slug():
    pointer = projects_root / ".current-project"
    if pointer.exists():
        slug = pointer.read_text(encoding="utf-8").strip()
        if slug:
            return slug
    candidates = []
    if projects_root.exists():
        for child in projects_root.iterdir():
            if child.is_dir() and not child.name.startswith("."):
                pj = child / "project.json"
                if pj.exists():
                    candidates.append((pj.stat().st_mtime, child.name))
    if candidates:
        return sorted(candidates)[-1][1]
    return ""

def project_snapshot(slug):
    if not slug:
        return {}
    project_json = projects_root / slug / "project.json"
    data = load_json(project_json, {}) if project_json.exists() else {}
    return data if isinstance(data, dict) else {}

def candidate_session_files(session_id):
    if not session_id:
        return []
    names = [
        f"session_{session_id}.json",
        f"{session_id}.json",
        f"{session_id}.jsonl",
        f"session_{session_id}.jsonl",
    ]
    return [sessions_dir / name for name in names if (sessions_dir / name).exists()]

def session_size(files):
    return sum(path.stat().st_size for path in files if path.exists())

def write_handoff(slug, data, rotation_reasons, active):
    snapshot = project_snapshot(slug)
    project_dir = projects_root / slug if slug else projects_root
    recovery_dir = project_dir / "recovery"
    profile_memory = profile / "memories" / "rotation-handoff.md"

    lines = [
        "# Anansi Session Rotation Handoff",
        "",
        f"- timestamp_utc: {stamp}",
        f"- current_project: {slug or 'unknown'}",
        f"- reason: {', '.join(rotation_reasons) if rotation_reasons else 'manual rotation'}",
        f"- threshold_tokens: {threshold_tokens}",
        f"- threshold_bytes: {threshold_bytes}",
        "",
        "## Project State",
        "",
    ]

    if snapshot:
        for key in ["client", "project", "project_slug", "current_stage", "status", "last_updated"]:
            if snapshot.get(key):
                lines.append(f"- {key}: {snapshot.get(key)}")
        completed = snapshot.get("completed_stages") or snapshot.get("completed") or []
        if completed:
            lines.append(f"- completed_stages: {', '.join(map(str, completed))}")
        open_blockers = snapshot.get("open_blockers") or snapshot.get("blockers") or []
        if open_blockers:
            lines.append(f"- open_blockers: {', '.join(map(str, open_blockers))}")
        artifacts = snapshot.get("artifacts") or {}
        if isinstance(artifacts, dict) and artifacts:
            lines.append("")
            lines.append("## Known Artifacts")
            lines.append("")
            for name, value in artifacts.items():
                if isinstance(value, (str, int, float)):
                    lines.append(f"- {name}: {value}")
                elif isinstance(value, list):
                    trimmed = ", ".join(map(str, value[:6]))
                    suffix = " ..." if len(value) > 6 else ""
                    lines.append(f"- {name}: {trimmed}{suffix}")
    else:
        lines.append("- project.json: missing or unreadable")

    lines += [
        "",
        "## Active Sessions Rotated",
        "",
    ]
    for item in active:
        lines.append(
            f"- channel={item['channel']} session={item['session_id'] or 'unknown'} "
            f"tokens={item['tokens'] or 'unknown'} bytes={item['bytes']}"
        )

    lines += [
        "",
        "## Resume Rule",
        "",
        "Continue from project files, not from old chat context.",
    ]
    if slug:
        lines.append(
            f"Run the workflow-state helper before continuing: "
            f"`{{ANANSI_AGENT_HOME}}/scripts/anansi-workflow-state.sh {slug} --next`"
        )
    lines.append("")

    text = "\n".join(lines)
    if not dry_run:
        if slug:
            recovery_dir.mkdir(parents=True, exist_ok=True)
            (recovery_dir / "Session Rotation Handoff.md").write_text(text, encoding="utf-8")
        profile_memory.parent.mkdir(parents=True, exist_ok=True)
        profile_memory.write_text(text, encoding="utf-8")
    return text

if not sessions_json.exists():
    say(f"OK no sessions map found at {sessions_json}")
    append_log(f"OK no sessions map found at {sessions_json}")
    sys.exit(0)

try:
    sessions = load_json(sessions_json, {})
except json.JSONDecodeError as exc:
    say(f"WARN invalid sessions.json: {exc}", important=True)
    append_log(f"WARN invalid sessions.json: {exc}")
    sys.exit(2)

if not isinstance(sessions, dict) or not sessions:
    say("OK no active Telegram session mapping")
    append_log("OK no active Telegram session mapping")
    sys.exit(0)

active = []
reasons = []
for channel, value in sessions.items():
    if not isinstance(value, dict):
        continue
    session_id = value.get("session_id") or value.get("sessionId") or value.get("id")
    tokens = value.get("last_prompt_tokens") or value.get("prompt_tokens")
    files = candidate_session_files(session_id)
    total_bytes = session_size(files)
    item_reasons = []
    if force:
        item_reasons.append("forced")
    if isinstance(tokens, int) and tokens >= threshold_tokens:
        item_reasons.append(f"prompt_tokens>={threshold_tokens}")
    if total_bytes >= threshold_bytes:
        item_reasons.append(f"session_bytes>={threshold_bytes}")
    if value.get("resume_pending") is True:
        item_reasons.append("resume_pending")
    if value.get("suspended") is True:
        item_reasons.append("suspended")
    active.append({
        "channel": channel,
        "session_id": session_id,
        "tokens": tokens,
        "files": files,
        "bytes": total_bytes,
        "reasons": item_reasons,
    })
    reasons.extend(item_reasons)

if not reasons:
    for item in active:
        token_text = item["tokens"] if item["tokens"] is not None else "unknown"
        say(f"OK active session below limits: {item['channel']} tokens={token_text} bytes={item['bytes']}")
    append_log("OK active sessions below limits")
    sys.exit(0)

slug = current_project_slug()
unique_reasons = sorted(set(reasons))
say(f"ROTATE active session mapping: {', '.join(unique_reasons)}", important=True)
for item in active:
    token_text = item["tokens"] if item["tokens"] is not None else "unknown"
    say(f"- {item['channel']}: {item['session_id'] or 'unknown'} tokens={token_text} bytes={item['bytes']}", important=True)

write_handoff(slug, sessions, unique_reasons, active)

if dry_run:
    say("DRY_RUN no files changed", important=True)
    append_log(f"DRY_RUN would rotate {len(active)} active session mappings: {', '.join(unique_reasons)}")
    sys.exit(0)

backup_dir.mkdir(parents=True, exist_ok=True)
shutil.copy2(sessions_json, backup_dir / "sessions.json")
for item in active:
    for path in item["files"]:
        if path.exists():
            shutil.copy2(path, backup_dir / path.name)

sessions_json.write_text("{}\n", encoding="utf-8")
append_log(f"ROTATED {len(active)} active session mappings: {', '.join(unique_reasons)} backup={backup_dir}")
say(f"OK wrote compact handoff for project: {slug or 'unknown'}", important=True)
say(f"OK cleared sessions map. Backup: {backup_dir}", important=True)
say("Next Telegram message should start fresh and recover from project files.", important=True)
PY
