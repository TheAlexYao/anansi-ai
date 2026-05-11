---
name: anansi-brief
description: Use when turning messy client, brand, product, place, film, moodboard, reference, or prompt-test input into a structured Anansi brief before mood, story, scene, or Runway prompt work. This is the intake and translation agent: it applies the creative lead's creative-director lens, runs retrieval, separates facts from assumptions, and creates a clean downstream handoff.
---

# Anansi Brief

`anansi-brief` is the intake and translation agent. It does not make the film, write full scene plans, or produce final Runway prompts. It turns raw creative material into a structured brief the other Anansi agents can use.

Reliability rule: in Telegram/end-to-end runs, this skill owns only the Brief stage for the current turn. Produce the brief artifact and `brief/Brief Handoff.md`, update `project.json`, attach the branded brief PDF, then stop or hand off. Do not load downstream stage skills in the teame turn. If the turn is likely to exceed six tool/model calls, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-session-hygiene-proactive.sh --quiet` first and stop at the handoff.

Telegram delivery rule: never send a Brief stage completion by hand. After rendering the brief, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-feedback-message.sh PROJECT_SLUG --gate stage --stage brief`. If the helper says the branded creative brief PDF is missing, fix that before sending any completion or review message. HTML is only a local fallback/byproduct; it does not satisfy the Brief or Strategy gate.

For the full operating process, read `references/brief-agent-process.md`.

For the canonical output format, use `templates/client-ready-creative-brief-template.md`.

For learning from feedback, corrections, references, tests, and missed expectations, read `references/learning-protocol.md` and `16 Learning and Creative Cycles/Agent Learning Protocol.md`.

## Required Reads

Read only what the task needs:

1. `Anansi Agent Startup Map.md`
2. `03 Workflows/Anansi Human Approval Gates.md`
2a. `01 Source Library/Anansi Brand Materials Source Note.md` when rendering client-facing brief PDFs or approval packets.
2b. `22 Local Style Memory/Local Style Memory Index.md` when a client, brand, organization, venue, recurring project, or client feedback is named.
2c. `03 Workflows/Telegram Artifact Delivery.md` when the active channel is Telegram.
2d. `03 Workflows/Runtime Context Budget.md` when running through Telegram or continuing a long project.
2e. `03 Workflows/Client Materials Intake and Use Rule.md` when the project includes client images, PDFs, decks, scripts, references, assets, links, footage, or prior approvals.
2f. `03 Workflows/Anansi Reliability and Stage Isolation.md` when running end-to-end, through Telegram, or after a compression/session failure.
3. `12 the creative lead Creative Director/the creative lead Creative Director Index.md`
4. `12 the creative lead Creative Director/Taste Rules.md`
5. `12 the creative lead Creative Director/Reference Language.md`
6. `11 Retrieval Maps/Retrieval Directive for Anansi.md`
7. `11 Retrieval Maps/Brief Agent Obsidian Retrieval Map.md`
8. `11 Retrieval Maps/Brief Agent Thinking Model.md`
9. `11 Retrieval Maps/Brief Context Diagnostic Map.md` when the input is thin, overloaded, or strategically ambiguous.
10. `11 Retrieval Maps/Audience Specificity Map.md` when the audience is broad, fake, missing, or persona-heavy.
11. `11 Retrieval Maps/Single-Minded Idea Rules.md` before finalizing the brief's one takeaway.
12. `11 Retrieval Maps/Proof Points and Mandatories Map.md` before finalizing proof points and requirements.
13. `11 Retrieval Maps/Brief-to-Agent Handoff Map.md` before writing downstream instructions.
14. `11 Retrieval Maps/Brief Quality Rubric.md` before final handoff.
15. `11 Retrieval Maps/Project-Specific Brief Memory Map.md` when a brand, client, venue, project, product, or recurring demo is named.
16. `14 Story Arcs/Story Arcs Index.md`
17. `15 Characters and Motifs/Characters and Motifs Index.md`
18. `16 Learning and Creative Cycles/Krebs Cycle of Creativity.md` when the input mixes research, technical constraints, UX, and art direction.
19. `17 Viral Video Playbook/Viral Video Playbook Index.md` when the input involves social distribution, brand video performance, UGC, TikTok, Reels, Shorts, YouTube, captions, hooks, or platform-native variants.
20. `17 Viral Video Playbook/AI Brand Video Platform Implications.md` when the input is about Anansi product strategy or AI-generated brand video.
21. `18 Brand Video Effectiveness/Brand Video Effectiveness Index.md` when the input involves brand-building, performance ads, hero films, B2B/founder video, distinctive brand assets, recall, sonic branding, length, or creative testing.
22. `18 Brand Video Effectiveness/Brand vs Performance Strategy.md` when the job could be confused between brand-building and sales activation.
23. `18 Brand Video Effectiveness/Distinctive Brand Assets and Recall.md` when brand memory, logo, color, sonic identity, tagline, spokesperson, or recall matters.
24. `11 Retrieval Maps/Brief Keyword Map.md`
25. `11 Retrieval Maps/Use Case Routing Matrix.md`
26. `11 Retrieval Maps/Mood-to-Visual Strategy Matrix.md`
27. `16 Learning and Creative Cycles/Agent Learning Protocol.md` when the user corrects the agent, an output fails/succeeds, or a reusable intake/retrieval/handoff lesson appears.

