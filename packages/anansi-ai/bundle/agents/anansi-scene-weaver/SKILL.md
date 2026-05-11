---
name: anansi-scene-weaver
description: Use when translating a chosen Anansi story direction and Mood Weaver visual system into a storyboard, 3-4 scenes, shot options, camera movement, continuity notes, Runway prompt seeds, and the creative lead-informed scene judgment.
---

# Anansi Scene Weaver

Use this skill after a story direction is selected or recommended. In long or Telegram runs, read `story/Story Handoff.md` first and only open the full story package if a specific detail is missing.

Reliability rule: in Telegram/end-to-end runs, this skill owns the Previsualization stage: storyboard plus scene plan plus keyframes. After Strategy Gate approval, do not perform storyboard/keyframe work as many separate model/tool steps. Write or update the compact scene handoff, then run the one-command batch script:

`{{ANANSI_AGENT_HOME}}/scripts/anansi-previsualization-stage.sh PROJECT_SLUG`

That script creates or verifies `storyboard/storyboard.png`, prepares keyframe prompts, generates the keyframes, creates a keyframe contact sheet, updates `project.json`, and prints attachment-ready `MEDIA:` lines. Do not load downstream stage skills in the teame turn. Do not narrate every created file. The Previsualization stage is not complete until a real storyboard image and the local scene keyframes exist. A keyframe contact sheet alone does not count.

Telegram delivery rule: never send the Previsualization Gate by hand. After previsualization artifacts exist, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-feedback-message.sh PROJECT_SLUG --gate previsualization`. If the helper reports that storyboard or keyframe images are missing, generate them before asking for approval.

Hard gate: Scene Weaver must not create a storyboard until Story Weaver has shown the selected/proposed story direction and the Strategy Gate is approved, or the team has explicitly replied `AUTOPILOT`. If `story/Story Handoff.md` is missing, does not name a story direction/arc, or `project.json` does not show `strategy-review` as `approved`/`complete`, stop and ask for Strategy Gate approval instead of generating panels.

For storyboard generation, read `references/storyboard-generation-playbook.md` and use `templates/storyboard-output-template.md`.

For learning from feedback, corrections, references, tests, and missed expectations, read `references/learning-protocol.md` and `16 Learning and Creative Cycles/Agent Learning Protocol.md`.

## Required Reads

1. `Anansi Agent Startup Map.md`
2. `03 Workflows/Anansi Human Approval Gates.md`
2a. `22 Local Style Memory/Local Style Memory Index.md` when a client, brand, organization, venue, recurring project, or client feedback is named.
2b. `03 Workflows/Telegram Artifact Delivery.md` when the active channel is Telegram.
2c. `03 Workflows/Runtime Context Budget.md` when running through Telegram or continuing a long project.
2d. `03 Workflows/Client Materials Intake and Use Rule.md` when the project includes client images, PDFs, decks, scripts, references, assets, links, footage, or prior approvals.
2e. `03 Workflows/Anansi Reliability and Stage Isolation.md` when running end-to-end, through Telegram, or after a compression/session failure.
3. `12 the creative lead Creative Director/Scene Judgment Rules.md`
4. `12 the creative lead Creative Director/Prompt Revision Rules.md`
4. `14 Story Arcs/Visual Short Film Arcs.md`
5. `15 Characters and Motifs/Visual Character Functions.md`
6. `15 Characters and Motifs/Motif Library.md`
7. `11 Retrieval Maps/Scene Type Trigger Map.md`
8. `11 Retrieval Maps/Camera Strategy Map.md`
9. `11 Retrieval Maps/Scene Weaver Obsidian Retrieval Map.md`
10. `19 Mood Systems/Storyboard Prompting Directive.md` when creating a storyboard, shot plan, previsualization board, animatic plan, commercial sequence, or director's visual treatment.
11. `11 Retrieval Maps/Mood Weaver Obsidian Retrieval Map.md` when consuming Mood Weaver's visual world, palette, material, light, or camera constraints.
12. `17 Viral Video Playbook/Platform Native Specs and Safe Zones.md` when the scene is for TikTok, Reels, Shorts, paid social, or vertical social.
13. `17 Viral Video Playbook/Hook Architecture.md` when planning the first scene/opening beat.
14. `02 Extracted Patterns/Image-to-Video Prompting.md` or `02 Extracted Patterns/Text-to-Video Prompting.md`
15. `16 Learning and Creative Cycles/Agent Learning Protocol.md` when the user corrects the agent, an output fails/succeeds, or a reusable scene/shot/storyboard lesson appears.
16. `10 Rubrics/Lifelike Render Gate.md` before approving keyframes or storyboard beats involving hands, pages, faces, instruments, fabric, text, object contact, or physical reveals.

## Output

```md
## the creative lead Lens Notes
- Scene principle:
- Approval risks:
- Avoid:

## Retrieval Notes
- Client materials consulted:
- Client materials translated into scene constraints:
- Missing client materials / assumptions:
- Client memory used:
- Prior client patterns preserved:
- Prior client rejection patterns avoided:
- Scene triggers:
- Camera strategy:
- Prompt strategy cards:

## Story / Motif Notes
- Strategy approval status:
- Story direction:
- Selected arc:
- Protagonist function:
- Continuity motif:
- Transformation motif:
- Why this arc is effective:

## Mood System Inputs
- Visual world:
- Palette:
- Material rules:
- Light rules:
- Camera feeling:
- Avoid rules from Mood Weaver:

## Storyboard Prompt Set
- Storyboard or moodboard:
- Recommended panel count:
- Grid format:
- Visual style:
- Story arc:
- Continuity rule:
- Timing rhythm:
- Camera language:
- Text / VO rule:
- One-action-per-panel rule:
- Panel breakdown:
- Image-model storyboard prompt:
- Storyboard negative constraints:

## Keyframe Gate
- Project slug:
- Keyframe packet path:
- Prompt files path:
- Image save path:
- Backend check:
- Automatic generation available:
- Manual generation instruction:
- Missing approved stills:
- Runway permission:

## Viral / Platform Notes
- Aspect ratio:
- Safe-zone constraints:
- First-frame stop power:
- Caption placement:
- Retention beat cadence:

## Scene Plan
### Scene 1
- Purpose:
- Duration:
- Option A:
- Option B:
- the creative lead judgment:
- Continuity instruction:

### Scene 2
- Purpose:
- Duration:
- Option A:
- Option B:
- the creative lead judgment:
- Continuity instruction:

### Scene 3
- Purpose:
- Duration:
- Option A:
- Option B:
- the creative lead judgment:
- Continuity instruction:

## Filing Recommendation
- Classification:
- Public-safe:
- Recommended vault path:

## Learning Loop
- Trigger:
- Reusable lesson:
- Rule/template/retrieval update:
- Files or notes updated:
- Next test:
- Public-safe:
```

## Rules

- Refuse invisible story approvals. Before storyboard generation, verify the approved/proposed Story Weaver direction is visible in `story/Story Handoff.md` and `project.json` shows `strategy-review` as `approved` or `complete`, unless the team explicitly says `AUTOPILOT`.
- If story approval is missing, do not improvise a storyboard. Present the compact Strategy Gate review and attach the brief/mood/story artifacts.
- Use one main camera move per option.
- Make every scene advance the emotional arc.
- State what must remain stable between scenes.
- Carry at least one continuity motif across the sequence.
- Include likely failure modes when the option asks Runway to invent details.
- If the user asks for a storyboard, shot plan, panels, previsualization, animatic, or visual sequence, state explicitly: `Create a storyboard, not a mood board.`
- Storyboards must be generated from the selected Story Weaver direction and Mood Weaver visual system. Do not invent a new story or visual world unless asked.
- Storyboards must preserve the narrated story arc from Story Weaver. Each panel should serve the approved arc, not simply produce attractive shots.
- Storyboards for known clients must preserve stable client style rules and avoid known client rejection patterns.
- Storyboards must use numbered panels arranged left to right and top to bottom, with clear shot progression.
- Scene Weaver must generate an image storyboard when image generation is available. Use Hermes GPT Image 2 / Codex OAuth unless the team chooses another backend. The required command is:
  `{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-storyboard-hermes.sh PROJECT_SLUG`.
- In Telegram, prefer the full previsualization batch command over individual storyboard/keyframe commands:
  `{{ANANSI_AGENT_HOME}}/scripts/anansi-previsualization-stage.sh PROJECT_SLUG`.
  This prevents Hermes from exhausting the live iteration budget between storyboard and keyframes.
- Before generating keyframes, run the storyboard gate:
  `{{ANANSI_AGENT_HOME}}/scripts/anansi-storyboard-gate.sh PROJECT_SLUG --status`.
- Do not proceed to keyframes if the storyboard gate says the storyboard image is missing. The keyframe gate will now block when `storyboard/storyboard.png` is missing.
- A keyframe contact sheet, previsualization contact sheet, or batch of scene stills is not a storyboard.
- Scene Weaver must use client-provided materials at the storyboard and keyframe stage. If the client supplied images, scripts, venue/performance materials, product references, brand assets, or prior approvals, the scene plan must state how those materials affect subject matter, palette, performance context, typography/text handling, props, setting, and avoid rules.
- In Telegram, attach the generated storyboard image to the review message with `MEDIA:` delivery. Use `[[as_document]]` for text-heavy storyboards.
- Storyboards must specify panel count and grid format: 6-panel, 8-panel, 9-panel, 12-panel, 3x2, 4x2, 3x3, vertical social, or widescreen.
- For a 20-30 second commercial, default to an 8-panel 4x2 storyboard unless the user specifies otherwise.
- Every storyboard panel must show one clear action or beat only.
- Reveal beats must be protected. If a panel includes a page turn, door opening, curtain movement, threshold reveal, product reveal, transformation, or proof moment, the next panel or edit note must show the revealed result. Do not end the beat at the instant before the reveal.
- For page turns, book handling, instrument playing, hand gestures, object contact, fabric movement, faces, and other familiar physical actions, include a lifelike realism watch in the panel and keyframe prompt. Avoid malformed hands, rubbery pages, impossible hinges, unreadable/morphing text, floating contact points, and warped material behavior.
- If a client corrects the storyboard or keyframes, file the feedback in that client's style memory before treating it as a global scene rule.
- Every storyboard panel must include timing, shot size, camera/framing, movement, action, continuity, VO/caption/sound cue, emotional beat, transition, avoid rule, and prompt fragment.
- Storyboard prompts must maintain continuity across all panels: teame subject, motivated environment changes, teame lighting system, teame cinematic tone, and consistent product/character/architecture logic.
- Storyboard visual style should be explicit: professional black-and-white pencil-and-ink storyboard, polished grayscale commercial storyboard, color cinematic storyboard, animatic style, or comic-like storyboard.
- Storyboard negative constraints must reject mood-board collage, unrelated reference tiles, decorative swatches, posters, character sheets, concept-art splash pages, single-scene illustrations, chaotic layout, excessive text, and inconsistent subject design.
- If the team or the creative lead corrects the output, convert the correction into a reusable learning record and update the relevant directive, template, retrieval map, or skill when the behavior should change next time.
- Do not treat learning as silent memory. File the lesson or update the governing instruction that future agents will read.
- After the storyboard image exists, write keyframe prompts and run the keyframe gate script for the project slug:
  `{{ANANSI_AGENT_HOME}}/scripts/anansi-keyframe-gate.sh PROJECT_SLUG`.
- Prefer Hermes native GPT Image 2 keyframe generation through ChatGPT/Codex OAuth:
  `{{ANANSI_AGENT_HOME}}/scripts/anansi-generate-keyframes-hermes.sh PROJECT_SLUG`.
- Generate the scene keyframes as a batch after the storyboard prompt/scene plan is internally coherent. Do not stop for separate storyboard approval during normal end-to-end generation. For early technical smoke tests, `--scene scene-01` is allowed, but the client review gate should show the full batch.
- In Telegram, attach the full generated keyframe batch to the batch review message. Do not only point the team to the keyframes folder.
- Write `storyboard/Scene Handoff.md` with the approved/proposed storyboard decision, scene list, keyframe paths, continuity anchors, open revision risks, missing stills, and Runway Render input. Do not paste the full storyboard packet or every keyframe prompt into Telegram.
- Do not paste keyframe script stdout, `OK scene-xx` lists, or background process completion dumps into Telegram. Summarize as counts: `Generated 4 keyframes; all required stills are present.` List only missing or failed scene ids.
- If an iteration budget warning appears during Scene Weaver, do not answer with a long completed-files summary. Run the previsualization batch script if it has not run; otherwise send only the compact Previsualization Gate message with attachments.
- Include `Obsidian Context Used` in `storyboard/Scene Handoff.md` with 3-6 note names and applied rules. Keep that retrieval trace out of Telegram unless the team asks.
- This preferred path does not require an OpenAI API key or FAL key. If it fails, check Hermes update status, Codex auth, and `image_gen.provider: openai-codex`.
- Use OpenAI API mode or FAL only if the team explicitly chooses that backend.
- Treat storyboard plus keyframes as one Previsualization Gate. Runway Render must wait until the local approved stills exist.
- After storyboard and keyframe batch generation, use decision-first Previsualization Gate copy: `Review: Previsualization`, `Decision: approve stills before Runway`, `Check: scene order, realism/AI tells, client-material accuracy`, then `APPROVE | REVISE: scene-02 warmer; scene-04 fix hand | PAUSE`.
