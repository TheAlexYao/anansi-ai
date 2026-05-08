# Anansi Hackathon Brief

Source: Granola chat/transcript `https://notes.granola.ai/t/6a750ab9-1089-4410-af27-fe0e5444eb08`

## Timeline

- Friday 9am ET: Runway overview and use-case showcase.
- Friday 10am ET: Technical API walkthrough.
- Weekend: build phase with Discord support.
- Monday 9am ET: submission deadline.

## Submission Focus

Build a hackathon demo for real-estate cinematic storytelling using the Runway API.

Minimum viable target:

- 30-second vertical video for TikTok/social.
- 1-minute version only if the 30-second version is already solid.
- Prioritize excellent Runway prompting and visual quality over full automation.
- It is acceptable to mock or hand-wave non-core parts for the demo if the Runway/Hermes prompt workflow is convincing.

Target user:

- Real estate professionals who want cinematic property/story content without needing to learn Runway or prompt engineering.

UX flow:

1. Brief input.
2. Mood board.
3. Story direction.
4. Scene selection.
5. Final output.

## Agent Architecture

Use one Hermes agent with 7 specialized markdown workflow contexts:

1. Brief agent: process client inputs, property/story requirements, constraints, and desired tone.
2. Image generation: use Runway image API for mood boards and visual references.
3. Story weaver: generate cinematic directions from the brief.
4. Scene generation: create 6 video options; user selects 3.
5. Continuity management: extract/use frames for scene transitions.
6. Audio integration: ElevenLabs for voiceover, Suno for ambient sound.
7. Final compilation: editing and output generation.

Implementation notes:

- Workflows should live as markdown files in the Obsidian/project folders.
- QMD CLI engine is intended for Obsidian integration.
- Repo should include Hermes agent configuration.
- Scrape/organize Runway prompting docs and examples before building prompts.
- Use existing libraries and official Runway docs where possible.

## Demo Strategy

- Use Vio's manually created videos as demo output if needed.
- Show the end-to-end process even if automation is incomplete.
- Repository can be downloadable, but the demo should not depend on perfect output quality from a fresh clone.
- Visual presentation matters more than backend completeness.

## Responsibilities

Vio:

- Create the end-to-end video example.
- Document every prompt and decision.
- Generate 30-second and 1-minute versions.
- Call a real estate client for an authentic brief.

Sam:

- Research and organize all Runway documentation.
- Set up the Obsidian repo with Hermes agent integration.
- Scrape web for prompting guides and examples.
- Create folder structure for each workflow component.

Alex:

- Build the front-end interface and API integration.
- Use a Next.js site in the mono repo.
- Test Runway API integration over the weekend.
- Set up Hermes agent skills for API calls.

## Build Priorities

1. Make the Runway prompt pipeline credible.
2. Make the brief-to-scene selection UX legible.
3. Use real estate client context as the differentiator.
4. Keep the final artifact visually strong, even if some automation is mocked.
5. Avoid overbuilding audio/final compilation until image/video prompting and scene selection work.