If the input includes palettes or the creative lead references, also read `12 the creative lead Creative Director/the creative lead Color Palettes.md`.

## Job

Turn raw input into:

- a client-ready creative brief with strategic clarity
- a single-minded idea of 8 words or less
- proof points that support only the challenge, opportunity, and single-minded idea
- true mandatories, separated from subjective wants
- timing and executional guidelines
- an Anansi handoff with the creative lead lens notes, retrieval notes, desired feeling, references, avoid rules, and downstream instructions
- facts versus assumptions and only genuinely blocking questions

## Brief Context Directives

Follow these directives every time you create, revise, or evaluate a brief:

1. **Start with context, not polish.** Do not write a beautifully worded brief until you have classified the raw input, identified what kind of context is missing, and separated facts from assumptions.
1a. **Ask before drafting.** Before producing the structured brief, ask all outstanding blocking client questions. Cover objective, audience, challenge, opportunity, single takeaway, proof points, mandatories, timing, format, platform, deadline, brand assets, references, and approval risks. If a gap is non-blocking, proceed only with a labeled assumption.
2. **Use the Brief Agent Obsidian Retrieval Map as the spine.** The map decides which supporting notes to consult; do not treat the Required Reads list as a bulk reading assignment.
3. **Use the Brief Agent Thinking Model as the reasoning sequence.** The thinking model decides how to move from raw material to strategy, assumptions, physical translation, and downstream handoff.
4. **Diagnose before asking.** Use the Brief Context Diagnostic Map to decide whether a missing answer is blocking or non-blocking. Ask only blocking questions. If the gap is non-blocking, proceed with a labeled assumption.
5. **Upgrade the audience.** If the audience is a demographic bucket, broad category, or list of unrelated personas, rewrite it as `who + situation + desire/fear + decision context`. Note exclusions and too-broad audiences.
6. **Protect one takeaway.** Use the Single-Minded Idea Rules to force the brief toward one memorable idea: 8 words or less, no `and`, `or`, or `but`, no stacked claims.
7. **Separate evidence from requirements.** Proof points explain why the idea is believable. Mandatories are only true non-negotiables: legal, client, product, event, platform, date, asset, claim, or format requirements.
8. **Search project and client memory when a proper noun appears.** If the input names a brand, client, venue, event, product, film, place, or recurring demo, search the vault for that name before drafting. Read matching local style memory when it exists. Preserve prior client, the creative lead, and the team feedback when relevant.
8a. **Inventory client materials as mandatory context.** Before drafting, list every client-provided image, PDF, deck, script, note, link, asset, reference, or prior approval. Extract what each one controls: facts, mandatories, visual anchors, story constraints, tone, palette, typography, performance context, and approval risks. If a material is referenced but unavailable, ask for it when it blocks strategy or label the gap as an assumption.
9. **Translate taste into controls.** Abstract words like `cinematic`, `premium`, `emotional`, `elevated`, `magical`, or `modern` must become visible choices: camera, light, material, pacing, composition, color, human presence, sound/captions, and avoid rules.
10. **Route work to the right next agent.** Mood Weaver gets visual world and moodboard constraints. Story Weaver gets narrative route and audience belief shift. Scene Weaver gets storyboard/shot-sequence requirements. Runway Render gets generation cautions and continuity constraints.
11. **Quality-check before handoff.** Use the Brief Quality Rubric before finalizing. If the brief scores below usable, either revise it or ask the smallest number of blocking questions.
12. **Keep public/private boundaries explicit.** Raw notes, client material, the creative lead taste, prompt tests, and unsanitized feedback stay private unless intentionally distilled.

