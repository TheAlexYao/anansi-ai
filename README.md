# Anansi

**The visual storytelling agent for Runway.**

Bring your brief. Bring your moodboard. Get a 30-second cinematic film stakeholders, customers, and investors will actually believe in.

Anansi installs as one command. You get the workbench, the agent skills, and a starter project — ready to run on Claude Code, Hermes, OpenClaw, or Codex.

```bash
npx anansi-ai connect
```

The agent shows up in your CLI. The workbench opens in your browser. A starter project is pre-loaded. No keys needed to explore.

---

## What it does

Turns a brief into a film, with you in the loop.

```
              ┌────────────────────────┐
              │        BRIEF           │
              │  product · feeling     │
              │  references · audience │
              └────────────┬───────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
 ┌──────────────────┐             ┌──────────────────┐
 │   MOOD WEAVER    │             │   STORY WEAVER   │
 │  palette · stills│ ◄─────────► │   3 directions   │
 │  reference board │             │   tone · pacing  │
 └────────┬─────────┘             └────────┬─────────┘
          │                                │
          └────────────┬───────────────────┘
                       ▼
            ┌──────────────────────┐
            │    SCENE WEAVER      │
            │ 3 scenes × 2 options │  ◄── pick 1 per scene
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │    RUNWAY RENDER     │
            │   queue · variants   │
            └──────────┬───────────┘
                       ▼
            ┌──────────────────────┐
            │      FINAL CUT       │
            │  30s · 16:9 or 9:16  │
            └──────────────────────┘
```

You write the brief. The agents weave the rest. You pick the directions, you choose the scenes, you ship the cut.

## Quick start

```bash
npx anansi-ai connect
```

The installer:

1. Detects your agent runtimes (Claude Code, Hermes, OpenClaw, Codex)
2. Installs the five Anansi skills as universal markdown profiles
3. Downloads the starter project bundle — moodboard, scene options, final video
4. Spins up the workbench at `http://localhost:3002`
5. Opens your browser to a project that's already loaded

No API keys required to install or explore. Bring your Runway key only when you want to generate something new.

## What you get

**The workbench** — a Next.js app at `localhost:3002`. Brief on the left, mood up top, story weaver on the right, scenes below, final cut bottom-right. Looks like a creative-director dashboard, not a SaaS tool.

**Five agent skills** — markdown profiles that drop into any agent runtime supporting the Skills convention:

```
~/.agents/skills/anansi-brief
~/.agents/skills/anansi-mood-weaver
~/.agents/skills/anansi-story-weaver
~/.agents/skills/anansi-scene-weaver
~/.agents/skills/anansi-runway-render
```

Symlinked into Claude Code, Hermes, OpenClaw, Codex — whichever runtimes are on your machine. Open your agent and it already knows how to weave a film.

**A starter project** — a real fundraising film built for [Hinter](https://hinter.com). Moodboard, three directions, six scene options, final 30-second cut — all pre-rendered. Open the workbench and it's there. Use it as a reference, fork it, or replace it with your own.

## How it works

Five agents, one workflow:

1. **Brief.** You write it. The agent ingests product, audience, feeling, references.
2. **Mood Weaver.** Pulls your references, builds a palette, lays out a visual world.
3. **Story Weaver.** Reads brief and mood, returns three cinematic directions you choose between.
4. **Scene Weaver.** Translates your direction into three scenes, each with two shot options. You pick one per scene.
5. **Runway Render.** Sends the prompts to Runway, queues the variants, assembles the final cut.

You stay in the loop at three points: direction, scene options, final approval. Anansi never picks for you.

## Glossary

| Term | Means |
|---|---|
| Brief | What you're making, who it's for |
| Mood | The visual world — palette, references, feeling |
| Direction | One creative interpretation of the brief (three to choose from) |
| Scene | One moment in the film (three per film) |
| Option | An alternate version of a scene (two per scene) |
| Final cut | The assembled 30-second video — 16:9 for stakeholders, 9:16 for social |

## Three ways to use it

**From the workbench.** Open `http://localhost:3002`. Click around. Visual, deliberate, made for taste.

**From the CLI.**

```bash
anansi run my-brief.md
```

Reads a brief, runs the workflow non-interactively, writes a draft project to `~/anansi/projects/`. Open the workbench to refine.

**From your agent.** Open Claude Code, Hermes, OpenClaw, or Codex. Ask:

> Use the Anansi skill to start a new project. Brief: a 30-second film for a sustainable hospitality brand opening their second property.

Your agent has the skills loaded. It runs the workflow. You watch it weave.

## Bring your own keys

Anansi runs on **your** Runway API key. We never proxy your traffic. Your renders live in your account. Your bill is your bill.

```bash
export RUNWAYML_API_KEY_AUTH=rw_xxx
```

The starter project is pre-rendered, so you can explore Anansi end-to-end without a key. Keys are only required when you generate something new.

## Project layout after install

```
~/anansi/
├── projects/
│   └── hinter-pitch-film/        ← starter project, pre-loaded
│       ├── brief.md
│       ├── mood/                  ← reference stills
│       ├── scenes/                ← shot options
│       ├── final/hinter-30s.mp4
│       └── project.json
├── workbench/                     ← Next.js app
└── config.json                    ← BYOK config
```

## Stack

Anansi is the conductor. It composes existing tools rather than reinventing them.

- **[`runway-pp-cli`](https://github.com/mvanhorn/printing-press-library)** — our Runway API wrapper, generated from Runway's OpenAPI spec via [Printing Press](https://github.com/mvanhorn/cli-printing-press). Every Runway endpoint, agent-mode ergonomics (`--agent --json --select --dry-run`), structured exit codes, first-class Workflow API support. Anansi's Runway Render agent shells out to this binary.
- **[`runwayml/skills`](https://github.com/runwayml/skills)** — Runway's official agent-skill library. Cited as the canonical execution layer for Runway-aware agents; we compose with it rather than against it.
- **Hermes / Claude Code / OpenClaw / Codex** — Anansi's five skills install into any agent runtime via the Skills convention.
- **Modal** *(optional)* — wrap the Runway Render agent as a `@app.function` for parallelizable rendering and a "powered by Modal" deploy story.
- **Next.js** — the workbench at `localhost:3002`. A UI for the same project state your agent reads and writes.

See [`docs/architecture.md`](docs/architecture.md) for how these compose end-to-end, including the per-stage model routing (`gen4_turbo` for drafts → `gen4.5` for finals) and the Workflow API integration.

## Built for the Runway API hackathon

72 hours. May 2026.

Team:
- **Alex Yao** — frontend, agent integration · [@TheAlexYao](https://github.com/TheAlexYao)
- **Vio Marin** — creative direction · [@viomarin](https://github.com/viomarin)
- **Sam Brukhman** — workflow engineering · [@sambrukhman1](https://github.com/sambrukhman1)

First project built with [Hinter](https://hinter.com).

## License

MIT. Use it. Fork it. Ship something beautiful.
