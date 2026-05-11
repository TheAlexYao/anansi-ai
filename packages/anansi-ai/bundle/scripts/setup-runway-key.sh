#!/usr/bin/env bash
set -euo pipefail

SERVICE="anansi-runway-api-key"
ACCOUNT="${USER:-teambrukhman}"

echo "This stores your Runway API key in macOS Keychain."
echo "The key will not be printed."
echo
printf "Paste Runway API key: "
stty -echo
IFS= read -r RUNWAY_KEY
stty echo
echo

if [[ -z "$RUNWAY_KEY" ]]; then
  echo "No key entered. Nothing changed."
  exit 1
fi

security add-generic-password \
  -a "$ACCOUNT" \
  -s "$SERVICE" \
  -w "$RUNWAY_KEY" \
  -U >/dev/null

echo "Runway key stored in Keychain as service: $SERVICE"
