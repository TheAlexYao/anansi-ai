#!/usr/bin/env bash
set -euo pipefail

SERVICE="anansi-runway-api-key"
FAL_SERVICE="anansi-fal-key"
OPENAI_SERVICE="anansi-openai-api-key"
ACCOUNT="${USER:-teambrukhman}"
REAL_USER_HOME="{{ANANSI_USER_HOME}}"
HERMES_BIN="${HERMES_BIN:-$REAL_USER_HOME/.local/bin/hermes}"
HERMES_PY="$REAL_USER_HOME/.hermes/hermes-agent/venv/bin/python"
AGENT_HOME="{{ANANSI_AGENT_HOME}}"
VAULT="{{ANANSI_VAULT_PATH}}"
HERMES="{{ANANSI_HERMES_PROFILE}}"
PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "Checking Anansi readiness..."
echo

check_path() {
  local label="$1"
  local path="$2"
  if [[ -e "$path" ]]; then
    echo "OK  $label"
  else
    echo "NO  $label: $path"
  fi
}

check_path "Anansi Agent folder" "$AGENT_HOME"
check_path "Obsidian vault" "$VAULT"
check_path "Local Hermes profile" "$HERMES"
check_path "Startup map" "$VAULT/Anansi Agent Startup Map.md"
check_path "Brief skill" "$AGENT_HOME/agents/anansi-brief/SKILL.md"
check_path "Mood skill" "$AGENT_HOME/agents/anansi-mood-weaver/SKILL.md"
check_path "Story skill" "$AGENT_HOME/agents/anansi-story-weaver/SKILL.md"
check_path "Scene skill" "$AGENT_HOME/agents/anansi-scene-weaver/SKILL.md"
check_path "Runway Render skill" "$AGENT_HOME/agents/anansi-runway-render/SKILL.md"
check_path "Final Cut skill" "$AGENT_HOME/agents/anansi-final-cut/SKILL.md"
check_path "Hermes GPT Image 2 keyframe helper" "$AGENT_HOME/scripts/anansi-generate-keyframes-hermes.sh"
check_path "No-API ChatGPT keyframe helper" "$AGENT_HOME/scripts/anansi-chatgpt-keyframes.sh"
check_path "Branded brief PDF helper" "$AGENT_HOME/scripts/anansi-brief-pdf.sh"
check_path "Telegram media attachment helper" "$AGENT_HOME/scripts/anansi-telegram-media-manifest.sh"
check_path "Workflow state helper" "$AGENT_HOME/scripts/anansi-workflow-state.sh"
check_path "Previsualization batch helper" "$AGENT_HOME/scripts/anansi-previsualization-stage.sh"
check_path "Keyframe contact sheet helper" "$AGENT_HOME/scripts/anansi-keyframe-contact-sheet.sh"
check_path "Proactive session hygiene helper" "$AGENT_HOME/scripts/anansi-session-hygiene-proactive.sh"
check_path "Session rotation helper" "$AGENT_HOME/scripts/anansi-session-rotate.sh"
check_path "Storyboard gate helper" "$AGENT_HOME/scripts/anansi-storyboard-gate.sh"
check_path "Hermes storyboard generation helper" "$AGENT_HOME/scripts/anansi-generate-storyboard-hermes.sh"
check_path "HyperFrames setup helper" "$AGENT_HOME/scripts/setup-hyperframes.sh"
check_path "HyperFrames project helper" "$AGENT_HOME/scripts/anansi-hyperframes-init.sh"

python3 - "$HERMES" "$AGENT_HOME/scripts/anansi-session-hygiene-proactive.sh" "$AGENT_HOME/scripts/anansi-session-rotate.sh" <<'PY' || true
import json
import re
from pathlib import Path
import sys

profile = Path(sys.argv[1])
proactive_script = sys.argv[2]
rotate_script = sys.argv[3]
config = profile / "config.yaml"
sessions = profile / "sessions" / "sessions.json"

