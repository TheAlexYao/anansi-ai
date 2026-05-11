---
name: anansi-icloud-workspace
description: Work in the team's plain iCloud Drive Anansi folder, using the copied Donnerson-style Markdown/Obsidian skill family while preserving the Runway hackathon public/private boundaries.
---

# Anansi iCloud Workspace

Workspace path:

`{{ANANSI_AGENT_HOME}}`

Active Obsidian vault:

`{{ANANSI_VAULT_PATH}}`

Use this skill when reading, creating, organizing, or filing Anansi project notes.

## Companion Skills

Use the copied Donnerson skill family when relevant:

- `obsidian-markdown` for properties, wikilinks, embeds, callouts, and Obsidian-flavored Markdown.
- `obsidian-bases` for `.base` files.
- `obsidian-cli` only if intentionally interacting with a running Obsidian app.
- `json-canvas` for `.canvas` files.
- `defuddle` for extracting clean Markdown from web pages before filing research notes.

This workspace is the plain iCloud Drive `Anansi Agent` folder. The active Obsidian vault is the separate iCloud Obsidian folder above.

## Filing Boundary

For repo work, keep this distinction:

- `the private creative system`: raw/internal notes, prompt experiments, client notes, creative heuristics, Runway tests, internal rubrics, private notes.
- `anansi-ai`: sanitized public workflow, public docs, schemas, demo examples, approved demo assets.

Never put secrets, `.env` files, private client details, raw transcripts, account screenshots, confidential client assets, copyrighted source dumps, or unsanitized Runway logs into `anansi-ai`.

## Useful Commands

```bash
ANANSI_HOME="{{ANANSI_AGENT_HOME}}"
ANANSI_VAULT="{{ANANSI_VAULT_PATH}}"
find "$ANANSI_HOME" -name "*.md" -type f
rg "Runway|prompt|scene|continuity|the creative lead" "$ANANSI_HOME" "$ANANSI_VAULT"
```
