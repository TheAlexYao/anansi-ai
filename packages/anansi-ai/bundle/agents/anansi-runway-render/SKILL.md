---
name: anansi-runway-render
description: Use when turning Scene Weaver handoffs into Runway-ready payloads, choosing model routes, simplifying prompts, evaluating outputs, revising render attempts, filing final frames, and preserving continuity for Anansi projects.
---

# Anansi Runway Render

Use this skill after Scene Weaver has produced a storyboard, shot sequence, scene plan, or Runway-facing scene options. In long or Telegram runs, read `storyboard/Scene Handoff.md` first and only open the full scene package if a specific detail is missing. Runway Render owns the last mile: generation mode, model route, payload fields, prompt simplification, continuity contracts, output evaluation, revision payloads, and render filing.

Reliability rule: in Telegram/end-to-end runs, this skill owns only the Runway stage for the current turn. Read the scene/keyframe handoff, prepare or confirm compact payloads, then run `{{ANANSI_AGENT_HOME}}/scripts/anansi-runway-stage.sh PROJECT_SLUG` as the single render action. That script checks keyframes, renders/resumes clips, writes `runway/Runway Handoff.md`, updates `project.json`, and prints attachment-ready `MEDIA:` lines. Do not load downstream stage skills in the teame turn. Before any paid/render batch, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-session-hygiene-proactive.sh --quiet`; never keep polling in the teame Telegram turn after one bounded pass.

Telegram delivery rule: never send a Runway batch-started, background-process, pid/task-id, or polling summary by hand. Do not launch Runway as a background process from Telegram. Use `anansi-runway-stage.sh PROJECT_SLUG` to run/resume, or `anansi-runway-stage.sh PROJECT_SLUG --status` to check. If Hermes emits `Iteration budget exhausted`, do not summarize completed files; run the status helper if tools are available, otherwise send only `Continuing from checkpoint. No action needed from you.`

For the reasoning sequence, read `02 Extracted Patterns/Runway Render Thinking Model.md`.

For retrieval routing, read `11 Retrieval Maps/Runway Render Obsidian Retrieval Map.md`.

For payload output, use `templates/runway-payload-template.md`.

For evaluation output, use `templates/runway-evaluation-template.md`.

For learning from feedback, corrections, references, render tests, and missed expectations, read `references/learning-protocol.md` and `16 Learning and Creative Cycles/Agent Learning Protocol.md`.

## Required Reads

1. `Anansi Agent Startup Map.md`
2. `03 Workflows/Anansi Human Approval Gates.md`
2a. `22 Local Style Memory/Local Style Memory Index.md` when a client, brand, organization, venue, recurring project, or client feedback is named.
2b. `03 Workflows/Telegram Artifact Delivery.md` when the active channel is Telegram.
2c. `03 Workflows/Runtime Context Budget.md` when running through Telegram or continuing a long project.
2d. `03 Workflows/Client Materials Intake and Use Rule.md` when the project includes client images, PDFs, decks, scripts, references, assets, links, footage, or prior approvals.
2e. `03 Workflows/Anansi Reliability and Stage Isolation.md` when running end-to-end, through Telegram, or after a compression/session failure.
3. `11 Retrieval Maps/Runway Render Obsidian Retrieval Map.md`
3. `02 Extracted Patterns/Runway Render Thinking Model.md`
4. `12 the creative lead Creative Director/Approval Rubric.md`
5. `12 the creative lead Creative Director/Prompt Revision Rules.md`
6. `01 Source Library/Runway Official 2026 Generation Context.md`
7. `01 Source Library/Runway API Docs - Generation Payload Context.md`
8. `02 Extracted Patterns/Runway Model Routing Matrix.md`
9. `01 Source Library/Runway Gen-4 Video Prompting - Current Source Note.md`
10. `01 Source Library/Runway Image to Video Prompting - Motion First Source Note.md` when preparing image-to-video.
11. `01 Source Library/Runway Aleph Prompting - Video Edit Source Note.md` when editing, relighting, extending, predicting next shot, or changing camera angle from existing video.
12. `01 Source Library/Runway Act-Two - Performance Capture Source Note.md` when a driving performance/video controls a character.
13. `01 Source Library/Runway Gen-4 Image Prompting - Frames Source Note.md` when generating keyframes or still references.
14. `02 Extracted Patterns/Gen-4 Video Prompting Rules.md`
15. `02 Extracted Patterns/Reference Images and Continuity.md`
16. `03 Workflows/Runway Continuity Workflows.md`
17. `03 Workflows/Runway API Skills and Agent Integration.md` when API execution, polling, download, org details, or integration is involved.
18. `10 Rubrics/Runway Output Quality Rubric.md`
18a. `10 Rubrics/Lifelike Render Gate.md` before accepting keyframes, Runway clips, or scene actions involving hands, pages, faces, instruments, fabric, text, object contact, or reveals.
19. `16 Learning and Creative Cycles/Anansi Iteration Loop.md` when evaluating or filing a test.
20. `17 Viral Video Playbook/Viral Video Evaluation Rubric.md` when the output is meant for TikTok, Reels, Shorts, YouTube, UGC, paid social, or growth.
21. `18 Brand Video Effectiveness/Brand Video Effectiveness Scorecard.md` when evaluating brand-building, performance, B2B/founder, or paid brand assets.
22. `16 Learning and Creative Cycles/Agent Learning Protocol.md` when the user corrects the agent, an output fails/succeeds, or a reusable Runway/prompt/revision lesson appears.

## Job

Turn Scene Weaver handoffs into disciplined Runway plans and payloads.

Runway Render owns:

- generation mode selection
- model routing
- payload construction
- prompt simplification
- input asset/reference/final-frame decisions
- continuity contracts
- output evaluation
- revision payloads
- render filing and learning

Runway Render does not own:

- client strategy
- moodboard / visual world
- story direction or script spine
- storyboard or shot plan
- generating missing keyframes when no image backend is configured

Those belong to Brief, Mood, Story, and Scene Weaver.

## Modes

Choose one mode before output:

- **Payload Planning:** choose generation mode, model route, input asset needs, continuity chain, and risks.
- **Single Scene Payload:** prepare one Runway-ready payload.
- **Batch Scene Payloads:** prepare one payload per scene with generation order and continuity dependencies.
- **Aleph Edit / Continuity:** prepare video-edit, relight, restyle, remove, replace, extend, predict-next, or alternate-camera payload.
- **Output Evaluation:** score renders and decide keep/revise/reject.
- **Revision Payload:** convert feedback into the next payload while changing one major variable at a time.
- **Filing / Learning:** log outputs, selected final frames, reusable lessons, client feedback, and public/private status.

## Thinking Directives

Use `02 Extracted Patterns/Runway Render Thinking Model.md` whenever creating or evaluating payloads.

1. **Route before prompting.** Choose modality and model before writing prompt text.
2. **Use official Runway docs first.** Model routing and modality behavior come from official Runway notes before third-party examples.
3. **One scene, one motion, one camera idea.** Do not ask one Runway clip to carry a whole film.
4. **For image-to-video, prompt motion.** Let the image carry subject, style, composition, palette, and lighting.
5. **For text-to-video, establish only what the model lacks.** Subject, setting, style, one action, one camera idea, and essential atmosphere.
6. **For Aleph, use edit verbs and preservation clauses.** Name what changes and what stays unchanged.
7. **Continuity is a contract.** Preserve subject identity, product/architecture geometry, palette, light behavior, materials, camera language, and story beat when required.
7a. **Client memory is a render constraint.** For known clients, translate stable style rules and avoid patterns into prompt preservation clauses and failure watches.
7b. **Client materials are render anchors.** Before payload creation or output evaluation, confirm the provided client materials were consulted. Use them as reference anchors for subject, palette, setting, performance/event context, typography/text avoidance, props, product truth, and approved tone. If materials are missing, mark the payload as assumption-based or stop when the missing material affects accuracy.
8. **Evaluate before revising.** Identify failure mode and change one major variable at a time.
9. **File selected outputs.** Output logs and final-frame references are part of the render process, not cleanup.
10. **Protect secrets.** Never expose API keys, `.env`, signed URLs, account screenshots, or private output logs in public-safe notes.
11. **Verify keyframes before Runway.** For image-to-video, run the keyframe gate status check and stop if any local still is missing:
    `{{ANANSI_AGENT_HOME}}/scripts/anansi-keyframe-gate.sh PROJECT_SLUG --status`.
11a. **Run the lifelike render gate.** Before accepting keyframes or clips, inspect familiar physical actions and materials: hands, page turns, books, instruments, faces, fabric, object contact, shadows, reflections, text, architecture geometry, and props. Reject or rerender anything that visibly gives away AI, including rubbery pages, malformed fingers, morphing text, impossible contact, warped instruments, sliding surfaces, or material behavior that breaks physics.
12. **Use the Runway stage helper.** After payloads exist, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-runway-stage.sh PROJECT_SLUG` instead of manual folder creation, background processes, or polling. The helper owns keyframe verification, clip rendering/resume, `runway/Runway Handoff.md`, `project.json`, and compact `MEDIA:` output.
13. **Feed Final Cut, not the Render Gate.** After generating clips, evaluate them and hand off to Final Cut without a separate approval stop during normal end-to-end generation. Do not call a Runway-only completion message `Render Gate`. The Render Gate happens after Final Cut has prepared the HyperFrames composition/preview/export. Ask immediately only when a render failed, a paid rerender is needed, a selected clip would be overwritten, or no viable clip exists.
13a. **Attach render outputs in Telegram.** When working through Telegram, attach generated clips, preview files, or evaluation PDFs with `MEDIA:` delivery. Do not only point the team to the clips folder.
14. **Prepare assembly handoff.** Create or update the Final Cut handoff with selected clips, rough order, evaluation notes, continuity notes, and any clip-specific revision warnings. Final review happens once at the Render Gate after Final Cut has prepared the preview/export.
15. **Write a compact handoff.** Save `runway/Runway Handoff.md` with selected clip paths, rejected clips, continuity notes, render risks, payload files, open questions, and Final Cut input. Do not paste the full payload batch or raw render logs into Telegram.
16. **Filter tool output.** Do not paste successful Runway script stdout, job polling logs, raw signed URLs, or background process completion dumps into Telegram. Summarize as counts and decisions. Show only failed scene ids, missing files, auth/key blockers, rejected clips, or the next decision needed.
17. **Keep Telegram concise.** A successful Runway batch message should be one or two short lines plus attachments, for example: `Phase: Runway. Done: 4 clips rendered. Next: HyperFrames final assembly.` Do not list every file, duration, FPS, creative read, or clip-by-clip notes in Telegram; put those details in `runway/Runway Handoff.md` or an evaluation artifact.
18. **Prepare HyperFrames by default.** The Runway handoff must include selected clip paths, aspect-ratio issues, reveal-completion risks, caption/CTA implications, and a direct instruction for Final Cut to use HyperFrames with Obsidian notes from `20 Final Cut Systems/`, `22 Typography Systems/`, and `23 Social Title Placement/`.

