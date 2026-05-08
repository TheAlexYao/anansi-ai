# Architecture

How Anansi composes existing tools into a creative-director pipeline.

## The thesis

Anansi is the conductor. It does not reimplement Runway, ElevenLabs, or any model API. It composes them through five small agents, each with a single creative job.

```
       ┌─────────────────────────────────────────────────────────┐
       │                       USER                              │
       │     (workbench · CLI · any agent runtime)               │
       └─────────────────────────┬───────────────────────────────┘
                                 │
       ┌─────────────────────────▼───────────────────────────────┐
       │                 ANANSI ORCHESTRATION                    │
       │                                                         │
       │   Brief  →  Mood Weaver  ┐                              │
       │                          ├─→  Scene Weaver  →  Render   │
       │            Story Weaver  ┘                              │
       │                                                         │
       │   Five markdown skills installed into agent runtimes.   │
       │   Read/write a single project.json. No hidden state.    │
       └─────────────────────────┬───────────────────────────────┘
                                 │
       ┌─────────────────────────▼───────────────────────────────┐
       │                   EXECUTION LAYER                       │
       │                                                         │
       │   runway-pp-cli            (every Runway endpoint)      │
       │   runwayml/skills          (cited as canonical)         │
       │   ffmpeg / cv2             (frame extraction, assembly) │
       │   modal (optional)         (parallel render functions)  │
       └─────────────────────────┬───────────────────────────────┘
                                 │
       ┌─────────────────────────▼───────────────────────────────┐
       │                     RUNWAY API                          │
       │   gen4_turbo · gen4.5 · workflows · characters · audio  │
       └─────────────────────────────────────────────────────────┘
```

## Why `runway-pp-cli`

