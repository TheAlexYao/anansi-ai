import Image from "next/image";
import Link from "next/link";

const boards = [
  {
    slug: "weaver",
    label: "01 · Weaver",
    metaphor: "Anansi the spider-weaver. Threads converge to the cut.",
    palette: ["#f7f5f0", "#11110f", "#ed4327"],
    paletteLabels: ["paper", "ink", "cinder rust"],
    type: "Geist Display + Instrument Serif italic",
    tagline: "Weave the film.",
    notes: "Builds on the existing workbench mark. 8-thread asterisk with one rust thread for the operator. Editorial / cinematic."
  },
  {
    slug: "aperture",
    label: "02 · Aperture",
    metaphor: "Five-blade camera diaphragm. Five agents converging on one cut.",
    palette: ["#0a0a0a", "#eaeaea", "#d8a16d", "#e61919"],
    paletteLabels: ["carbon", "phosphor", "amber 35k", "hazard red"],
    type: "Archivo Black + Geist Mono caps",
    tagline: "Five blades. One cut.",
    notes: "Tactical / film-camera spec sheet. Each blade labelled 01–05 (Brief, Mood, Story, Scene, Render). Hazard-red dot at center."
  },
  {
    slug: "the-cut",
    label: "03 · The Cut",
    metaphor: "The film cut as a single decisive mark. The brand mark is a slash.",
    palette: ["#fbfbfa", "#3d2f24", "#9f2f2d"],
    paletteLabels: ["bone", "espresso", "rose"],
    type: "Instrument Serif italic + Geist Mono",
    tagline: "Your taste, in the cut.",
    notes: "Editorial Quarterly direction. Serif-italic wordmark with horizontal cut through the A. Magazine-grade restraint."
  }
];

export default function BrandPage() {
  return (
    <main style={{ background: "#11110f", color: "#f7f5f0", minHeight: "100dvh", fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
      <header style={{ padding: "min(8vw, 80px) min(6vw, 60px) 32px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.22em", color: "rgba(247,245,240,.5)", marginBottom: 14 }}>BRAND DIRECTIONS · MAY 2026 · BRANDKIT SKILL</p>
        <h1 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 540, letterSpacing: "-0.02em", lineHeight: 1.02, margin: 0 }}>Three brand worlds for Anansi.</h1>
        <p style={{ marginTop: 14, color: "rgba(247,245,240,.66)", maxWidth: "60ch", fontSize: 16, lineHeight: 1.6 }}>Generated via Nano Banana Pro using the brandkit skill. Same brand strategy — three different visual conclusions.</p>
        <p style={{ marginTop: 16, fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, color: "rgba(247,245,240,.5)" }}>
          <Link href="/v" style={{ color: "#ed4327", textDecoration: "none" }}>← back to landing variants</Link>
        </p>
      </header>

      <section style={{ display: "grid", gap: 60, padding: "min(6vw, 60px)", maxWidth: 1600, margin: "0 auto" }}>
        {boards.map((b) => (
          <article key={b.slug} style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.4fr) minmax(0, 1fr)", gap: 36, alignItems: "start" }}>
            <a href={`/brand/${b.slug}.jpg`} target="_blank" rel="noreferrer" style={{ display: "block", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", background: "#000" }}>
              <Image src={`/brand/${b.slug}.jpg`} alt={`${b.label} brand board`} width={1376} height={774} sizes="(max-width: 980px) 100vw, 60vw" style={{ width: "100%", height: "auto", display: "block" }} />
            </a>
            <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.22em", color: "#ed4327" }}>{b.label}</span>
              <h2 style={{ fontSize: 28, fontWeight: 540, letterSpacing: "-0.012em", lineHeight: 1.1, margin: 0 }}>{b.tagline}</h2>
              <p style={{ color: "rgba(247,245,240,.7)", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{b.metaphor}</p>
              <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,.1)", margin: "4px 0" }} />
              <dl style={{ display: "grid", gap: 12, margin: 0, fontSize: 12.5 }}>
                <div>
                  <dt style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, letterSpacing: "0.18em", color: "rgba(247,245,240,.5)", marginBottom: 6 }}>PALETTE</dt>
                  <dd style={{ display: "flex", gap: 6, margin: 0, flexWrap: "wrap" }}>
                    {b.palette.map((hex, i) => (
                      <span key={hex} title={`${b.paletteLabels[i]} · ${hex}`} style={{ width: 24, height: 24, borderRadius: 4, background: hex, border: "1px solid rgba(255,255,255,.18)" }} />
                    ))}
                  </dd>
                </div>
                <div>
                  <dt style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, letterSpacing: "0.18em", color: "rgba(247,245,240,.5)", marginBottom: 6 }}>TYPE</dt>
                  <dd style={{ margin: 0, color: "rgba(247,245,240,.85)" }}>{b.type}</dd>
                </div>
                <div>
                  <dt style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 10, letterSpacing: "0.18em", color: "rgba(247,245,240,.5)", marginBottom: 6 }}>NOTES</dt>
                  <dd style={{ margin: 0, color: "rgba(247,245,240,.7)", lineHeight: 1.55 }}>{b.notes}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </section>

      <footer style={{ padding: "60px min(6vw, 60px)", borderTop: "1px solid rgba(255,255,255,.08)", fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.18em", color: "rgba(247,245,240,.5)" }}>
        GENERATED · GEMINI 3 PRO IMAGE · 2K · 16:9 · SAVED TO public/brand/
      </footer>
    </main>
  );
}