## Payload Output

```json
{
  "scene_id": "",
  "mode": "single_scene_payload | batch_scene_payloads | aleph_edit | revision_payload",
  "modality": "image_to_video | text_to_video | video_edit | image | act_two",
  "model": "",
  "ratio": "9:16",
  "duration": "5s",
  "prompt_text": "",
  "prompt_image": "",
  "prompt_video": null,
  "references": [],
  "expected_output": "",
  "continuity_anchors": [],
  "client_memory_anchors": [],
  "client_material_anchors": [],
  "failure_watch": [],
  "fallback_asset": null,
  "status": "ready_for_runway"
}
```

## Payload Planning Output

```md
## Runway Render Plan
- Mode:
- Source scene plan:
- Generation order:
- Modality per scene:
- Model route per scene:
- Input assets needed:
- Continuity chain:
- Final-frame dependencies:
- Risk:

## Payloads
```

Each payload should use the JSON contract above.

## Aleph Edit Output

```json
{
  "scene_id": "",
  "mode": "aleph_edit",
  "modality": "video_edit",
  "model": "",
  "source_video": "",
  "reference_image": null,
  "edit_action": "relight | restyle | remove | replace | extend | predict_next | change_camera_angle",
  "prompt_text": "",
  "preserve": [],
  "change": [],
  "expected_output": "",
  "status": "ready_for_runway"
}
```

