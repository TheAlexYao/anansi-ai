---
name: anansi-final-cut
description: Use when assembling approved Anansi clips into final videos, cutdowns, captions, audio passes, overlays, export files, or edit decision lists; integrates browser-use/video-use when raw footage or rendered clips need ffmpeg-backed editing, subtitles, grading, verification, and final delivery.
---

# Anansi Final Cut

Use this skill after Runway Render has produced selected clips, approved variants, final-frame references, or an output log. In long or Telegram runs, read `runway/Runway Handoff.md` first and only open the full render package if a specific detail is missing. Final Cut owns assembly, edit rhythm, audio, subtitles, overlays, cutdowns, export specs, verification, and final filing.

Reliability rule: in Telegram/end-to-end runs, this skill owns only the Final Cut stage for the current turn. Read the Runway handoff, produce HyperFrames/final artifacts and `final/Final Handoff.md`, update `project.json`, attach final review/export artifacts, then stop for the Render Gate. Do not reload upstream stage skills in the teame turn. Before HyperFrames/export work, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-session-hygiene-proactive.sh --quiet`; keep stdout private and stop after one bounded render/export pass.

For the reasoning sequence, read `02 Extracted Patterns/Final Cut Thinking Model.md`.

For retrieval routing, read `11 Retrieval Maps/Final Cut Obsidian Retrieval Map.md`.

For video-use execution details, read `references/video-use-integration.md`.

For HyperFrames composition details, read `references/hyperframes-integration.md`.

HyperFrames is required for Anansi final assembly. video-use/ffmpeg may prepare, trim, concatenate, grade, or inspect clips, but the reviewable final cut must be expressed through a HyperFrames project/composition so captions, title cards, overlays, wrappers, safe zones, and export variants remain agent-editable. A video-use-only or ffmpeg-only export is a helper artifact, not a completed Anansi Render Gate artifact.

Telegram delivery rule: never send the Render Gate by hand if the project lacks `edit/hyperframes/`. After producing the HyperFrames composition and preview/export/proof artifact, run `{{ANANSI_AGENT_HOME}}/scripts/anansi-feedback-message.sh PROJECT_SLUG --gate render`. If the helper reports that HyperFrames or final artifacts are missing, fix that before asking for Render approval.

For delivery output, use `templates/final-cut-output-template.md`.

For learning from feedback, corrections, failed exports, successful cuts, and missed expectations, read `references/learning-protocol.md` and `16 Learning and Creative Cycles/Agent Learning Protocol.md`.

## Required Reads

1. `Anansi Agent Startup Map.md`
2. `03 Workflows/Anansi Human Approval Gates.md`
2a. `22 Local Style Memory/Local Style Memory Index.md` when a client, brand, organization, venue, recurring project, or client feedback is named.
2b. `03 Workflows/Telegram Artifact Delivery.md` when the active channel is Telegram.
2c. `03 Workflows/Runtime Context Budget.md` when running through Telegram or continuing a long project.
2d. `03 Workflows/Client Materials Intake and Use Rule.md` when the project includes client images, PDFs, decks, scripts, references, assets, links, footage, or prior approvals.
2e. `03 Workflows/Anansi Reliability and Stage Isolation.md` when running end-to-end, through Telegram, or after a compression/session failure.
3. `11 Retrieval Maps/Final Cut Obsidian Retrieval Map.md`
3. `02 Extracted Patterns/Final Cut Thinking Model.md`
4. `12 the creative lead Creative Director/Approval Rubric.md`
5. `12 the creative lead Creative Director/Scene Judgment Rules.md`
6. `09 Asset Index/Runway Output Log.md`
7. `09 Asset Index/Final Frame References.md`
8. `03 Workflows/Runway Continuity Workflows.md`
9. `10 Rubrics/Runway Output Quality Rubric.md`
9a. `10 Rubrics/Lifelike Render Gate.md` before accepting final edits involving hands, pages, faces, instruments, fabric, text, object contact, or reveals.
10. `17 Viral Video Playbook/Platform Native Specs and Safe Zones.md` when making TikTok, Reels, Shorts, vertical, square, or cutdown outputs.
11. `17 Viral Video Playbook/Sound Captions and Audio Strategy.md` when captions, subtitles, voice, music, or mute comprehension matter.
12. `18 Brand Video Effectiveness/Length and Format Strategy.md` when choosing 6s, 15s, 30s, 60s, or long-form cuts.
13. `18 Brand Video Effectiveness/Brand Video Effectiveness Scorecard.md` when judging final brand usefulness.
14. `16 Learning and Creative Cycles/Agent Learning Protocol.md` when the team or the creative lead corrects an edit, pacing, caption, audio, continuity, or export decision.
15. `01 Source Library/HyperFrames Source Note.md`
16. `03 Workflows/HyperFrames Final Cut Workflow.md`
17. `20 Final Cut Systems/HyperFrames Composition Decision Matrix.md`
18. `20 Final Cut Systems/Edit Rhythm and EDL Intelligence.md`
19. `20 Final Cut Systems/Subtitle and Caption Intelligence.md` when captions, subtitles, or mute comprehension matter.
20. `20 Final Cut Systems/Overlay Title Card CTA Rules.md` when titles, CTAs, lower thirds, or overlays appear.
21. `20 Final Cut Systems/Export and Delivery Specs.md`
22. `22 Typography Systems/Typography Systems Index.md` when the composition contains any rendered text.
23. `22 Typography Systems/HyperFrames Typography Implementation Rules.md` when the composition contains any rendered text.
24. `23 Social Title Placement/Social Title Placement Index.md` when making social, vertical, captioned, or title-bearing outputs.
25. `23 Social Title Placement/Platform Safe Zones for Titles.md` when titles/captions/CTAs appear.
26. `23 Social Title Placement/HyperFrames Social Title Layout Rules.md` for HyperFrames social compositions.
27. `23 Social Title Placement/Titles Captions CTAs and Lower Third Collision Rules.md` before final text placement.

## Job

Turn approved Anansi clips into finished cuts.

Final Cut owns:

- assembly strategy
- edit decision lists
- clip ordering and timing
- cutdowns and platform variants
- captions and subtitle style
- audio, fades, music, sound design notes, and mute comprehension
- overlays, title cards, lower thirds, and final CTA cards
- color/grade consistency
- export specs
- render verification
- final filing and learning

Final Cut does not own:

- client strategy
- moodboard / visual world
- story direction or script spine
- storyboard or shot plan
- Runway generation payloads

Those belong to Brief, Mood, Story, Scene Weaver, and Runway Render.

## Modes

Choose one mode before output:

- **Assembly Plan:** inspect selected clips and propose order, length, rhythm, audio, captions, overlays, and export specs.
- **Edit Decision List:** produce an EDL with source clips, in/out ranges, beats, transitions, captions, grade, overlays, and total runtime.
- **Final Render:** execute or specify final assembly, verify the output, and produce final delivery files.
- **Cutdowns:** derive 6s, 15s, 30s, 60s, 9:16, 16:9, 1:1, or 4:5 variants from the approved cut.
- **Caption / Subtitle Pass:** create or revise captions, subtitle timing, safe-zone placement, and muted-viewing comprehension.
- **Audio / SFX Pass:** specify voiceover, music, ambience, fades, silence, sound design, and mix notes.
- **Overlay / Title Pass:** design title cards, lower thirds, typographic overlays, or minimal CTA treatments.
- **HyperFrames Composition:** create or specify an HTML/CSS/JS composition for title cards, caption systems, designed overlays, animated typography, clip wrappers, and renderable final layouts.
- **Output Evaluation:** score a rendered cut and identify revision needs.
- **Filing / Learning:** log final files, export notes, selected cut decisions, client feedback, and reusable lessons.

## Thinking Directives

Use `02 Extracted Patterns/Final Cut Thinking Model.md` whenever planning, assembling, or evaluating a final edit.

1. **Start from approved material.** Do not invent new scenes when the task is assembly.
2. **Read the story spine and scene plan before cutting.** The edit should preserve the intended emotional progression.
3. **Protect the mood locks.** Light behavior, pacing, palette, silence, tactility, and the creative lead-specific taste rules must survive the edit.
3a. **Protect client memory.** For known clients, preserve stable pacing, caption, CTA, title-card, overlay, rhythm, and export preferences.
3b. **Protect client materials.** Before assembly, confirm the provided client materials and stage handoffs were consulted. The edit should preserve client-provided scripts, imagery, event facts, performance context, approved references, visual anchors, and mandatories before using generic pacing or templates.
4. **One cut has one job.** Every edit must clarify rhythm, story, product desire, platform comprehension, or emotional release.
4a. **Never cut before a reveal resolves.** Do not transition away during a page turn, door opening, curtain movement, threshold reveal, product reveal, transformation, or proof action before the revealed information has landed. Hold through anticipation, action, result, and a brief comprehension beat.
5. **Audio is structural.** Silence, breath, music, VO, ambience, and fades shape belief as much as image order.
6. **Captions are first-class.** For social outputs, muted comprehension is mandatory; captions must sit inside platform-safe zones.
7. **Use video-use when footage exists.** For real clip assembly, use browser-use/video-use or its installed helper scripts rather than handwaving the edit.
8. **Always use HyperFrames for final assembly.** Every Anansi final cut must create or update a HyperFrames composition project. HyperFrames is the canonical review/export layer for title cards, captions, lower thirds, product/brand wraps, timing boards, safe zones, variants, and renderable previews. It does not replace Runway; it assembles and designs around approved clips. Do not mark Render Gate complete without a HyperFrames composition and preview/export/proof artifact.
8a. **Use Obsidian before composing.** Before building the HyperFrames plan, read the Final Cut Obsidian Retrieval Map plus the relevant notes from `20 Final Cut Systems/`, `22 Typography Systems/`, and `23 Social Title Placement/`. Do not assemble from memory alone.
9. **Ask for strategy approval before destructive editing.** Propose the cut plan in plain English before rendering or overwriting files.
10. **Verify before showing.** Check duration, cut boundaries, audio pops, subtitle visibility, overlay alignment, grade consistency, and export dimensions.
11. **File final decisions.** The edit is not complete until output paths, versions, cutdowns, and lessons are logged.
12. **Complete the Render Gate.** After producing an assembly plan, EDL, preview, HyperFrames composition, or export, use decision-first copy: `Review: Render`, `Decision: keep or revise the cut`, `Check: reveal timing, HyperFrames/captions, CTA`, then `APPROVE | REVISE: ... | AUTOPILOT | PAUSE`. Wait for approval before marking final.
13. **File client edit feedback.** If a client corrects the cut, captions, overlays, CTA, pacing, or export, update that client's feedback log and pattern ledger before treating it as a global edit rule.
14. **Attach final outputs in Telegram.** When working through Telegram, attach preview/final exports and any caption/title/overlay proof images or PDFs with `MEDIA:` delivery. Do not only point the team to the final folder.
15. **Write a compact handoff.** Save `final/Final Handoff.md` with final exports, cut decisions, caption/audio/overlay choices, revision requests, open risks, and filed learning. Do not paste full EDLs or export logs into Telegram unless the team asks.
16. **Filter tool output.** Do not paste ffmpeg/video-use/HyperFrames stdout, successful render logs, or background process completion dumps into Telegram. Summarize the finished exports and attach the review files.
17. **Telegram is not the edit report.** Render Gate copy must be concise: decision, three checks, attachments. Do not list every source file, local path, FPS/duration, clip-by-clip creative read, or full evaluation unless the team asks. Store detail in the EDL, evaluation, and `final/Final Handoff.md`.

## browser-use/video-use Integration

Use video-use as the local editing engine when the user provides raw footage, Runway clips, narration takes, performance captures, interviews, music clips, or rendered assets that need assembly.

Video-use is appropriate for:

- ffmpeg-backed clip extraction and concatenation
- transcript-driven editing
- subtitle burn-in
- audio fades at cut boundaries
- color grading
- overlay animation rendering
- cut-boundary self-evaluation
- final `mp4` delivery

Do not use video-use to decide Anansi strategy, mood, story, storyboard, or Runway payloads. Use it after those decisions exist.

## HyperFrames Integration

Use HyperFrames as the required composition/rendering layer for every Anansi final assembly.

Before placing any captions, title cards, overlays, lower thirds, CTA, brand marks, or social-safe text, read the relevant notes in `22 Typography Systems/` and `23 Social Title Placement/`.

HyperFrames is appropriate for:

- canonical Anansi final preview/export composition
- HTML/CSS/JS video compositions
- animated title cards, overlays, lower thirds, and CTA cards
- caption systems and kinetic typography
- product-promo layouts, editorial wrappers, and branded motion systems
- browser preview loops before final render
- renderable MP4 compositions driven by agent-edited files

Use video-use/ffmpeg as helper execution layers for trimming, concatenation, transcript-driven cuts, grading, proxies, audio preparation, and fixed transcodes. Even when the edit is simple, wrap the approved clip sequence in a minimal HyperFrames composition before presenting the final review/export.

If HyperFrames setup is missing or rendering fails, stop and report the HyperFrames blocker. Do not silently fall back to a non-HyperFrames final unless the team explicitly overrides this requirement.

HyperFrames setup expects Node.js 22+, npm/npx, and ffmpeg. Use:

- setup check: `{{ANANSI_AGENT_HOME}}/scripts/setup-hyperframes.sh`
- project scaffold: `{{ANANSI_AGENT_HOME}}/scripts/anansi-hyperframes-init.sh PROJECT_SLUG`

Write HyperFrames outputs under:

`{{ANANSI_PROJECTS_DIR}}/PROJECT_SLUG/edit/hyperframes/`

Do not use HyperFrames to invent new scenes, story, or Runway payloads. It receives the approved Final Cut EDL, selected clips, captions, overlays, and export specs.

## Output Contract

```md
## Final Cut Mode
- Mode:
- Source material:
- Target outputs:

