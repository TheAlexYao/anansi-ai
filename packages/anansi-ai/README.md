# Anansi AI

The visual storytelling agent for Runway.

Anansi installs the agent skills, runtime profile templates, local workflow scripts, and starter schemas for an agent-first cinematic video workflow.

```bash
npx anansi-ai connect
```

If the npm package has not been published yet, install directly from GitHub:

```bash
npx github:teambrukhman1/anansi-ai connect
```

## What Installs

- Six Anansi skills:
  - `anansi-brief`
  - `anansi-mood-weaver`
  - `anansi-story-weaver`
  - `anansi-scene-weaver`
  - `anansi-runway-render`
  - `anansi-final-cut`
- Obsidian helper skill family for local vault work.
- Hermes profile templates for the `anansi` profile.
- Local scripts for project state, brief PDFs, storyboard gates, keyframes, Runway payloads, Telegram media manifests, and HyperFrames final assembly.
- Public-safe schemas, docs, and examples.

## What Does Not Install

This public package does not include the team's private creative vault, the creative lead source notes, local style memory, client briefs, Runway logs, API keys, or generated project artifacts.

The installer stores only a local pointer to a local vault in:

```txt
~/.anansi/config.json
```

To point Anansi at a local vault:

```bash
anansi-ai config set vault "/absolute/path/to/your/Anansi"
```

## Local Paths

After install, Anansi uses:

```txt
~/anansi/agent        agent files, scripts, profile templates
~/anansi/projects     generated project folders
~/.agents/skills      portable agent skills
~/.hermes/profiles/anansi
~/.anansi/config.json local config only
```

## Runway Key

On macOS, store the Runway key in Keychain:

```bash
anansi-ai config set runway_key rw_xxx
```

Keys are never written into this repo or npm package.

## Check Install

```bash
anansi-ai doctor
```

## Publish To NPM

The package name `anansi-ai` is public-safe and intended for npm. To make the exact install command work:

```bash
npm login
npm publish --access public
```

The `prepack` guard runs before publish and fails if a key-looking value, raw the team/iCloud path, `.env`, local vault folder, or private client folder is present.

## Workflow

Anansi is stage-isolated so it can survive long Telegram/Hermes runs without context overload:

```txt
Strategy Gate: Brief + Mood + Story
Previsualization Gate: Scene + storyboard + keyframes
Render Gate: Runway clips + HyperFrames/final cut
Learning: local vault/client memory updates
```

The private creative vault remains the retrieval and learning layer. The public package only teaches agents how to find and use that layer locally.
