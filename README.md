# Anansi AI

Anansi is a creative producer workspace for AI video. It turns a brand or product brief into creative directions, shot options, Runway prompts, an approval flow, and generated demo assets.

## Local Development

```bash
npm install
npm run dev
```

## Project Layout

- `app/` - Next.js frontend.
- `agent/` - portable Anansi agent profile and demo workflow.
- `docs/` - setup notes, architecture, and demo script.
- `data/runway/` - local Runway task metadata. Private by default.
- `public/generated/runway/` - generated media used by the frontend. Private by default until approved.

## Privacy

Do not commit API keys, raw Runway task logs, private Granola transcripts, Jarvis/Hermes personal profile files, or private creative-system docs.
