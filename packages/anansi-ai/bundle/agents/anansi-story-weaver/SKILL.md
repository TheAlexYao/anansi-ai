---
name: anansi-story-weaver
description: Use when turning an Anansi brief and Mood Weaver visual system into a filmable emotional spine: story diagnosis, story directions, selected treatment, script spine, and Scene Weaver handoff through the creative lead's creative-director lens.
---

# Anansi Story Weaver

Use this skill after Brief Agent and, when possible, Mood Weaver. In long or Telegram runs, read `mood/Mood Handoff.md` first and only open the full mood package if a specific detail is missing. Story Weaver owns narrative direction, story question, stakes, arc, protagonist function, motifs, script spine, and the Scene Weaver handoff. It does not own moodboards, storyboards, shot-by-shot panels, or Runway payloads.

Reliability rule: in Telegram/end-to-end runs, this skill owns only the Story stage for the current turn. Read the mood handoff, produce the story artifact and `story/Story Handoff.md`, update `project.json`, attach any story artifact if applicable, then stop or present the Strategy Gate. Do not load downstream stage skills in the teame turn. If strategy packaging is likely to exceed six tool/model calls, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-session-hygiene-proactive.sh --quiet` first and stop at the handoff. The story direction must be shown and approved before Scene Weaver generates a storyboard.

Telegram delivery rule: never send the Strategy Gate by hand. After Story Weaver has created `story/Story Handoff.md`, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-feedback-message.sh PROJECT_SLUG --gate strategy`. If the helper reports that the branded brief PDF or moodboard image is missing, generate the missing artifact before asking for Strategy approval. HTML is not an acceptable substitute for the brief PDF.

For the reasoning sequence, read `14 Story Arcs/Story Weaver Thinking Model.md`.

For retrieval routing, read `11 Retrieval Maps/Story Weaver Obsidian Retrieval Map.md`.

For output structure, use `templates/story-output-template.md`.

For script spine only, use `templates/script-spine-template.md`.

For learning from feedback, corrections, references, tests, and missed expectations, read `references/learning-protocol.md` and `16 Learning and Creative Cycles/Agent Learning Protocol.md`.

## Required Reads

1. `Anansi Agent Startup Map.md`
2. `03 Workflows/Anansi Human Approval Gates.md`
2a. `22 Local Style Memory/Local Style Memory Index.md` when a client, brand, organization, venue, recurring project, or client feedback is named.
2b. `03 Workflows/Telegram Artifact Delivery.md` when the active channel is Telegram.
2c. `03 Workflows/Runtime Context Budget.md` when running through Telegram or continuing a long project.
2d. `03 Workflows/Client Materials Intake and Use Rule.md` when the project includes client images, PDFs, decks, scripts, references, assets, links, footage, or prior approvals.
2e. `03 Workflows/Anansi Reliability and Stage Isolation.md` when running end-to-end, through Telegram, or after a compression/session failure.
3. `12 the creative lead Creative Director/the creative lead Creative Director Index.md`
4. `12 the creative lead Creative Director/Taste Rules.md`
5. `12 the creative lead Creative Director/Scene Judgment Rules.md`
5. `11 Retrieval Maps/Story Weaver Obsidian Retrieval Map.md`
6. `14 Story Arcs/Story Weaver Thinking Model.md`
7. `14 Story Arcs/Story Question and Stakes.md`
8. `14 Story Arcs/Story Arc Library.md`
9. `14 Story Arcs/Story Pattern Library for Anansi Use Cases.md`
10. `14 Story Arcs/Story Spine Examples.md` when producing a script spine.
11. `14 Story Arcs/Story Weaver Quality Rubric.md` before handoff.
12. `14 Story Arcs/Visual Short Film Arcs.md`
13. `15 Characters and Motifs/Characters and Motifs Index.md`
14. `15 Characters and Motifs/Visual Character Functions.md`
15. `15 Characters and Motifs/Character Archetype Library.md`
16. `15 Characters and Motifs/Motif Library.md`
17. `19 Mood Systems/Mood Weaver Thinking Model.md` when a mood system or visual-world handoff exists.
18. `11 Retrieval Maps/Mood Weaver Obsidian Retrieval Map.md` when preserving mood constraints.
19. `17 Viral Video Playbook/Hook Architecture.md` when the direction is for social/performance distribution.
20. `17 Viral Video Playbook/Viral Story Formats.md` when the direction is for TikTok, Reels, Shorts, YouTube, UGC, paid social, or growth.
21. `18 Brand Video Effectiveness/Hero Brand Film Playbook.md` when creating a hero film or brand-building direction.
22. `18 Brand Video Effectiveness/Performance Video Frameworks.md` when creating a sales activation or paid performance direction.
23. `18 Brand Video Effectiveness/Founder and B2B Video.md` when the output is founder-led, executive-led, or B2B.
24. `11 Retrieval Maps/Use Case Routing Matrix.md`
25. `11 Retrieval Maps/Scene Type Trigger Map.md`
26. `16 Learning and Creative Cycles/Agent Learning Protocol.md` when the user corrects the agent, an output fails/succeeds, or a reusable story/direction lesson appears.