Anansi shells out to [`runway-pp-cli`](https://github.com/mvanhorn/printing-press-library) for every Runway API call. The CLI is generated from Runway's OpenAPI spec via [Printing Press](https://github.com/mvanhorn/cli-printing-press), which means:

- **Complete coverage.** Every endpoint, including `/v1/workflows` and `/v1/workflow_invocations` — the Runway features less-mature integrations don't expose.
- **Agent-mode ergonomics.** `--agent` expands to `--json --compact --no-input --no-color --yes`. Add `--select id,status` to keep responses tiny. Add `--dry-run` to preview without sending. Structured exit codes (0/2/3/4/5/7/10) so agents can branch on error class.
- **Regenerable.** When Runway ships a new endpoint, regenerate. Anansi's wrapper code stays the same.
- **Compiled Go.** Sub-100ms cold start. No `uv` or Python runtime required to invoke Runway.

We cite [`runwayml/skills`](https://github.com/runwayml/skills) as the canonical execution layer for Runway-aware agents — it's official and politically correct. We use `runway-pp-cli` because it's the most complete, agent-ergonomic surface available.

## The five agents

Each agent is a single SKILL.md file with a tight system prompt and a defined I/O contract.

### 1. Brief

**Job:** turn user input into a structured brief.

**Reads:** raw user prompt, optional moodboard files, optional reference URLs.
**Writes:** `project.json#brief` — `{ product, audience, feeling, references, format, duration }`.

**Calls:** none. Pure analysis.

### 2. Mood Weaver

**Job:** produce a visual world from the brief.

**Reads:** `project.json#brief`.
**Writes:** `project.json#mood` — `{ palette, references[], texture_keywords, lighting, camera_language }`.

**Calls:**
```bash
runway-pp-cli text-to-image create \
  --model gen4_image \
  --prompt "{mood_query}" \
  --reference-images {urls} \
  --agent --select id,outputUrl
```

### 3. Story Weaver

**Job:** propose three cinematic directions the user picks between.

**Reads:** `project.json#brief`, `project.json#mood`.
**Writes:** `project.json#directions[]` — three objects: `{ id, title, body, tone, pacing }`.

**Calls:** none directly. May invoke a Runway-hosted workflow (see below) for richer multimodal direction generation.

### 4. Scene Weaver

**Job:** translate the chosen direction into 3 scenes × 2 shot options.

**Reads:** `project.json#directions[chosen]`, `project.json#mood`.
**Writes:** `project.json#scenes[]` — three scenes, each with two options carrying `{ id, title, lens, motion, duration, prompt_strength, prompt_text }`.

**Calls:**
```bash
# Cheap drafts — gen4_turbo (5 cr/sec)
runway-pp-cli image-to-video create \
  --model gen4_turbo \
  --prompt-image {first_frame_url} \
  --prompt-text "{scene_prompt}" \
  --duration 3 --ratio 1280:720 \
  --agent --select id,status
```

Drafts run in parallel. Six clips × 3 seconds × 5 cr/sec = 90 credits per scene-weave round.

### 5. Runway Render

**Job:** promote approved scene options to final-quality renders and assemble the cut.

**Reads:** `project.json#scenes[].chosen_option_id`.
**Writes:** `project.json#final` — `{ url, duration, format, audio_track, status }`.

**Calls:**
```bash
# Promote approved options — gen4.5 (12 cr/sec)
runway-pp-cli image-to-video create \
  --model gen4.5 \
  --prompt-image {locked_first_frame} \
  --prompt-text "{scene_prompt}" \
  --duration 3 --ratio 1920:1080 \
  --agent --idempotent
```

Then frame extraction (`cv2`) and assembly (`ffmpeg`) into the final cut. Anansi handles continuity in code because Gen-4/4.5 doesn't expose last-frame conditioning natively.

## Workflow API integration

Runway's [workflow API](https://docs.dev.runwayml.com) lets users build node graphs in Runway's editor and publish them as callable endpoints. Anansi's Mood Weaver and Story Weaver can be deployed as Runway-hosted workflows when the team wants more control over multimodal reasoning than a single prompt provides.

```bash
# Discover the workflow's input schema
runway-pp-cli workflows get --workflow-id {id} --agent

# Invoke it
runway-pp-cli workflows create \
  --workflow-id {id} \
  --node-outputs '{ "brief": "...", "references": ["..."] }' \
  --agent --select id,status

# Poll
runway-pp-cli workflow-invocations get --invocation-id {id} --agent
```

This isn't required — Anansi works with direct API calls — but using workflows for Mood and Story is a clean technical-depth signal: *we can both call the API and orchestrate Runway's own visual workflow runtime.*

## Per-stage model routing

| Stage | Model | Cost | Why |
|---|---|---|---|
| Mood references | `gen4_image` | per image | Cheap, fast, highly steerable |
| Scene drafts | `gen4_turbo` | 5 cr/sec | Six options per project; speed and parallelism matter more than peak quality |
| Final render | `gen4.5` | 12 cr/sec | Three approved clips; quality matters, parallelism doesn't |
| Audio (optional) | ElevenLabs · Suno | per request | Out of scope for MVP; degrades gracefully when keys absent |

A complete project, end to end:
- Mood: ~6 images × ~2 cr each = ~12 credits
- Scene drafts: 6 clips × 3s × 5 cr/sec = 90 credits
- Final renders: 3 clips × 3s × 12 cr/sec = 108 credits
- **Total: ~210 credits per generated project**

The hackathon's 50,000-credit allocation comfortably supports ~230 fresh projects. The starter Hinter project is pre-rendered, so judges spend zero credits to experience the product.

## Modal integration (optional)

The Runway Render agent's polling loop is naturally a Modal `@app.function`. Wrapping it gives parallelizable rendering and a "powered by Modal" deploy story for the hackathon judging criteria.

```python
# anansi/render/modal_app.py
import modal

app = modal.App("anansi-render")

@app.function(secrets=[modal.Secret.from_name("runway")], timeout=900)
def render_clip(scene_id: str, prompt: str, model: str, ratio: str) -> dict:
    import subprocess, json
    result = subprocess.run(
        [
            "runway-pp-cli", "image-to-video", "create",
            "--model", model,
            "--prompt-text", prompt,
            "--ratio", ratio,
            "--agent", "--select", "id,status,outputUrl",
        ],
        capture_output=True, check=True,
    )
    return json.loads(result.stdout)

@app.function()
def render_film(scenes: list[dict]) -> list[dict]:
    return list(render_clip.map(scenes))
```

Three clips render in parallel rather than serially. Modal is the named hackathon infrastructure partner; this satisfies the integration without forcing it on users who don't deploy.

## State model

The single source of truth is `project.json`. Workbench, CLI, and agent runtimes all read and write the same file. No database, no API, no hidden state.

```json
{
  "id": "hinter-pitch-film",
  "created_at": "2026-05-08T15:30:00Z",
  "format": "16:9",
  "duration_seconds": 30,
  "brief": {
    "product": "Hinter — design-forward hospitality",
    "audience": "stakeholders evaluating a Series A raise",
    "feeling": "intimate, weighted, hidden in nature",
    "references": [
      "https://hinter.com",
      "wong-kar-wai-street-stills",
      "tarkovsky-mirror"
    ]
  },
  "mood": {
    "palette": ["cobalt", "charcoal", "rust", "sodium", "smoke"],
    "references": ["./mood/forest-dawn.webp", "./mood/cabin-window.webp"],
    "lighting": "low-key, golden-hour rim",
    "camera_language": "weighted, deliberate, no whip-pans"
  },
  "directions": [
    { "id": "01", "title": "The forest remembers", "tone": "intimate", "selected": true },
    { "id": "02", "title": "Built for return", "tone": "tactile", "selected": false },
    { "id": "03", "title": "Quiet as architecture", "tone": "philosophical", "selected": false }
  ],
  "scenes": [
    {
      "id": "hook",
      "label": "HOOK",
      "options": [
        { "id": "1A", "title": "Cabin at first light", "selected": true, "draft_url": "...", "final_url": "..." },
        { "id": "1B", "title": "Path through cedars", "selected": false, "draft_url": "..." }
      ]
    },
    { "id": "turn", "label": "TURN", "options": [...] },
    { "id": "memory", "label": "MEMORY", "options": [...] }
  ],
  "final": {
    "url": "./final/hinter-30s.mp4",
    "duration_seconds": 30,
    "format": "16:9",
    "rendered_at": "2026-05-08T16:42:00Z"
  }
}
```

Every agent reads and writes this object. Workbench renders from it. The CLI prints it. Updates are atomic file writes. Conflicts (rare) are resolved by the user re-clicking the affected scene.

## Why this stack wins

- **Composition over invention.** The team built a narrow, opinionated layer on top of well-engineered substrates. Less code; more leverage.
- **Every endpoint covered.** `runway-pp-cli` exposes the entire Runway API surface, including the Workflow API that competing integrations don't reach.
- **Agent-native by construction.** No web app to log into. Skills install where the user already works.
- **Single state file.** No database, no migrations, no sync. The CLI, workbench, and agent are three views of the same JSON.
- **Pre-rendered demo.** Judges see the finished product without an API key. The install command becomes the demo.
- **Budget-aware.** Per-stage model routing keeps a 30-second film under ~210 credits. The hackathon allocation is more than enough.

## Reading order for new contributors

1. [README](../README.md) — what Anansi is and what it ships
2. [docs/install.md](./install.md) — how `npx anansi connect` lands on a machine
3. This file — how the pieces compose at runtime
4. The five SKILL.md files under `~/.agents/skills/anansi-*` (after install) — the actual prompts each agent runs
