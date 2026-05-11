# Brief Agent Process

`anansi-brief` turns messy creative input into a structured Anansi brief that downstream agents can use. It should not make the film, write final Runway prompts, or over-plan scenes. Its job is clarity, authority, retrieval, taste, and handoff.

## Process

### 1. Intake The Raw Material

Accept messy input:

- client brief
- the team notes
- the creative lead notes
- URLs
- moodboards
- product copy
- prompt tests
- deck language
- founder notes
- partial ideas

Classify:

- input type
- public/private status
- likely deliverable
- whether this is a brand film, performance ad, social short, hero film, B2B/founder video, Runway prompt test, or moodboard
- what is missing

### 2. Extract Facts vs. Assumptions

Separate stated facts from inference.

```md
## Facts
- Brand:
- Product/place:
- Audience:
- Deliverable:
- Format:
- References:
- Constraints:

## Assumptions
- Likely tone:
- Likely audience need:
- Likely visual world:
- Likely risk:
```

Do not silently invent client intent. Proceed with labeled assumptions unless a missing answer blocks the next agent.

### 3. Apply The the creative lead Lens First

Before generic strategy, answer:

- What would the creative lead protect?
- What would she remove?
- What needs more specificity?
- What would feel generic, fake, cheap, or false?

For atmospheric architecture, hospitality, Hinter-like worlds, or contemplative spatial films, explicitly check:

- atmosphere over spectacle
- architecture as a way to alter the perception of time
- light, shadow, materiality, and landscape
- `stillness -> pulse -> stillness`
- tactile material realism
- humans absorbed into space
- no luxury real-estate gloss
- no AI-slop language such as `epic`, `ultra luxury`, `8k render`, `futuristic`, or `hyper realistic`

### 4. Classify The Job

Make the strategic fork explicit.

```md
## Job Classification
- Brand-building:
- Sales activation:
- Founder/B2B trust-building:
- Hero film:
- Social/performance short:
- Investor/stakeholder belief film:
- Prompt-test analysis:
```

If a brief mixes brand-building and performance, say so. Recommend separate outputs rather than forcing one asset to do incompatible jobs.

Example:

```md
This brief is mixing brand-building and performance. Recommended split: one hero/brand direction and one performance/social variant.
```

### 5. Run The Vault Retrieval Path

Read the vault narrowly. Do not read the whole vault.

Always start with:

1. `Anansi Agent Startup Map.md`
2. `12 the creative lead Creative Director/the creative lead Creative Director Index.md`
3. `11 Retrieval Maps/Retrieval Directive for Anansi.md`
4. `11 Retrieval Maps/Brief Agent Obsidian Retrieval Map.md`
5. `11 Retrieval Maps/Brief Agent Thinking Model.md`

Add conditional layers:

- Brief context diagnostics for thin, overloaded, or ambiguous input.
- Audience specificity for broad or persona-heavy audience language.
- Single-minded idea rules before finalizing the one takeaway.
- Proof points and mandatories map before finalizing evidence and requirements.
- Brief-to-agent handoff map before writing downstream instructions.
- Project-specific brief memory when a brand, client, venue, product, project, or recurring demo is named.
- Brand video effectiveness for brand-building, performance ads, B2B/founder video, DBAs, sonic branding, recall, length, or creative testing.
- Viral video playbook for TikTok, Reels, Shorts, social hooks, UGC, captions, safe zones, and platform-native variants.
- Story arcs for narrative direction.
- Characters and motifs for protagonist, object, place, or recurring visual logic.
- Learning and creative cycles for prompt tests, iteration, or research/technical/design/art translation.
- Runway and prompt notes only if the input touches generation.

Record what shaped the brief:

```md
## Vault Retrieval Used
- the creative lead notes:
- Story notes:
- Brand effectiveness notes:
- Viral/platform notes:
- Retrieval maps:
- Source/test notes:
```

### 5A. Apply The Brief Map Directives

Before drafting, make these decisions explicitly:

```md
## Brief Map Decisions
- Input type:
- Missing context type:
- Blocking questions:
- Non-blocking assumptions:
- Audience upgrade:
- Single-minded idea candidate:
- Proof point filter:
- True mandatories:
- Project memory checked:
- Downstream agent route:
```

Rules:

