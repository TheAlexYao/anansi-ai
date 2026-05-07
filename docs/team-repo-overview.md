# Anansi Team Repo Overview

## Public Repo: `anansi-ai`

Purpose: hackathon submission and demo app.

```text
anansi-ai/
  app/                         # Next.js frontend / demo app
  agent/                       # portable Anansi agent profile + demo workflow
  docs/                        # public setup, architecture, demo script
  data/examples/               # sanitized example payloads
  public/demo-assets/          # approved demo images/videos
  README.md
  .env.example
```

Includes:

- Next.js app
- portable Anansi agent setup
- sanitized workflow examples
- demo assets
- public architecture docs
- setup instructions

Does not include:

- full creative system
- private Obsidian docs
- private meeting transcripts
- raw Runway task logs
- secrets/API keys
- Jarvis/Hermes personal profile

## Private Repo: `anansi-creative-system-private`

Purpose: team-only creative system / Obsidian vault.

```text
anansi-creative-system-private/
  README.md
  workflows/
  prompts/
  rubrics/
  references/
  examples/
  meeting-extracts/
```

Includes:

- full Obsidian workflow library
- creative heuristics
- prompt chains
- internal rubrics
- references
- meeting extracts
- reusable agent knowledge

Access:

- private GitHub repo: `https://github.com/TheAlexYao/anansi-creative-system-private`
- team members only: Alex, `viomarin`, `sambrukhman1`
- can be opened directly as an Obsidian vault

## Hermes / Anansi Agent Access

Hermes can access the private repo locally when running on Alex's machine.

Local setup:

```text
/Users/alexyao/projects/anansi-ai
/Users/alexyao/projects/anansi-creative-system-private
```

The public Anansi agent can reference the private knowledge repo during local development:

```text
Anansi public app/agent
-> reads private creative system locally
-> generates better plans/prompts
-> only sanitized outputs get copied back into public repo
```

The hackathon submission must still work without the private repo, using the smaller demo workflow inside `anansi-ai/agent`.

## Team Workflow

```text
Team works in private Obsidian repo
-> Hermes/Anansi reads it locally
-> Alex/Sam distill useful pieces
-> sanitized demo workflow goes into public anansi-ai repo
-> public app ships for hackathon
```

## Core Rule

Private repo is the source of the real creative system.

Public repo is the product/demo package.

Hermes can use the private repo. Judges/users only see the public version.