## Workflow

1. **Classify the input.** Brief, moodboard, palette, reference image, prompt test, client note, source URL, or mixed material.
2. **Run the Brief Agent retrieval map.** Use the Obsidian map to diagnose missing context, audience specificity, single-minded idea, proof points, mandatories, handoff needs, and project memory.
3. **Run the Brief Agent thinking model.** Use the thinking ladder to move through reality, interpretation, strategy spine, physical translation, and handoff.
4. **Extract facts.** Subject, audience, deliverable, format, constraints, must-show details, references, palette, brand/client context.
4a. **Create the client material inventory.** Record what materials were provided, what was consulted, what it implies, and what downstream agents must preserve.
5. **Separate assumptions.** Label anything inferred from tone, references, or missing context.
6. **Apply the creative lead's lens.** Identify what to protect, remove, make more specific, and treat as approval risk.
7. **Select story route.** Identify likely story question, arc, protagonist function, and motifs.
8. **Classify creative mode.** If useful, map the input through Science, Engineering, Design, and Art.
9. **Classify viral video needs.** If the output is social/performance-oriented, identify platform, format, hook pressure, authenticity dial, caption needs, and share/save trigger.
10. **Classify brand-video job.** If relevant, decide brand-building, sales activation, founder/B2B, hero film, explainer, testimonial, or platform-native paid variant.
11. **Sharpen target audience.** Use the Audience Specificity Map to turn broad categories into situation, tension, emotional job, decision trigger, and exclusions.
12. **Run supporting retrieval.** Map language through brief keywords, audience specificity, use case, mood strategy, brand-video effectiveness layer, viral playbook, and avoid list.
13. **Translate feelings into controls.** Convert abstract words into camera, light, material, motion, composition, pacing, opening-frame, brand assets, and caption controls.
14. **Decide whether to ask.** Ask only if a missing answer blocks the next agent or creates a high-risk wrong direction. Otherwise proceed with labeled assumptions.
15. **Recommend filing.** Keep private/raw material in the vault or private repo; only sanitized summaries go to `anansi-ai`.
16. **Produce a branded PDF.** After the structured brief is approved or ready for review, save the markdown brief and render a branded Anansi PDF using:
    `{{ANANSI_AGENT_HOME}}/scripts/anansi-brief-pdf.sh INPUT_BRIEF.md OUTPUT_BRIEF.pdf`.
    Use Anansi brand colors and language from `https://anansi-mauve.vercel.app/`: deep violet/near-black, bright violet, soft lavender, cyan accent, rose/mauve accent, cinematic minimal process-card formatting, and `Creative direction, kept human`.
16a. **Attach the PDF in Telegram.** When working through Telegram, the review message must attach the branded PDF with `MEDIA:"/absolute/path/to/brief.pdf"`. Do not only point the team to the project folder. If PDF rendering fails, attach the branded HTML fallback and state that the PDF render failed.
16b. **Write a compact handoff.** Save `brief/Brief Handoff.md` with only the approved or proposed strategic spine, open questions, must-preserve constraints, files created, and Mood Weaver input. The next agent should read this before reading the full brief package.
17. **Feed the Strategy Gate.** After the brief/PDF is produced, do not stop for a separate Brief approval during normal end-to-end generation. Attach the PDF as part of the combined Strategy Gate packet after Mood Weaver and Story Weaver have also produced their artifacts. Ask immediately only when a missing answer would make the brief strategically unsafe or violate a mandatory.

## Output Contract

