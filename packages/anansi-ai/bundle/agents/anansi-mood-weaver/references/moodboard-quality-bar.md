# Moodboard Quality Bar

Mood Weaver must create a useful visual decision document, not a decorative list of adjectives.

## A Strong Moodboard Must Answer

- What world are we entering?
- What does the audience feel before they understand the story?
- What materials, surfaces, weather, and light make that feeling physical?
- What palette governs the world, and how do the colors behave?
- What camera behavior belongs in this world?
- What visual references should be extracted, and what should be ignored?
- What would make this world feel generic, fake, cheap, or wrong?
- What must Story Weaver, Scene Weaver, and Runway Render preserve?

## Required Depth

Every moodboard must include:

- world-first thesis
- the creative lead lens notes
- board palette with roles, hex values when possible, color behavior, and avoid colors
- material system with tactile rules and failure modes
- light choreography with sources, behavior, time of day, and emotional role
- camera feeling with default verb, movement, distance, and pace
- spatial / environmental behavior
- human presence rules
- 8-12 tile taxonomy for a complete board, or 4-6 tiles for a compact directional board
- detailed tile specs
- full image-model prompt
- negative constraints
- downstream preservation rules

## Tile Spec Requirement

For each tile:

- purpose: what decision this tile clarifies
- subject: what physically appears
- composition: crop, scale, angle, negative space, hierarchy
- material / texture: visible surfaces, fibers, finishes, imperfections
- lighting: source, direction, contrast, shadow behavior, atmosphere
- color role: which palette colors appear and why
- emotional job: what the tile should make the viewer feel
- reference / source: actual file, URL, or `needs reference`
- prompt fragment: one or two promptable sentences
- preserve downstream: what later agents must keep
- avoid: what would make the tile wrong

## Palette Logic

Do not only list colors. Define:

- dominant color
- secondary colors
- accent colors
- shadow colors
- highlight colors
- material associations
- light associations
- avoid palette
- how color changes across locations or scenes

## Reference Logic

For each reference, specify:

- extract this
- ignore this
- risk

Never copy references literally. Extract atmosphere, rhythm, light, material behavior, camera feeling, and sensory logic.

## Image-Model Prompt Rule

When generating an image-model moodboard prompt:

- ask for a moodboard, not a single scene
- arrange as a curated multi-tile board
- specify tile count and tile categories
- include detailed panel-by-panel tile instructions
- include material swatches, lighting studies, macro details, environmental references, palette blocks, composition references, and subtle typography direction
- avoid readable text unless sparse section labels are explicitly needed
- include aggressive negative constraints

## Failure Modes

Reject or revise a moodboard that:

- reads as a Pinterest collage
- has unrelated tiles
- uses generic mood words without physical translation
- lacks color behavior
- lacks material specificity
- does not tell Scene Weaver what to preserve
- is pretty but emotionally empty
- is too commercial, glossy, sterile, overdesigned, or AI-polished
