# Moodboard Generation Playbook

`anansi-mood-weaver` must generate a moodboard artifact, not only describe a mood. The artifact can be Markdown, HTML, PDF, or an Obsidian note, depending on the user's request and available tools.

## Definition

A moodboard is a visual decision document that makes the world legible before story and scene work. It should show or specify:

- atmosphere
- palette
- material references
- light choreography
- camera feeling
- environmental behavior
- human presence
- movement language
- avoid references
- controlled variations

## Default Deliverable

Unless the user asks for a specific format, create a Markdown moodboard note in the relevant project folder:

`08 Demo Projects/<Project Name>/Mood System.md`

If the user asks for a polished artifact, create:

- `moodboard.html`
- `moodboard.pdf` when local PDF tooling is available

## Source Material Handling

Use available references in this order:

1. user-provided images, videos, PDFs, docs, palettes, and URLs
2. project assets already in the vault
3. the creative lead palette/reference notes
4. public-safe image search references, if the user asked for research or visual sourcing
5. generated reference prompts, when no images are available

Do not invent that an image exists. If no visual source exists, create reference slots with search/generation prompts.

## Moodboard Structure

Use this sequence:

1. title / project
2. one-sentence mood thesis
3. the creative lead lens notes
4. palette with hex values when possible
5. atmosphere panel
6. light choreography panel
7. material system panel
8. camera feeling panel
9. environmental behavior panel
10. human presence panel
11. controlled variations
12. avoid references
13. detailed tile specifications
14. full image-model prompt
15. downstream preservation contract
16. approval check
17. downstream handoff

## Image-Model Prompting Pass

When the moodboard will be generated in ChatGPT, OpenAI image models, or another image model, add an image prompting pass after the mood system is chosen.

Use these vault notes:

- `19 Mood Systems/Image Model Moodboard Prompting Guide.md`
- `19 Mood Systems/World First Moodboard Directive.md`
- `19 Mood Systems/Moodboard Layout Templates.md`
- `19 Mood Systems/Image Vocabulary - Medium Lens Film Era Bank.md`
- `19 Mood Systems/Moodboard Prompt Formula.md`

Default sequence:

1. Write the world-first thesis: what world the board belongs to, not merely what it looks like.
2. Choose the layout: hero frame, 4-panel board, 6-panel board, 8-12 tile editorial board, triptych, texture/material board, or asymmetric editorial board.
3. If the world is still unclear, generate a single hero image prompt first.
4. Convert the approved hero world into a multi-tile moodboard prompt.
5. Specify tile categories: color palette, material textures, lighting references, object details, spatial atmosphere, composition, typography direction, and emotional atmosphere.
6. Specify every tile in detail. A tile category list is not enough.
7. Define material system, lighting system, color behavior, taste-level controls, cohesion sentence, and text rule.
8. Add a reusable brand kit block when brand consistency matters.
9. Write negative constraints that remove generic AI polish, fake CGI, clutter, bad typography, and the specific wrong-world cues for the project.
10. Include an iteration plan that changes one major variable at a time.

Prompt anatomy:

```txt
World + mood adjectives + multi-tile structure + detailed tile specifications + material system + lighting system + color behavior + composition + taste level + cohesion + exclusions.
```

Do not ask for long body copy inside generated images. If text is needed, quote the exact words, place them, and constrain the typography.

## Detailed Tile Specification Requirement

A complete moodboard should normally use 8-12 tiles. A compact directional moodboard may use 4-6 tiles only when the user needs speed or the project has a very narrow visual question.

Every tile in a moodboard must include enough direction for a designer, image model, or downstream agent to understand exactly what belongs there.

For each tile, include:

- tile number and tile name
- purpose: what decision this tile clarifies
- subject: what physically appears in the tile
- composition: crop, framing, scale, angle, negative space, and visual hierarchy
- material / texture: visible surfaces, fibers, finishes, aging, imperfections
- lighting: source, direction, contrast, shadow behavior, atmospheric effects
- color role: which palette colors appear and what job they do
- emotional job: what the tile should make the viewer feel
- script connection: which beat, line, or emotional turn it supports
- preserve downstream: what later agents must keep
- avoid: what would make this tile wrong
- prompt fragment: one or two promptable sentences for this exact tile

The tile set should usually include:

- color palette / color behavior
- material texture 1
- material texture 2
- lighting reference 1
- lighting reference 2
- object or architectural detail
- spatial / environmental atmosphere
- camera / composition reference
- human presence or scale cue
- typography / graphic direction if relevant
- avoid reference or wrong-world contrast
- abstract emotional atmosphere

## Visual Panel Requirements

Each panel should include:

- visual intent
- concrete cues
- subject
- composition
- material / texture
- lighting
- color role
- emotional job
- script connection
- reference image path or URL, if available
- fallback search/generation prompt if not available
- what downstream agents must preserve
- what to avoid

## Palette Requirements

Always include:

- color name
- hex value when known
- role: dominant, secondary, accent, shadow, highlight, avoid
- material/light association
- color behavior: muted/rich, warm/cool, faded/saturated, dusty/wet, oxidized/mineral, etc.
- location or scene behavior when the world changes across places

## Reference Judgment

For each reference, say:

- extract this
- ignore this
- risk

Never copy references literally. Extract emotional and sensory principles.

## the creative lead Default For Atmospheric Architecture

When the project is spatial, architectural, hospitality, Hinter-like, or contemplative:

- atmosphere matters more than spectacle
- light should feel discovered, not staged
- the frame must breathe through negative space
- architecture and environment should feel emotionally inseparable
- rhythm should alternate between contemplative stillness and subtle sensory pulses
- default camera verb is `observe`
- exception camera verb is `pulse`

## Output Standard

The moodboard is successful when Story Weaver and Scene Weaver can preserve the visual world without rereading the original brief. It should be specific enough to prevent a generic storyboard, generic scene plan, or generic Runway prompt.