if config.exists():
    text = config.read_text()
    def find(pattern, default="unknown"):
        m = re.search(pattern, text, re.M)
        return m.group(1) if m else default
    threshold = find(r"(?m)^\s*threshold:\s*([0-9.]+)")
    max_turns = find(r"(?m)^\s*max_turns:\s*([0-9]+)")
    tool_calls = find(r"(?m)^\s*max_tool_calls:\s*([0-9]+)")
    max_iterations = find(r"(?m)^\s*max_iterations:\s*([0-9]+)")
    busy = find(r"(?m)^\s*busy_input_mode:\s*([A-Za-z0-9_-]+)")
    progress = find(r"(?m)^\s*tool_progress:\s*\"?([^\"\n]+)\"?")
    print(f"INFO Reliability config: compression.threshold={threshold}, max_turns={max_turns}, max_tool_calls={tool_calls}, max_iterations={max_iterations}, busy_input_mode={busy}, tool_progress={progress}")
    try:
        if float(threshold) <= 0.12 and int(max_turns) >= 30 and int(tool_calls) >= 30 and int(max_iterations) >= 30 and busy == "queue":
            print("OK  Stage-safe Hermes runtime limits configured")
        else:
            print("WARN Hermes runtime may still use a low iteration/tool cap")
            print("    Expected: max_turns>=30, max_tool_calls>=30, max_iterations>=30, busy_input_mode=queue")
    except Exception:
        print("WARN Could not evaluate Hermes runtime limits")

if sessions.exists():
    try:
        data = json.loads(sessions.read_text() or "{}")
    except json.JSONDecodeError as exc:
        print(f"NO  Invalid sessions.json: {exc}")
    else:
        if not data:
            print("OK  No active Telegram session mapping")
        else:
            for key, value in data.items():
                tokens = value.get("last_prompt_tokens") if isinstance(value, dict) else None
                sid = value.get("session_id") if isinstance(value, dict) else None
                resume_pending = bool(value.get("resume_pending")) if isinstance(value, dict) else False
                suspended = bool(value.get("suspended")) if isinstance(value, dict) else False
                label = "OK"
                if isinstance(tokens, int) and tokens >= 30000:
                    label = "WARN"
                if resume_pending or suspended:
                    label = "WARN"
                token_text = "unknown" if tokens is None else str(tokens)
                print(f"{label} Active session {key}: {sid or 'unknown'} ({token_text} prompt tokens)")
                if label == "WARN":
                    print(f"    Run proactive hygiene: \"{proactive_script}\"")
                    print(f"    Or force rotation: \"{rotate_script}\"")
PY

HERMES_AVAILABLE=false
HERMES_LABEL=""
HERMES_CMD=()
if [[ -x "$HERMES_BIN" ]]; then
  HERMES_AVAILABLE=true
  HERMES_LABEL="$HERMES_BIN"
  HERMES_CMD=("$HERMES_BIN")
elif [[ -x "$HERMES_PY" ]]; then
  HERMES_AVAILABLE=true
  HERMES_LABEL="$HERMES_PY -m hermes_cli.main"
  HERMES_CMD=("$HERMES_PY" -m hermes_cli.main)
fi

if [[ "$HERMES_AVAILABLE" == "true" ]]; then
  HERMES_IMAGE_PROVIDER="$(awk '
    /^image_gen:/ { in_image = 1; next }
    /^[^[:space:]]/ { in_image = 0 }
    in_image && /^[[:space:]]+provider:/ { print $2; exit }
  ' "$HERMES/config.yaml" 2>/dev/null || true)"
  HERMES_IMAGE_MODEL="$(awk '
    /^image_gen:/ { in_image = 1; next }
    /^[^[:space:]]/ { in_image = 0 }
    in_image && /gpt-image-2/ { print $2; exit }
  ' "$HERMES/config.yaml" 2>/dev/null || true)"
  if [[ "$HERMES_IMAGE_PROVIDER" == "openai-codex" && "$HERMES_IMAGE_MODEL" == gpt-image-2* ]]; then
    echo "OK  Hermes native image generation configured: openai-codex / $HERMES_IMAGE_MODEL"
  else
    echo "NO  Hermes native GPT Image 2 backend not configured"
    echo "    Run:"
    echo "    $HERMES_LABEL -p anansi config set image_gen.provider openai-codex"
    echo "    $HERMES_LABEL -p anansi config set image_gen.use_gateway false"
    echo "    $HERMES_LABEL -p anansi config set image_gen.openai-codex.model gpt-image-2-medium"
  fi
  if "${HERMES_CMD[@]}" -p anansi status 2>/dev/null | grep -q "OpenAI Codex.*logged in"; then
    echo "OK  OpenAI Codex OAuth logged in"
  else
    echo "NO  OpenAI Codex OAuth not confirmed"
    echo "    Run: $HERMES_LABEL -p anansi login --provider openai-codex"
  fi
