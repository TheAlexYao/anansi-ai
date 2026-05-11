#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 \"Client Name\" [client-slug]" >&2
  exit 64
fi

CLIENT_NAME="$1"
CLIENT_SLUG="${2:-$CLIENT_NAME}"

VAULT="{{ANANSI_VAULT_PATH}}"
ROOT="$VAULT/22 Local Style Memory/Clients/$CLIENT_SLUG"

mkdir -p "$ROOT"

profile="$ROOT/Client Style Profile.md"
feedback="$ROOT/Feedback Log.md"
ledger="$ROOT/Pattern Ledger.md"

if [[ ! -f "$profile" ]]; then
  cat > "$profile" <<EOF
---
title: $CLIENT_NAME Client Style Profile
type: client-style-profile
status: active
public_safe: false
authority: client-feedback
client: $CLIENT_NAME
upstream:
  - "[[22 Local Style Memory/Local Style Memory Index]]"
downstream:
  - "[[22 Local Style Memory/Clients/$CLIENT_SLUG/Feedback Log]]"
  - "[[22 Local Style Memory/Clients/$CLIENT_SLUG/Pattern Ledger]]"
tags:
  - anansi
  - anansi/client-memory
---

# $CLIENT_NAME Client Style Profile

## Current Standing Rule

- Confidence:
- Last updated:
- Source:

## What This Client Protects

-

## What This Client Rejects

-

## Brief Preferences

-

## Mood Preferences

-

## Story Preferences

-

## Scene / Storyboard Preferences

-

## Image / Keyframe Preferences

-

## Runway / Motion Preferences

-

## Final Cut Preferences

-

## Mandatories

-

## Avoid List

-

## Approved Language

-

## Rejected Language

-

## Open Questions

-

## Retrieval Note For Agents

Before generating for this client, preserve:

-

Avoid:

-
EOF
fi

if [[ ! -f "$feedback" ]]; then
  cat > "$feedback" <<EOF
---
title: $CLIENT_NAME Feedback Log
type: client-feedback-log
status: active
public_safe: false
authority: client-feedback
client: $CLIENT_NAME
upstream:
  - "[[22 Local Style Memory/Clients/$CLIENT_SLUG/Client Style Profile]]"
downstream:
  - "[[22 Local Style Memory/Clients/$CLIENT_SLUG/Pattern Ledger]]"
tags:
  - anansi
  - anansi/client-memory
  - anansi/feedback
---

# $CLIENT_NAME Feedback Log

## YYYY-MM-DD - Project / Stage

- Source:
- Stage:
- Artifact reviewed:
- Feedback summary:
- Exact client language, if useful:
- What to preserve:
- What to avoid:
- Mandatories created:
- Affected agents:
- Classification:
- Confidence:
- Public-safe:
- Follow-up needed:
EOF
fi

if [[ ! -f "$ledger" ]]; then
  cat > "$ledger" <<EOF
---
title: $CLIENT_NAME Pattern Ledger
type: client-pattern-ledger
status: active
public_safe: false
authority: client-feedback
client: $CLIENT_NAME
upstream:
  - "[[22 Local Style Memory/Clients/$CLIENT_SLUG/Feedback Log]]"
downstream:
  - "[[22 Local Style Memory/Clients/$CLIENT_SLUG/Client Style Profile]]"
tags:
  - anansi
  - anansi/client-memory
  - anansi/learning
---

# $CLIENT_NAME Pattern Ledger

## Pattern: <short name>

- Status: observed-once | candidate-pattern | stable-client-rule | contradicted | retired
- Client: $CLIENT_NAME
- First seen:
- Last seen:
- Stages affected:
- Evidence count:
- Evidence:
  - YYYY-MM-DD / Project / Stage:
- Rule:
- Preserve:
- Avoid:
- Agent behavior change:
- Public-safe:
- Next test:
EOF
fi

echo "Client memory ready:"
echo "$ROOT"
