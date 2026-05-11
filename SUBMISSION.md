# Anansi Submission Notes

## Public Site

https://anansi-mauve.vercel.app/

## Hosted Docs

https://anansi-mauve.vercel.app/docs

## Install Command

```bash
npx anansi-ai connect
```

## Short Description

Anansi is a local visual-storytelling agent runtime for cinematic video workflows. It installs portable agent skills, runtime connector templates, local workflow scripts, and BYOK setup helpers so creative teams can run Anansi from their preferred local agent environment.

## Public Package Boundary

The npm package ships only the public runtime layer: skills, scripts, schemas, docs, and connector templates. It does not include private creative-system notes, client briefs, prompt logs, generated project history, API keys, or private vault content.

## Known Limitations

- Anansi is local-first and BYOK, not a hosted SaaS.
- The local vault connection is optional and points to user-owned files on their machine.
- The current public install flow opens the hosted site/docs rather than downloading a local workbench copy.
- Publishing requires npm auth on the release machine.

## Validation

- GitHub PR merged into `main`: https://github.com/TheAlexYao/anansi-ai/pull/1
- Site build passes.
- Public package boundary check passes.
- `npm pack` dry run succeeds.
- Temp HOME install and doctor smoke test pass.