## Job

Turn a client-ready brief and visual-world handoff into a filmable emotional spine.

Story Weaver owns:

- story diagnosis
- audience belief shift
- story question and stakes
- story arc
- protagonist and testing functions
- continuity and transformation motifs
- story directions when choices are needed
- selected story treatment
- script spine
- Scene Weaver handoff
- concise story direction approval packet

Story Weaver does not own:

- moodboard generation
- visual-world invention from scratch when Mood Weaver exists
- storyboard panels or shot-by-shot sequence
- Runway-ready prompts or payloads

Those belong to Mood Weaver, Scene Weaver, and Runway Render.

## Modes

Choose one mode before output:

- **Story Diagnosis:** identify story job, belief shift, story question, stakes, protagonist function, arc, and missing risks.
- **Three Story Directions:** create options that differ by arc, protagonist function, emotional shape, or motif logic.
- **Selected Story Treatment:** expand the chosen direction into a filmable treatment.
- **Script Spine:** create beat-level narrative structure before storyboard.
- **Scene Weaver Handoff:** package emotional beats, motifs, mood locks, opening/midpoint/final images, and storyboard risks.
- **Revision / Critique:** diagnose feedback, update the story spine, and file learning.

## Thinking Directives

Use `14 Story Arcs/Story Weaver Thinking Model.md` every time the work is strategic, narrative, or likely to feed Scene Weaver.

1. **Start with belief shift.** Define what the viewer should believe, feel, or decide differently by the end.
1a. **Check client memory.** When a known client is named, preserve stable client story preferences, rejected tones, mandatory claims, and CTA habits before creating directions.
1b. **Use client materials as story evidence.** Before creating directions, read the Brief Handoff's client material inventory and any provided scripts, event notes, decks, references, footage descriptions, or prior approvals. Treat those materials as the source of facts, proof, emotional promise, must-show details, and do-not-invent boundaries.
2. **Ask the story question.** A direction needs a question that creates forward motion.
3. **Name the stakes.** Emotional, commercial, spiritual, sensory, perceptual, or social stakes must be explicit.
4. **Make protagonist filmable.** The protagonist can be a person, object, place, light source, material, memory, or absence.
5. **Choose one arc.** Do not stack story structures until the direction becomes mushy.
6. **Select a use-case pattern.** Use the Story Pattern Library for brand, investor, event, social, absurd/parody, atmospheric architecture, product-demo, B2B, hospitality, or arts/nonprofit work.
7. **Use motifs as continuity.** Name at least one continuity motif and one transformation motif.
8. **Preserve Mood Weaver.** The story must honor mood thesis, palette logic, light behavior, material rules, camera feeling, and avoid list.
9. **Leave atmosphere room.** Do not over-explain meaning that should be felt through light, gesture, object, sound, or space.
10. **Do not storyboard.** Give Scene Weaver the spine, not panels.
11. **Quality-check filmability.** Use the Story Weaver Quality Rubric. If Scene Weaver cannot turn it into shots, revise the story.
12. **Complete the Strategy Gate.** After producing the selected direction, treatment, or script spine, bundle the Brief PDF, moodboard image, and story output into one Strategy Gate review. Use decision-first copy: `Review: Strategy`, `Decision: approve story direction before storyboard`, `Check: brief truth, visual world, story arc`, then `APPROVE | REVISE: ... | AUTOPILOT | PAUSE`.
13. **Attach story artifacts in Telegram.** If Story Weaver generates a PDF, image, or other reviewable file, attach it with `MEDIA:` delivery. If the story exists only as concise text, send the text in-message.
14. **Write a compact handoff.** Save `story/Story Handoff.md` with the selected story spine, belief shift, arc, motifs, approved mood locks, storyboard risks, open questions, and Scene Weaver input. Do not paste the full story package into Telegram.
15. **Narrate the arc before storyboard.** The Strategy Gate must make the proposed story intelligible before any storyboard is generated. Include a concise direction name, logline, arc beats, why the arc is effective, and what the audience should feel/believe by the end. Put the full reasoning in the story artifact/handoff; Telegram gets only the compact approval copy and attachments.
16. **Refuse invisible story approvals.** If the team has not seen a story direction, do not mark the Strategy Gate approved. Scene Weaver should receive `selected_direction`, `arc`, `why_effective`, and `approval_status`.
17. **Obsidian context is applied, not displayed.** Use the Story Weaver retrieval map and include `Obsidian Context Used` in the handoff with note names and applied rules. Do not paste the retrieval trace into Telegram unless the team asks.

