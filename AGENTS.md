# Anansi AI Agent Guide

## Project Role

Anansi is the active hackathon/prototype workspace for AI video creation.

Working frame:

- Anansi is the creative producer.
- Hermes/Jarvis is the backstage agent team.
- Runway is the camera.

This repo is the source of truth for product behavior, UI, generated demo assets, and implementation notes.

## Current Deliverable

Build a working Next.js demo that turns a brand/product brief into a visual story workflow:

1. Capture brief and references.
2. Generate mood and shot options.
3. Let the human approve/reject/regenerate.
4. Send approved shots to Runway through the local Printing Press CLI.
5. Display generated clips and final export state in the app.

Keep human judgment central. Do not present Anansi as fully automated content spam.

## Source Routing

- Implementation and product behavior: this repo
- Local notes, transcripts, and creative planning live outside the repo on the maintainer's machine

When extracting meeting notes, do not paste huge transcript summaries into this repo. Add only decisions, product requirements, prompt constraints, open questions, and next build tasks.

## Output Locations

Use these locations before creating anything new:

- `app/` for Next.js app code.
- `public/generated/runway/` for generated video/image files that the frontend should display.
- `data/runway/` for task JSON, prompt payloads, response metadata, and local generation records.
- `docs/` for concise product notes, demo script, API notes, and hackathon submission notes.

Do not store API keys, raw credentials, or private account tokens in the repo.

## Tooling

- Next.js app: `npm run dev`, `npm run build`, `npm run lint`
- Runway CLI: `runway-pp-cli`

Before using Runway, confirm the required environment variable is present in the shell. Do not print secret values.

## Agent Behavior

- Prefer implementing the next reversible step over writing a large plan.
- If adding structure, keep it small and tied to a concrete delivery need.
- If using generated assets, record the prompt and task metadata in `data/runway/`.
- If changing the product direction based on a meeting, update local maintainer notes outside the repo rather than committing them here.
- Do not overwrite generated media outputs unless the filename is clearly temporary.
