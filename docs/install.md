# Install

How Anansi installs and what it puts on your machine.

## The single command

```bash
npx anansi connect
```

That's it. Twenty seconds. No API keys required.

## What happens, step by step

```
┌──────────────────────────────────────────────────────────────┐
│  1.  Detect agent runtimes                                   │
│      Looks for: ~/.claude  ~/.hermes  ~/.openclaw  ~/.codex  │
│      Each one found gets the Anansi skills symlinked in.     │
├──────────────────────────────────────────────────────────────┤
│  2.  Install five skills                                     │
│      Writes to ~/.agents/skills/anansi-*                     │
│      Symlinks into every detected runtime.                   │
├──────────────────────────────────────────────────────────────┤
│  3.  Download the starter project                            │
│      ~50MB bundle from latest GitHub release.                │
│      Extracts to ~/anansi/projects/hinter-pitch-film/        │
│      Includes brief, moodboard, scene options, final video.  │
├──────────────────────────────────────────────────────────────┤
│  4.  Spin up the workbench                                   │
│      Next.js app at http://localhost:3002                    │
│      Loads the starter project on first open.                │
├──────────────────────────────────────────────────────────────┤
│  5.  Open your browser                                       │
│      Lands you on the loaded Hinter project.                 │
│      Mood weave, scene options, final cut — all visible.     │
└──────────────────────────────────────────────────────────────┘
```

No keys prompted. No accounts created. No tutorial. The first thing you see is a finished film.

## What lands on your filesystem

```
~/.agents/skills/
├── anansi-brief/SKILL.md
├── anansi-mood-weaver/SKILL.md
├── anansi-story-weaver/SKILL.md
├── anansi-scene-weaver/SKILL.md
└── anansi-runway-render/SKILL.md

~/anansi/
├── workbench/              ← Next.js app, runs on localhost:3002
├── projects/
│   └── hinter-pitch-film/  ← starter project
│       ├── brief.md
│       ├── mood/
│       ├── scenes/
│       ├── final/hinter-30s.mp4
│       └── project.json
├── cli/anansi              ← `anansi` command on your PATH
└── config.json             ← optional BYOK config
```

Symlinks fan out from `~/.agents/skills/` into each agent runtime's skills directory. Updating Anansi updates every runtime at once.

## Three modes, one install

After install, you can drive Anansi three ways. All share the same projects directory.

### 1. Workbench (visual)

Open `http://localhost:3002`. Click. Everything is in one screen — brief on the left, mood up top, story weaver on the right, scenes below, final cut bottom-right.

### 2. CLI (scripted)

```bash
anansi run brief.md            # run the full workflow on a brief file
anansi list                    # show your projects
anansi open hinter-pitch-film  # opens the workbench at this project
anansi config set runway_key rw_xxx
```

### 3. Agent (conversational)

Open Claude Code, Hermes, OpenClaw, or Codex. The five Anansi skills are already loaded.

```
> Use Anansi to draft a new project. Brief: 30 seconds, 16:9, for a
  sustainable hospitality brand opening their second property in Quebec.
  Tone is intimate and weighted. Reference Wong Kar-wai and Tarkovsky.
```

The agent calls the skills in order. The workbench reflects the project state in real time.

## Bring your own keys

The starter project is pre-rendered. You don't need a key to explore.

When you generate a new project or modify a scene, Anansi asks for a Runway key. Stored on your machine, never sent to us.

```bash
anansi config set runway_key rw_xxx
```

Or as an environment variable:

```bash
export RUNWAY_API_KEY=rw_xxx
```

Optional keys for richer workflows:

```bash
anansi config set elevenlabs_key xxx    # voiceover
anansi config set suno_key xxx          # ambient sound
anansi config set openai_key xxx        # mood/brief enrichment
```

None of these are required. Anansi degrades gracefully when a key is missing — the workflow runs, the affected step is skipped or stubbed.

## Manual install

If you want to skip the installer:

```bash
git clone https://github.com/TheAlexYao/anansi-ai ~/anansi
cd ~/anansi/workbench && npm install && npm run dev
```

Then symlink the skills yourself:

```bash
ln -s ~/anansi/skills/anansi-brief        ~/.agents/skills/
ln -s ~/anansi/skills/anansi-mood-weaver  ~/.agents/skills/
ln -s ~/anansi/skills/anansi-story-weaver ~/.agents/skills/
ln -s ~/anansi/skills/anansi-scene-weaver ~/.agents/skills/
ln -s ~/anansi/skills/anansi-runway-render ~/.agents/skills/
```

And download the starter bundle:

```bash
curl -L https://github.com/TheAlexYao/anansi-ai/releases/latest/download/starter-bundle.zip \
  -o /tmp/anansi-starter.zip
unzip /tmp/anansi-starter.zip -d ~/anansi/projects/
```

## Updating

```bash
npx anansi update
```

Pulls the latest skills, workbench, and starter bundle. Your projects are untouched.

## Uninstall

```bash
npx anansi disconnect
```

Removes the skills, the workbench, and the CLI. Leaves `~/anansi/projects/` alone unless you pass `--purge`.

## Supported agent runtimes

| Runtime | Skills path | Detected via |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `~/.claude/` exists |
| Hermes | `~/.hermes/skills/` | `~/.hermes/config.yaml` exists |
| OpenClaw | `~/.openclaw/skills/` | `~/.openclaw/` exists |
| Codex | `~/.codex/skills/` | `codex` command on PATH |

Don't see your runtime? Anansi still installs the universal `~/.agents/skills/` directory. Most agent frameworks will pick it up automatically.

## Troubleshooting

**Port 3002 in use.** `anansi config set workbench_port 3003` and restart.

**Skills don't appear in my agent.** Restart your agent runtime. Skills are loaded at startup.

**Runway key isn't working.** Check `anansi config get runway_key`. Test directly: `curl -H "Authorization: Bearer $RUNWAY_API_KEY" https://api.runwayml.com/v1/me`.

**Starter bundle download failed.** `npx anansi pull` retries the bundle download independently of the installer.

**Workbench shows empty state.** Run `anansi open hinter-pitch-film` to load the starter project explicitly.

## What we don't do

- We don't proxy your Runway API traffic.
- We don't store your keys or your renders.
- We don't bill you. Your Runway account is your Runway account.
- We don't phone home. Anansi runs locally; the only network calls are to Runway and the optional GitHub release host for updates.

The whole thing is meant to feel like a tool you own, not a service you subscribe to.
