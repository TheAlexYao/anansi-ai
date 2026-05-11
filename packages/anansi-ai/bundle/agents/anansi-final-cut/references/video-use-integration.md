# video-use Integration

Source: https://github.com/browser-use/video-use

Use browser-use/video-use as Anansi's optional local editing and inspection helper. It is not a creative strategy agent, and it is not the final Anansi composition layer. HyperFrames remains required for the reviewable final assembly after clips exist.

## When To Use

Use video-use when the project has:

- raw footage
- Runway-rendered clips
- voiceover takes
- interview or talking-head footage
- performance captures
- montage material
- files that need trimming, ordering, subtitles, grading, overlays, or final `mp4` export

Do not use it for:

- brief creation
- moodboard generation
- story direction
- storyboard creation
- Runway prompt or payload design

## Setup Expectation

Video-use expects:

- the repo cloned somewhere stable
- `ffmpeg` and `ffprobe` on PATH
- Python dependencies installed with `uv sync` or `pip install -e .`
- optional `yt-dlp`
- Node/npm for required HyperFrames final assembly
- an ElevenLabs API key in the video-use repo `.env` when transcript/Scribe workflows are needed

Never expose or copy API keys into Anansi public files.

## Daily Editing Flow

1. Inventory source clips with `ffprobe`.
2. If speech matters, transcribe and pack transcripts into `takes_packed.md`.
3. the teample visual timelines only at decision points.
4. Propose a plain-English edit strategy and wait for approval.
5. Create an EDL.
6. Render a helper preview when useful.
7. Self-evaluate the rendered output at cut boundaries.
8. Fix, re-render, and re-evaluate up to three passes.
9. Pass the locked EDL, clip paths, timing notes, and any helper preview into HyperFrames.
10. Use HyperFrames for the reviewable final composition/export.
11. Append session memory and Anansi filing notes.

## Anansi Translation

Anansi Final Cut should convert upstream work into a video-use-friendly brief:

- Brief Agent gives the objective, audience, single-minded idea, proof points, mandatories, and delivery specs.
- Mood Weaver gives visual locks: palette, light, material, camera feeling, avoid rules.
- Story Weaver gives story spine, emotional beats, and script/VO spine.
- Scene Weaver gives shot sequence and storyboard beats.
- Runway Render gives selected clips, final-frame references, continuity notes, and output log.

## Hard Production Rules To Preserve

- Confirm strategy before editing.
- Do not cut inside words.
- Use audio fades at segment boundaries.
- Apply subtitles/design layers in HyperFrames unless a fixed burned-in caption file is explicitly approved.
- Keep outputs in the session `edit/` folder.
- Cache transcripts.
- Verify cut boundaries before showing preview.
- Do not present a non-HyperFrames export as the final Anansi assembly unless the team explicitly overrides the HyperFrames requirement.

## Anansi Output Locations

Prefer:

- project `edit/` folder for WIP
- project `final/` folder for approved exports
- Obsidian output log for paths and notes
- private vault notes for raw edit rationale
- public repo only for sanitized examples and approved demo assets
