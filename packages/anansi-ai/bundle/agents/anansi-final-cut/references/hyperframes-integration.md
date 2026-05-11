# HyperFrames Integration

Sources:

- https://hyperframes.heygen.com/
- https://hyperframes.heygen.com/quickstart
- https://github.com/heygen-com/hyperframes

HyperFrames lets agents compose videos by writing HTML, CSS, and JS. For Anansi, it is the required Final Cut composition layer after Runway clips exist. video-use and `ffmpeg` may prepare or inspect clips, but the reviewable final assembly must be expressed as a HyperFrames project. A non-HyperFrames export is only a helper/proxy unless the team explicitly overrides the requirement for that project.

## Use HyperFrames For

- every Anansi final preview/export assembly
- designed final assembly
- animated title cards
- captions and kinetic typography
- lower thirds
- CTA cards
- branded/editorial wrappers
- product-promo layouts
- previewable HTML timelines
- final MP4 renders from a composition

## Do Not Use HyperFrames For

- creative brief generation
- moodboard generation
- story direction
- scene/storyboard planning
- Runway prompt writing
- keyframe generation
- replacing Runway video generation

## Backend Choice

Use this selection logic:

| Need | Backend |
|---|---|
| Simple clip concat, trims, fades | `ffmpeg` or video-use as helpers, then HyperFrames for final composition |
| Transcript-driven editing | video-use as helper, then HyperFrames for final composition |
| Designed titles, captions, lower thirds, CTA cards | HyperFrames |
| Complex HTML/CSS/JS visual treatment | HyperFrames |
| Image-to-video generation | Runway |
| Keyframe/still generation | Hermes GPT Image 2 |

If HyperFrames setup or rendering fails, stop and report the blocker instead of silently falling back to a non-HyperFrames final.

## Setup Expectations

HyperFrames requires:

- Node.js 22 or later
- npm/npx
- ffmpeg

Run:

```bash
"{{ANANSI_AGENT_HOME}}/scripts/setup-hyperframes.sh"
```

To create a project composition:

```bash
"{{ANANSI_AGENT_HOME}}/scripts/anansi-hyperframes-init.sh" PROJECT_SLUG
```

This should create:

```txt
{{ANANSI_PROJECTS_DIR}}/PROJECT_SLUG/edit/hyperframes/
```

## Composition Contract

Final Cut should pass HyperFrames:

- approved clip paths
- EDL with timing
- target duration
- aspect ratio and resolution
- caption text and timing
- title/CTA copy
- overlay rules
- type scale and style
- safe-zone constraints
- audio plan
- output filename

## Anansi Taste Rules

- Keep typography sparse and cinematic unless the platform requires caption density.
- Captions must sit inside platform safe zones.
- Do not cover the emotional center of the frame.
- Use overlays to clarify story, not decorate.
- Protect the creative lead mood locks: restraint, atmosphere, negative space, tactility, and emotionally coherent light.
- For Hinter-style architecture, avoid loud kinetic type, tech UI overlays, glossy SaaS motion, and decorative template energy.

## Output Locations

Recommended:

- HyperFrames project: `edit/hyperframes/`
- preview renders: `edit/previews/`
- final exports: `final/`
- EDL: `edit/edl.md`
- logs and notes: `edit/logs/`

## Verification Checklist

- correct runtime
- correct aspect ratio
- no source files overwritten
- all clips load
- captions readable and safe-zone compliant
- overlays align with cut timing
- first frame and last frame are intentional
- no black frames unless planned
- no audio pops at cuts
- exported file is playable