else
  echo "NO  Hermes command not found at $HERMES_BIN or $HERMES_PY"
  echo "    If this is running inside Hermes, ignore profile-home paths like {{ANANSI_HERMES_PROFILE}}/home."
fi

python_with_runway() {
  local candidate
  for candidate in \
    "${ANANSI_PYTHON:-}" \
    "/Library/Developer/CommandLineTools/usr/bin/python3" \
    "/usr/bin/python3" \
    "python3"
  do
    [[ -n "$candidate" ]] || continue
    if "$candidate" - <<'PY' >/dev/null 2>&1
import runwayml
PY
    then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

if security find-generic-password -a "$ACCOUNT" -s "$SERVICE" -w >/dev/null 2>&1; then
  echo "OK  Runway API key in Keychain"
elif [[ -f "$HERMES/.env" ]] && grep -Eq '^(RUNWAYML_API_SECRET|RUNWAY_API_KEY)=' "$HERMES/.env"; then
  echo "OK  Runway API key in private Anansi Hermes .env"
else
  echo "NO  Runway API key in Keychain"
  echo "    Run: \"$AGENT_HOME/scripts/setup-runway-key.sh\""
  echo "    If running headlessly over SSH, store RUNWAYML_API_SECRET in the private Hermes profile .env instead."
fi

if [[ -f "$HERMES/.env" ]] && grep -q '^OPENAI_API_KEY=' "$HERMES/.env"; then
  echo "OK  OpenAI API key in Anansi Hermes .env"
elif security find-generic-password -a "$ACCOUNT" -s "$OPENAI_SERVICE" -w >/dev/null 2>&1; then
  echo "OK  OpenAI API key in Keychain"
  echo "    Optional: run \"$AGENT_HOME/scripts/setup-openai-key.sh\" to also write OPENAI_API_KEY into Hermes .env."
else
  echo "INFO OpenAI API key not configured"
  echo "    This is fine. Hermes GPT Image 2 via Codex OAuth does not need an OpenAI API key."
  echo "    For a project, run: \"$AGENT_HOME/scripts/anansi-generate-keyframes-hermes.sh\" PROJECT --scene scene-01"
  echo "    Only run \"$AGENT_HOME/scripts/setup-openai-key.sh\" if the team later wants fully automatic API keyframes."
fi

if [[ -f "$HERMES/.env" ]] && grep -q '^FAL_KEY=' "$HERMES/.env"; then
  echo "OK  FAL_KEY in Anansi Hermes .env"
elif security find-generic-password -a "$ACCOUNT" -s "$FAL_SERVICE" -w >/dev/null 2>&1; then
  echo "INFO FAL_KEY missing from Anansi Hermes .env"
  echo "    Keychain has $FAL_SERVICE, but Hermes image generation needs FAL_KEY in: $HERMES/.env"
  echo "    This is optional and only needed for the old FAL-backed Hermes image tool."
else
  echo "INFO FAL_KEY not configured"
  echo "    Optional/old path only. No-API ChatGPT keyframe mode does not need it."
fi

if command -v ffmpeg >/dev/null 2>&1; then
  echo "OK  ffmpeg installed"
else
  echo "NO  ffmpeg not found; needed later for final assembly"
fi

if command -v node >/dev/null 2>&1; then
  NODE_VERSION="$(node --version)"
  NODE_MAJOR="$(printf '%s\n' "$NODE_VERSION" | sed -E 's/^v([0-9]+).*/\1/')"
  if [[ "$NODE_MAJOR" =~ ^[0-9]+$ && "$NODE_MAJOR" -ge 22 ]]; then
    echo "OK  Node.js $NODE_VERSION for HyperFrames"
  else
    echo "INFO Node.js $NODE_VERSION found; HyperFrames requires Node.js 22+"
    echo "    Final Cut can still plan HyperFrames compositions, but rendering needs Node 22+."
  fi
else
  echo "INFO Node.js not found; HyperFrames rendering needs Node.js 22+"
fi

if runway_python="$(python_with_runway)"; then
  echo "OK  Python runwayml package installed ($runway_python)"
else
  echo "NO  Python runwayml package not installed"
  echo "    Run: python3 -m pip install --user runwayml"
fi

echo
echo "Readiness check complete."
