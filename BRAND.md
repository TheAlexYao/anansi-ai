# Anansi — Brand System

> Identity direction: **Aperture** (chosen May 2026)
> Built using the brandkit skill (Leonxlnx/taste-skill suite) + Nano Banana Pro
> Source board: `public/brand/aperture.jpg`

## Core idea

A camera aperture has five blades. Anansi has five agents. The five blades converge on a single hazard-red dot at the center — **the cut**. The metaphor is product-native: the brand mark is the pipeline.

## Tagline

> **Five blades. One cut.**

The tagline is product-literal and brand-poetic at once.

## Mark

Vector source: [`app/components/ApertureMark.tsx`](./app/components/ApertureMark.tsx)
Static favicon: [`public/icon.svg`](./public/icon.svg)

The component is parameterized:

```tsx
<ApertureMark
  size={32}                  // px
  color="#eaeaea"            // blade & ring stroke
  accent="#e61919"           // center dot
  labels                     // 01–05 stage labels around blades
  activeBlade={2}            // 0–4: which blade is "open"
  variant="solid" | "line"   // filled vs stroked
  hideRing                   // for compact lockups
/>
```

**Product-x-brand fusion:** `activeBlade` mirrors the workflow phase (Brief / Mood / Story / Scene / Render). When a render is in flight, the mark *is* the live status indicator. This is why Aperture beats a static logo for Anansi specifically.

Currently used at:
- `AnansiWorkbench` — sidebar lockup (compact, no ring)
- `BrutalLanding` — header lockup + the live `LiveAperture` telemetry block in the hero strip
- Favicon, apple-touch-icon, og:image, Twitter card

## Palette

| Token         | Hex       | Use |
|---------------|-----------|-----|
| Carbon        | `#0a0a0a` | Canvas (never `#000`) |
| Phosphor      | `#eaeaea` | Foreground / wordmark |
| Amber 35K     | `#d8a16d` | Spec sheet highlight, secondary chips |
| Hazard red    | `#e61919` | The cut. Single accent. |
| Paper (alt)   | `#f4f4f0` | When the surface flips light |

CSS tokens live in `app/globals.css` under the `v1 · BRUTAL` block (`--b-paper`, `--b-ink`, `--b-red`). The brutalist landing is the canonical aperture surface — its substrate is the brand's working light mode.

## Type

| Tier | Family | Use |
|------|--------|-----|
| Display (macro) | **Archivo Black** + Geist Display fallback | Headlines, wordmark |
| Mono (telemetry) | **Geist Mono** + JetBrains Mono fallback | All metadata, labels, codes, captions |
| Editorial accent | Instrument Serif italic | Optional — for the editorial cousin variant |

Fonts loaded via `next/font/google` in `app/layout.tsx`.

Rules:
- Display is uppercase only. Tight tracking (`-0.02em` to `-0.04em`).
- Mono is uppercase, generous tracking (`0.14em` to `0.22em`).
- No serif body. Serif italic appears only as a deliberate editorial flourish.

## Voice

Short, technical, voicy. Telemetry and craft language interchanged.

- ✅ "Five blades. One cut."
- ✅ "STARTER PROJECT: A REAL FUNDRAISING FILM FOR HINTER PROPERTY NO. 02."
- ✅ `01 BRIEF · 02 MOOD · 03 STORY · 04 SCENE · 05 RENDER`
- ❌ "Elevate your storytelling with our seamless AI suite"
- ❌ "Unleash next-gen creativity"

The voice is the [taste-skill](https://github.com/Leonxlnx/taste-skill) anti-slop list, hard-applied.

## Surfaces

| Surface | File |
|---------|------|
| Workbench app | `app/workbench/page.tsx` (uses ApertureMark) |
| Brutal landing (canonical brand expression) | `app/v/brutal/page.tsx` |
| Other variants (alternate visual languages, same brand) | `/v`, `/v/editorial`, `/v/glass` |
| Brand viewer | `app/brand/page.tsx` |
| Brand boards | `public/brand/{aperture,weaver,the-cut}.jpg` |
| Splash slate | `public/brand/aperture-splash.jpg` (workbench loader, future) |
| Social card | `public/og.jpg` |
| App icon | `public/apple-touch-icon.jpg` |
| Vector favicon | `public/icon.svg` |

## What's next

1. Use `aperture-splash.jpg` as the workbench's first-paint loader while the project file boots.
2. Wire `<ApertureMark activeBlade={n} />` into `QueuePanel` so the mark drives the live render state.
3. Replace the `Topbar` "Export" button glyph with a small `<ApertureMark size={14} hideRing />` when an export is rendering.
4. Generate a 30s motion stinger (the aperture closing into the cut) for the final film's title card.
5. Lock down the chosen variant (likely **brutal** as the primary hackathon submission landing) and link the others as a /v gallery.
