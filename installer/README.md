# anansi (installer)

The CLI behind `npx anansi-ai connect`.

## What it does

Anansi is the visual storytelling agent for Runway. This package is the
installer + CLI dispatcher. It:

1. Detects which agent runtimes are on your machine (Claude Code, Hermes,
   OpenClaw, Codex)
2. Symlinks the five Anansi skills (Brief, Mood Weaver, Story Weaver,
   Scene Weaver, Runway Render) into `~/.agents/skills/`
3. Installs `runway-pp-cli` via [Printing Press](https://github.com/mvanhorn/cli-printing-press)
   — the Runway API CLI generated from Runway's OpenAPI spec
4. Downloads the starter project bundle (Hinter pitch film) into
   `~/anansi/projects/`
5. Clones the workbench into `~/anansi/workbench/` and starts it on port 3002
6. Opens your browser

All five Anansi skills become available to whichever runtime you already use.

## Install

```bash
npx anansi-ai connect
```

That's it. Twenty seconds. No keys required to explore.

## Subcommands

```
anansi connect           Install everything; start the workbench.
anansi disconnect        Remove skills, workbench, CLI. Keeps projects.
anansi update            Update workbench, skills, starter bundle.
anansi pull              Re-download the starter bundle only.
anansi run <brief.md>    (stub) Run the workflow on a brief file.
anansi list              List installed projects.
anansi open <slug>       Open a project in the workbench.
anansi config <…>        Read/write config (e.g. runwayml_api_key).
anansi doctor            Verify install: runtimes, skills, CLI, workbench.
```

## File layout

```
~/.agents/skills/anansi-*       five skill symlinks (universal)
~/.{claude,hermes,openclaw,codex}/skills/anansi-*   per-runtime symlinks
~/anansi/workbench/             Next.js workbench (cloned)
~/anansi/projects/              project state lives here
~/anansi/config.json            Anansi config (BYOK lives here too)
~/anansi/.workbench.pid         PID of the running workbench
$GOPATH/bin/runway-pp-cli       Runway API CLI (installed by Printing Press)
```

## Bring your own keys

The starter project is pre-rendered, so install + explore needs no keys.
When you generate something new, the Runway Render agent shells out to
`runway-pp-cli`, which reads `RUNWAYML_API_KEY_AUTH`.

```bash
export RUNWAYML_API_KEY_AUTH=rw_xxx
# or
runway-pp-cli auth set-token rw_xxx
# or
anansi config set runwayml_api_key rw_xxx
```

The first two are interchangeable — Anansi's config is a convenience
wrapper around the same env var that `runway-pp-cli` already reads.

## Implementation notes

The installer is plain Node 18+, no dependencies. Each subcommand is a
small module under `lib/`:

- `connect.js` — orchestrates the install flow
- `disconnect.js` — undoes it
- `update.js` / `pull.js` — refresh paths
- `run.js` / `list.js` / `open.js` / `config.js` / `doctor.js` — operational
- `runtimes.js` — runtime detection table
- `skills.js` — symlink fan-out
- `runway-pp.js` — Printing Press install with Go fallback
- `bundle.js` — starter project bundle download
- `workbench.js` — workbench install + lifecycle
- `util.js` — shared paths, logging helpers, env

Run `node bin/anansi.js --help` from a checkout for the same interface.

## Development

```bash
git clone https://github.com/TheAlexYao/anansi-ai
cd anansi-ai/installer
node bin/anansi.js doctor
```

To test the install without polluting your machine, point `HOME` at a
sandbox:

```bash
HOME=/tmp/anansi-test node bin/anansi.js connect --no-open --no-start
HOME=/tmp/anansi-test node bin/anansi.js doctor
HOME=/tmp/anansi-test node bin/anansi.js disconnect --purge
```

## License

MIT.
