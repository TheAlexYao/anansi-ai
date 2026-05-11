# Public Distribution Plan

Anansi is distributed as a public npm package plus a public site.

## Install Command

```bash
npx anansi-ai connect
```

## What The Installer Does

- Creates local Anansi folders under `~/anansi` and `~/.anansi`.
- Installs portable Anansi skills into `~/.agents/skills`.
- Copies runtime connector templates for supported local agent environments.
- Creates a local projects directory for user-owned project files.
- Lets the user point Anansi at a private local vault with `anansi-ai config set vault /path/to/vault`.
- Supports bring-your-own-key setup without storing secrets in the package or repository.

## What The Installer Does Not Ship

- Private creative-system vault content.
- Client material, internal notes, prompt logs, or private generated assets.
- API keys or account credentials.
- Hosted services or proxy infrastructure.

## Site And Package Split

The public Next.js site remains in the root `anansi-ai` app. The npm package lives under `packages/anansi-ai` and is publishable independently.
