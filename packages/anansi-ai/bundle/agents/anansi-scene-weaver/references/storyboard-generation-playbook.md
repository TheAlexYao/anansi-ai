# Storyboard Generation Playbook

Use when the deliverable is a storyboard, shot plan, previsualization board, animatic plan, commercial sequence, or director's visual treatment.

## Prime Rule

Say clearly:

```txt
Create a storyboard, not a mood board.
```

A storyboard is sequential. It plans shots over time. A moodboard is atmospheric. Do not confuse them.

## Required Inputs

Scene Weaver should receive:

- structured brief
- selected story direction from Story Weaver
- mood system from Mood Weaver
- client-provided materials and the Brief Handoff material inventory
- palette / material / light / camera rules
- continuity motifs
- the creative lead scene judgment rules
- project-specific feedback

## Default Formats

- 6 panels: simple social ad or 15-second cutdown
- 8 panels: 20-30 second commercial sequence
- 9 panels: classic storyboard grid
- 12 panels: detailed short film or atmospheric sequence

For a 20-30 second commercial, default to an 8-panel 4x2 storyboard unless the user specifies otherwise.

## Required Storyboard Setup

Always include:

- storyboard or moodboard: storyboard
- panel count
- grid format
- visual style
- story arc
- continuity rule
- timing rhythm
- camera language
- text / VO rule
- one-action-per-panel rule
- negative constraints

## Story Arc

Define progression before writing panels.

Useful arcs:

- setup -> reveal -> detail montage -> action -> payoff
- anticipation -> reveal -> inspection -> transformation -> reaction -> final product/title
- hook -> reveal -> escalation -> payoff -> CTA
- establish -> detail -> encounter -> change -> emotional release -> final image

The selected story direction should determine the arc. Do not invent a new story if Story Weaver has already selected one.

## Panel Requirements

Every panel must show one clear action or beat only.

Reveal beats must resolve on screen. For page turns, doors, curtains, packages, thresholds, product reveals, transformations, magic tricks, proof demonstrations, or any action that creates anticipation, do not cut away before the viewer sees and understands the revealed result.

Each panel must include:

- panel number
- timing
- shot size
- camera / framing
- movement
- action
- visual continuity
- VO / caption / sound, kept short
- emotional beat
- transition or edit note
- avoid rule
- prompt fragment
- lifelike realism watch, when the action involves hands, pages, faces, instruments, fabric, text, architecture geometry, object contact, or other familiar physical behavior

Template:

```md
### Panel [N] — [Timing] — [Name]

- Shot size:
- Camera / framing:
- Movement:
- Action:
- Visual continuity:
- VO / caption / sound:
- Emotional beat:
- Transition:
- Avoid:
- Prompt fragment:
- Lifelike realism watch:
```

## Camera Language

Use concrete camera terms.

Shot sizes:

- extreme wide shot
- wide shot
- medium shot
- close-up
- extreme close-up
- macro shot
- insert shot
- detail shot
- hero shot
- product shot
- over-the-shoulder shot
- point-of-view shot
- silhouette shot
- low-angle shot
- high-angle shot
- top-down shot
- profile shot

Movement:

- slow push-in
- dolly-in
- tracking shot
- rotating hero shot
- tilt down
- pan across
- rack focus
- static locked-off shot
- handheld drift
- slow reveal
- whip pan
- pull back
- orbiting camera

Notation:

- arrows showing camera movement
- motion lines
- focus marks
- panel captions
- shot numbers
- timing notes
- VO notes
- SFX notes
- cut to
- match cut
- smash cut
- fade in
- hard cut

## Visual Style

Choose one:

- professional black-and-white pencil-and-ink storyboard
- polished grayscale commercial storyboard
- color cinematic storyboard
- animatic style
- comic-like storyboard

Default:

```txt
Use a professional black-and-white storyboard style: clean pencil-and-ink frames, cinematic lighting indicated through shading, numbered panels, short caption notes under each frame, and arrows showing camera or object movement.
```

## Continuity

Always include:

```txt
Maintain visual continuity across all panels: teame subject, teame environment or motivated environment shift, teame lighting system, teame cinematic tone, and teame continuity motif.
```

For products, the product should remain consistent in shape, color, and scale.

For characters, keep design, wardrobe, and setting consistent.

For architecture, preserve physical plausibility, human access, material continuity, and site logic.

For client-led work, preserve the client-provided materials before generic taste references. If the client supplied artwork, photography, scripts, venue references, product assets, brand decks, or previous approvals, the storyboard prompt must say what to preserve from those materials and what not to invent.

## Text And Sound

Use sparse notes. Avoid long readable dialogue in generated images.

Preferred:

```txt
Include very short panel captions only, no long text. Represent voiceover as small VO note boxes, not long readable dialogue.
```

## Relocatable Architecture Storyboards

For temporary, modular, prefab, landscape, or relocatable architecture, the storyboard must show physical plausibility as well as atmosphere.

Required checks:

- realistic prefab dimensions and human-scale access
- warm, natural, guest-facing exterior/interior skin
- removable wood, metal plates, lightweight screens, cladding, modular decks, or soft paths
- no stone steps, permanent infrastructure, heavy foundations, retaining walls, or landscape scars
- nature feels like leisure and immersion, not survival drama
- drone shots only when they clarify landscape relationship, access, low-impact presence, or before/after logic
- consider nature-only shots before arrival or after removal
- light acts as a character through sunrise, blue hour, sunset reflection, curtain-filtered light, moving warm shadows, and interior glow

For Hinter specifically, read:

- `12 the creative lead Creative Director/Hinter Storyboard Feedback - Warm Removable Architecture.md`
- `08 Demo Projects/Hinter Relocatable Landscape Hotel/Hinter Storyboard Revision Notes.md`

## Negative Constraints

Use:

```txt
Avoid mood-board collage, random reference images, unrelated tiles, decorative swatches, chaotic layout, posters, character sheets, concept art splash pages, single-scene illustrations, excessive text, inconsistent subject design, and generic stock-commercial imagery.
```

## All-Purpose Prompt

```txt
Create a professional storyboard sheet, not a mood board, for [title / concept]. Arrange it as [number] numbered panels in a clean [grid], read left to right and top to bottom. Each panel should show one distinct cinematic shot in sequence, with clear continuity of subject, setting, lighting, and tone. Use [visual style]. Include simple camera arrows, short timing notes, and minimal shot captions.

The sequence should follow this arc: [selected story arc].

Panel breakdown:

Panel 1 — [timing]: [shot size / action / camera]
Panel 2 — [timing]: [shot size / action / camera]
Panel 3 — [timing]: [shot size / action / camera]
Panel 4 — [timing]: [shot size / action / camera]
Panel 5 — [timing]: [shot size / action / camera]
Panel 6 — [timing]: [shot size / action / camera]
Panel 7 — [timing]: [shot size / action / camera]
Panel 8 — [timing]: [shot size / action / camera]

Avoid mood-board collage, unrelated reference tiles, concept-art splash pages, posters, chaotic layout, excessive text, inconsistent subject design, and generic stock-commercial imagery.
```
