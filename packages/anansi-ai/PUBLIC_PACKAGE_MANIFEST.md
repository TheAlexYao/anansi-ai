# Anansi Public Package Manifest

This package is the public Anansi runtime installer. It should make Anansi usable with local agent runtimes without shipping the private creative system.

## Allowed In This Package

- CLI entrypoints and dispatch code for `npx anansi-ai connect`.
- Portable Anansi agent skills that describe stage responsibilities at a product level.
- Runtime connector templates for local agent environments such as Hermes, OpenClaw, Claude Code, and Codex.
- Local workflow helper scripts that operate on the user's machine and project folders.
- Public schemas, sanitized examples, and demo-safe docs.
- BYOK setup helpers that store credentials locally and never include real credentials.

## Not Allowed In This Package

- Private creative vaults or vault exports.
- Client briefs, local style memory, private project folders, private notes, or raw research notes.
- Internal Runway output logs, prompt experiments, evaluation traces, or generated assets that have not been approved as public demo assets.
- Private retrieval maps, rubrics, heuristics, or other source material that encodes the actual creative-system moat.
- API keys, tokens, local absolute paths, session transcripts, or Telegram/chat exports.

## Private Counterpart

The private source of truth remains `the private creative system`. The public package may store a local pointer to a private vault in `~/.anansi/config.json`, but it must not include that vault or depend on it to install.
