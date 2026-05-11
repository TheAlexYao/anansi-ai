#!/usr/bin/env bash
set -euo pipefail

SERVICE="anansi-openai-api-key"
ACCOUNT="${USER:-teambrukhman}"
PROFILE_ENV="{{ANANSI_HERMES_PROFILE}}/.env"
PROFILE_DIR="{{ANANSI_HERMES_PROFILE}}"
LAUNCH_LABEL="ai.hermes.gateway-anansi"

echo "This stores your OpenAI API key for Anansi GPT-5.5 keyframe generation."
echo "The key will be stored in macOS Keychain and written to the private Anansi Hermes .env as OPENAI_API_KEY."
echo "The key will not be printed."
echo
printf "Paste OpenAI API key: "
stty -echo
IFS= read -r OPENAI_KEY_VALUE
stty echo
echo

if [[ -z "$OPENAI_KEY_VALUE" ]]; then
  echo "No key entered. Nothing changed."
  exit 1
fi

mkdir -p "$PROFILE_DIR"
touch "$PROFILE_ENV"
chmod 600 "$PROFILE_ENV"

security add-generic-password \
  -a "$ACCOUNT" \
  -s "$SERVICE" \
  -w "$OPENAI_KEY_VALUE" \
  -U >/dev/null

tmp_file="$(mktemp)"
if grep -q '^OPENAI_API_KEY=' "$PROFILE_ENV"; then
  awk -v key="$OPENAI_KEY_VALUE" '
    BEGIN { written = 0 }
    /^OPENAI_API_KEY=/ {
      if (!written) {
        print "OPENAI_API_KEY=" key
        written = 1
      }
      next
    }
    { print }
    END {
      if (!written) {
        print ""
        print "# OpenAI API key for Anansi GPT-5.5 keyframe generation."
        print "OPENAI_API_KEY=" key
      }
    }
  ' "$PROFILE_ENV" > "$tmp_file"
else
  cat "$PROFILE_ENV" > "$tmp_file"
  {
    echo
    echo "# OpenAI API key for Anansi GPT-5.5 keyframe generation."
    echo "OPENAI_API_KEY=$OPENAI_KEY_VALUE"
  } >> "$tmp_file"
fi
mv "$tmp_file" "$PROFILE_ENV"
chmod 600 "$PROFILE_ENV"

echo "OpenAI key stored in Keychain as service: $SERVICE"
echo "OPENAI_API_KEY written to private Hermes profile env: $PROFILE_ENV"
echo
echo "Restarting Anansi Hermes gateway so keyframe generation sees OPENAI_API_KEY..."
if launchctl print "gui/$(id -u)/$LAUNCH_LABEL" >/dev/null 2>&1; then
  launchctl kickstart -k "gui/$(id -u)/$LAUNCH_LABEL"
  sleep 3
  echo "Anansi Hermes gateway restarted."
else
  echo "Anansi Hermes gateway service was not loaded. Start it from Hermes when ready."
fi

echo
echo "Done. You can verify with:"
echo "\"{{ANANSI_AGENT_HOME}}/scripts/check-anansi-readiness.sh\""