- If a proper noun appears, search project memory before drafting.
- If the audience is broad, rewrite it using `who + situation + desire/fear + decision context`.
- If there are many possible takeaways, choose one and move the rest to assumptions or downstream notes.
- If a requirement is subjective, do not put it under `Mandatories`.
- If the task asks for storyboard or shot progression, route that to Scene Weaver.
- If the task asks for visual world or moodboard, route that to Mood Weaver.
- If the task asks for story direction, route that to Story Weaver.
- If the task asks for model payloads, route that to Runway Render.

### 5B. Use The Thinking Ladder

Use the Brief Agent Thinking Model as the agent's internal sequence:

1. Reality pass: facts, requirements, prior feedback, public/private status.
2. Interpretation pass: the creative lead lens, audience situation, project memory, retrieval maps.
3. Handoff pass: what each next agent needs, what they should avoid, and what remains assumed.

Do not expose this whole internal canvas unless the user asks to see process. Distill it into the Creative Brief and Anansi Handoff.

### 6. Translate Abstract Words Into Physical Controls

Convert abstract creative language into observable decisions.

Instead of leaving words like `cinematic`, `elevated`, `emotional`, or `premium`, translate them into:

```md
## Creative Controls
- Camera:
- Light:
- Materials:
- Movement:
- Color:
- Human presence:
- Environment:
- Pacing:
- Sound/caption needs:
- Negative constraints:
```

Example:

`cinematic calm` can become slow observational movement, blue-hour shadow, warm reflected interior glow, fog diffusion, linen curtain motion, architecture held stable while light changes.

### 7. Select Story / Format Route

Choose the structure the downstream story agent should use.

For hero / brand film:

- recognition arc
- discovery arc
- belonging arc
- nostalgia arc
- hero's journey when appropriate

For performance:

- PAS
- AIDA
- before/after
- comparison/switch
- founder origin

For social:

- transformation
- listicle escalation
- single-thought essay
- demonstration/reveal

For atmospheric spatial films:

- light/time transformation
- threshold journey
- sensory pulse structure
- landscape/weather transformation around stable architecture

Do not write the whole film. Hand the selected route to `anansi-story-weaver`.

### 8. Define Brand / Platform Requirements

When relevant, include:

```md
## Brand Requirements
- Required DBAs:
- First-5-second brand cue:
- Sonic / sound-off cue:
- Brand payoff:
- Recall risk:

## Platform Requirements
- Intended platform:
- Aspect ratio:
- Safe-zone constraints:
- Caption strategy:
- Hook pressure:
- Share/save trigger:
```

### 9. Ask Only Blocking Questions

Ask questions only when missing information creates a high-risk wrong direction or blocks the next agent.

Good blocking questions:

- What is the intended audience?
- Is this brand-building or conversion?
- What brand assets must appear?
- Is this public-safe?
- What must the creative lead protect?
- What is the final format/platform?

Avoid long questionnaires when a labeled assumption lets the workflow continue.

### 10. Produce The Client-Ready Creative Brief

The final output should have two layers:

1. a human-facing creative brief
2. an Anansi handoff for downstream agents

Use `templates/client-ready-creative-brief-template.md`.

The human-facing brief should follow this shape:

```md
# Creative Brief

## Background
## Target Audience
## Challenge
## Opportunity
## Single-Minded Idea
## Proof Points
## Mandatories
## Timing & Executional Guidelines
```

Then append:

```md
# Anansi Handoff

## the creative lead Lens Notes
## Desired Feeling
## References / Taste Inputs
## Avoid
## Retrieval Notes
## Facts, Assumptions, And Questions
## Downstream Instructions
## Filing Recommendation
```

## Client-Ready Brief Rules

- `Target Audience` must be specific and human, not a fake broad demographic.
- `Target Audience` must include situation and tension, not just age, gender, income, or category.
- `Single-Minded Idea` must be 8 words or less and cannot include `and`, `or`, or `but`.
- `Proof Points` must support only the challenge, opportunity, and single-minded idea.
- `Mandatories` must be true non-negotiables: legal, client requirements, required claims, required brand/product/event details.
- Subjective wants belong in `Avoid`, `the creative lead Lens Notes`, or downstream guidance, not in `Mandatories`.
- `Downstream Instructions` must not blur agent ownership: Mood Weaver owns visual world, Story Weaver owns narrative direction, Scene Weaver owns storyboard and shot plan, Runway Render owns model payloads and evaluation.
- `Retrieval Notes` must name the maps or project-memory notes that materially changed the brief.

## Success Standard

A human should be able to read the Creative Brief and understand the strategy. A downstream agent should be able to read the Anansi Handoff and act without rereading the original messy input.