## Evaluation Output

```md
## Concrete Experience
- Source/prompt/output:

## Client Memory Notes
- Client materials consulted:
- Client material anchors preserved:
- Missing client materials / assumptions:
- Client profile consulted:
- Prior client render patterns preserved:
- Prior client rejection patterns avoided:
- New feedback to file:

## Reflective Observation
- What worked:
- What failed:
- the creative lead reaction:

## Abstract Conceptualization
- Reusable lesson:
- Pattern update:
- Failure mode:

## Active Experimentation
- Next test:
- Revised prompt/payload:

## the creative lead Evaluation
- Decision:
- Strongest element:
- What feels generic or false:
- Revision instruction:
- Demo path:

## Runway Score
- Prompt adherence:
- Believability:
- Lifelike physical realism:
- Cinematic quality:
- Continuity:
- Demo usefulness:

## Continuity Result
- Story beat preserved:
- Reveal/action completed on screen:
- Mood locks preserved:
- Subject/product/place identity preserved:
- Palette/material/light preserved:
- Camera language preserved:
- Breaks:
- Final frame usable:

## Viral Performance Notes
- Intended platform:
- Format:
- Frame-1 stop power:
- First-5-second chain:
- Share/save trigger:
- Muted comprehension:
- Authenticity:
- Platform-native risks:

## Brand Video Effectiveness
- Job:
- Audience stage:
- Primary metric:
- Required DBAs:
- First-5-second brand cue:
- Structure:
- Length:
- Score:
- Revision:

## Filing Recommendation
- Output log:
- Final frame reference:
- Prompt pattern update:
- Public-safe distillation:

## Final Cut / HyperFrames Handoff
- Selected clips:
- Aspect ratio / crop risks:
- Reveal timing risks:
- Caption/title/CTA needs:
- HyperFrames required: yes
- Obsidian final-cut notes to consult:

## Learning Loop
- Trigger:
- Reusable lesson:
- Rule/template/retrieval update:
- Files or notes updated:
- Next test:
- Public-safe:
```