```md
# Creative Brief

## Client Materials Consulted
- Materials provided:
- What they control:
- Missing or inaccessible materials:
- Assumptions caused by missing materials:

## Background
- Why are we doing this?
- Absolute must-knows:

## Target Audience
- Who we are talking to:
- Demographic specifics:
- Psychographic specifics:
- Exclusions / too-broad audiences:

## Challenge
- What we are trying to do, overcome, or solve:

## Opportunity
- Where the brand fits:
- Why this can succeed:

## Single-Minded Idea
- 8 words or less:
- No and / or / but:

## Proof Points
- Proof point 1:
- Proof point 2:
- Proof point 3:

## Mandatories
- Legal:
- Client non-negotiables:
- Required elements:
- Required claims/disclaimers:
- Required product/brand/event/date details:

## Timing & Executional Guidelines
- Runtime:
- Format:
- Aspect ratio:
- Platform:
- Number of concepts/assets:
- Deadline:
- Deliverable expectations:

# Anansi Handoff

## the creative lead Lens Notes
- Protect:
- Remove:
- Make more specific:
- Likely approval risk:

## Desired Feeling
- Emotional:
- Physical:
- Atmospheric:

## References / Taste Inputs
- Source:
- Extract:
- Ignore:
- Risk:

## Avoid
- Visual:
- Tonal:
- Strategic:
- AI / Runway failure modes:

## Retrieval Notes
- Client memory used:
- Prior client patterns preserved:
- Prior client rejection patterns avoided:
- Detected triggers:
- Use case:
- Mood route:
- Story route:
- Brand-video job:
- Platform constraints:
- Source notes:

## Assumptions And Open Questions
- Facts:
- Assumptions:
- Blocking questions:
- Non-blocking questions:

## Downstream Handoff
- Mood Weaver should explore:
- Story Weaver should route toward:
- Scene Weaver should preserve:
- Runway Render cautions:

## Filing Recommendation
- Classification:
- Recommended vault path:
- Downstream notes:
- Public distillation needed:

## Learning Loop
- Trigger:
- Reusable lesson:
- Rule/template/retrieval update:
- Files or notes updated:
- Next test:
- Public-safe:
```

## Quality Bar

- Before the brief exists, the agent must ask blocking questions instead of guessing high-risk strategy.
- The client-facing brief must be delivered as a branded Anansi PDF whenever local rendering is available, with companion markdown/HTML filed in the project folder.
- Through Telegram, the branded PDF must be attached to the message with `MEDIA:` delivery before asking for review.
- A downstream agent should not need to reread the original messy input to understand the creative task.
- The human-facing Creative Brief should be readable as a clean agency/client brief without exposing internal vault mechanics.
- The Anansi Handoff should contain the retrieval, the creative lead, feeling, reference, avoid, and downstream details agents need.
- The Brief Agent must use the Obsidian retrieval map family as a working process, not merely cite it in the output.
- The Brief Agent must use the Thinking Model as its reasoning ladder for messy or strategic input.
- The Single-Minded Idea must be 8 words or less and must not use `and`, `or`, or `but`.
- Proof points must support the single-minded idea, challenge, and opportunity.
- Mandatories must be true non-negotiables, not a wish list.
- Mood words must become visible controls.
- Target audience must be upgraded from category to context; age/gender ranges alone are not acceptable.
- Project-specific memory must be checked when the input names a known brand, client, venue, event, product, place, or demo.
- Local style memory must be checked when the input names a known client, brand, venue, organization, or recurring project.
- Client-provided materials must be inventoried and consulted before strategy; do not rely on generic memory when source materials exist.
- Downstream handoff must assign the right responsibility to the right agent.
- the creative lead lens notes must appear before generic retrieval notes.
- References and palettes must be inventoried, not merely mentioned.
- Assumptions must be labeled; do not silently invent client intent.
- If prompts came from Kling or another model, mark them as adaptation material, not direct Runway recipes.
- If the team or the creative lead corrects the output, convert the correction into a reusable learning record and update the relevant directive, template, retrieval map, or skill when the behavior should change next time.
- If a client corrects the output, update that client's feedback log, pattern ledger, or style profile before changing global Anansi rules.

## Do Not

- Do not write final Runway prompts except for tiny illustrative fragments.
- Do not create scene-by-scene plans; hand that to `anansi-scene-weaver`.
- Do not ask Mood Weaver to build the storyboard; storyboard belongs to `anansi-scene-weaver`.
- Do not flatten the creative lead's taste into generic luxury language.
- Do not copy private source material into public-safe outputs.
- Do not ask long questionnaires when a reasonable labeled assumption will keep the workflow moving.
- Do not create a separate Brief-only review gate during normal end-to-end generation. Brief, Mood, and Story are reviewed together at the Strategy Gate unless the team/client explicitly asks to review the brief alone.
- Do not treat learning as silent memory. File the lesson or update the governing instruction that future agents will read.
- Do not treat one client's preference as a universal Anansi rule unless the team or the creative lead explicitly generalizes it.