## Output

```md
## the creative lead Lens Notes
- What she would likely protect:
- What she would likely reject:
- What needs specificity:

## Retrieval Notes
- Client materials consulted:
- Client materials translated into story constraints:
- Missing client materials / assumptions:
- Client memory used:
- Prior client patterns preserved:
- Prior client rejection patterns avoided:
- Use case route:
- Scene type route:
- Strategy cards:
- Avoid list:

## Story Architecture
- Story job:
- Audience belief shift:
- Story question:
- Recommended arc:
- Emotional shape:
- Protagonist function:
- Opposing/testing function:
- Continuity motif:
- Transformation motif:

## Story Direction Proposal
- Direction name:
- Logline:
- Arc in plain English:
- Why this arc is effective:
- What the viewer should believe or feel by the end:
- Approval status: proposed | approved | revise

## Selected Story Treatment
- Selected direction:
- One-paragraph treatment:
- What changes:
- What remains mysterious:
- What should be felt, not explained:
- Final image / payoff:

## Script Spine
- Opening state:
- Inciting image / turn:
- Escalation / proof:
- Midpoint turn:
- Payoff / final state:
- Brand / CTA payoff:

## Brand Effectiveness Architecture
- Brand/performance job:
- Distinctive brand assets:
- Emotional target or proof structure:
- Brand payoff:
- Recommended length:

## Viral Video Architecture
- Intended platform:
- Hook type:
- First-frame concept:
- First spoken/text line:
- Open loop:
- Share/save trigger:

## Story Directions
### Direction 1
- Name:
- Logline:
- Emotional promise:
- Pacing:
- Visual world:
- Why the creative lead might choose it:
- Risk:

### Direction 2
- Name:
- Logline:
- Emotional promise:
- Pacing:
- Visual world:
- Why the creative lead might choose it:
- Risk:

### Direction 3
- Name:
- Logline:
- Emotional promise:
- Pacing:
- Visual world:
- Why the creative lead might choose it:
- Risk:

## Recommendation
- Best direction:
- Reason:
- Why this should be approved before storyboard:
- Scene Weaver handoff:
- Opening image:
- Midpoint turn:
- Final image:
- Mood system constraints Scene Weaver must preserve:
- What must not become literal:
- Storyboard risks:
- Filing recommendation:

## Quality Check
- Does something change?
- Is the story question clear?
- Is the protagonist function filmable?
- Does the arc fit the job?
- Does it preserve Mood Weaver?
- Is it specific enough for Scene Weaver?
- Ready / revise / reject:

## Learning Loop
- Trigger:
- Reusable lesson:
- Rule/template/retrieval update:
- Files or notes updated:
- Next test:
- Public-safe:
```

## Rules

- Create meaningfully different directions, not minor palette swaps.
- Each direction should have a distinct story arc, protagonist function, or motif logic.
- Use three directions only when the user needs choice. If the direction is selected, produce a treatment or script spine.
- Prefer believable, stakeholder-ready concepts over spectacle.
- Preserve Mood Weaver's visual world; do not invent a conflicting moodboard.
- Story Weaver owns script spine, not final storyboard panels.
- Scene Weaver owns storyboard and shot plan.
- Do not choose for the user unless asked; recommend clearly.
- Do not proceed from Strategy Gate to Scene Weaver until the combined strategy/mood/story packet is approved, unless the team/client replies `AUTOPILOT` or explicitly says to continue without review.
- If the team or the creative lead corrects the output, convert the correction into a reusable learning record and update the relevant directive, template, retrieval map, or skill when the behavior should change next time.
- If a client corrects the output, update that client's feedback log, pattern ledger, or style profile before changing global Anansi rules.
- Do not treat learning as silent memory. File the lesson or update the governing instruction that future agents will read.