## Rules

- Never expose API keys or `.env` values.
- Never expose raw signed URLs, account screenshots, private client assets, or unsanitized output logs in public-safe notes.
- Use the Runway Render Thinking Model as the reasoning ladder for payload and evaluation work.
- Never call Runway image-to-video from a placeholder path. The `prompt_image` must exist locally as an approved `keyframes/scene-xx.png`.
- If keyframes are missing, return a missing-file list and a keyframe packet path instead of trying to render.
- Never approve a clip where a reveal action is cut off before the result is visible. Extend, rerender, or mark the clip rejected.
- Never approve a lifelike action that visibly reads as AI. Common red flags include bad page turns, distorted hands, morphing book pages, warped instruments, floating contact points, impossible fabric, and unstable text.
- Route model and modality before writing prompt text.
- Use `gen4.5` as the default quality route when current official docs and project constraints allow.
- Use `gen4_turbo` for faster or lower-cost image-to-video iteration when appropriate.
- Use `gen4_aleph` for editing/continuity work on existing clips.
- For image-to-video, let the image carry subject, composition, lighting, and style; prompt motion and stability.
- For text-to-video, include only enough visual establishment to create the scene; stay single-scene.
- For Aleph, use an edit verb plus explicit preservation clauses.
- Avoid stuffing moodboard, story treatment, and storyboard prose into the prompt. Translate them into one action, one camera idea, and continuity anchors.
- Save continuity decisions as final-frame references when an output is selected.
- Evaluate every output before revising; change one major variable per revision when possible.
- If the team or the creative lead corrects the output, convert the correction into a reusable learning record and update the relevant directive, template, retrieval map, or skill when the behavior should change next time.
- Do not treat learning as silent memory. File the lesson or update the governing instruction that future agents will read.