## Client Memory Notes
- Client materials consulted:
- Client material anchors preserved:
- Missing client materials / assumptions:
- Client profile consulted:
- Prior client edit patterns preserved:
- Prior client rejection patterns avoided:
- New feedback to file:

## Assembly Strategy
- Spine:
- Runtime:
- Rhythm:
- Clip order:
- Audio approach:
- Caption approach:
- Overlay/title approach:
- Composition backend: HyperFrames required; video-use/ffmpeg helpers if used
- HyperFrames plan:
- Grade approach:
- Platform/safe-zone notes:

## EDL
| Beat | Source | In | Out | Duration | Action | Audio | Caption/Overlay | Reason |
|---|---|---:|---:|---:|---|---|---|---|

## Export Plan
- Master:
- Cutdowns:
- Aspect ratios:
- FPS/resolution:
- File naming:
- Output folder:
- HyperFrames project:

## Verification
- Duration:
- Cut boundaries:
- Reveal completion:
- Lifelike physical realism:
- Audio fades:
- Subtitle visibility:
- Overlay alignment:
- HyperFrames render:
- Grade consistency:
- Safe zones:
- First/last frame:

## Filing Recommendation
- Final file:
- Preview file:
- EDL:
- Output log:
- Public-safe distillation:
- Private notes:

## Learning Loop
- Trigger:
- Reusable lesson:
- Rule/template/retrieval update:
- Files or notes updated:
- Public-safe:
```

## Rules

- Never expose API keys, `.env` values, raw signed URLs, account screenshots, confidential client assets, or unsanitized output logs.
- Do not overwrite source footage or approved Runway clips. Write outputs into an `edit/`, `final/`, or clearly versioned output folder.
- Do not overwrite source footage, selected clips, or final exports without approval. Within an approved Render Gate, assemble previews without asking for a separate Runway-to-Final-Cut approval.
- For browser-use/video-use, keep all session outputs in the footage folder's `edit/` directory.
- Use 30ms audio fades at cut boundaries when editing with video-use.
- Do not cut off a reveal at the point of anticipation. If a clip begins a reveal but fails to show the result, either extend the shot, request a revised clip, or remove the setup.
- Reject final edits where a familiar physical action gives away AI, especially page turns, hands, instruments, faces, fabric, object contact, text, or material movement.
- Subtitles should be applied last in the render chain.
- Snap transcript-driven cuts to word boundaries.
- Use platform-native variants; do not treat every cutdown as a crop of the master.
- Keep final CTA/title cards sparse and tasteful.
- If the team or the creative lead corrects the output, convert the correction into a reusable learning record and update the relevant directive, template, retrieval map, or skill when future behavior should change.
