import Link from "next/link";

const variants = [
  { slug: "/v/aperture", label: "v4 · Aperture", note: "The canonical brand build — uses the Nano Banana mark, og slate, splash, cinder plates. Asset-led." },
  { slug: "/", label: "v0 · Default", note: "Asymmetric editorial w/ kinetic marquee, bento, zig-zag manifesto." },
  { slug: "/v/brutal", label: "v1 · Brutal", note: "Swiss industrial print substrate. Mono-driven. Hazard-red accent. No rounding." },
  { slug: "/v/editorial", label: "v2 · Editorial", note: "Anansi Quarterly. Instrument Serif hero, drop cap, magazine grid." },
  { slug: "/v/glass", label: "v3 · Glass", note: "OLED black. Aurora mesh gradients. Double-bezel cards. Floating island nav." }
];

export default function Index() {
  return (
    <main style={{ padding: "min(8vw, 80px)", minHeight: "100dvh", background: "#f7f5f0", color: "#11110f", fontFamily: "var(--font-geist), system-ui, sans-serif" }}>
      <header style={{ marginBottom: 56 }}>
        <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, letterSpacing: "0.22em", color: "rgba(20,19,17,.5)", marginBottom: 12 }}>VARIANTS · TASTE-SKILL · MAY 2026</p>
        <h1 style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 540, letterSpacing: "-0.02em", lineHeight: 1.02 }}>Four landing pages. One brief.</h1>
        <p style={{ marginTop: 14, color: "rgba(20,19,17,.65)", maxWidth: "60ch", fontSize: 15, lineHeight: 1.55 }}>Built using Leonxlnx&apos;s taste-skill plus its sibling style modules — brutalist, minimalist, soft. Same copy, three radically different design languages.</p>
      </header>

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14, maxWidth: 920 }}>
        {variants.map((v) => (
          <li key={v.slug}>
            <Link
              href={v.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 220px) 1fr auto",
                gap: 18,
                alignItems: "center",
                padding: "22px 26px",
                border: "1px solid rgba(20,19,17,.12)",
                borderRadius: 12,
                background: "rgba(255,255,255,.5)",
                color: "inherit",
                textDecoration: "none",
                fontSize: 15,
                transition: "border-color .25s, transform .35s cubic-bezier(.16,1,.3,1), background .25s"
              }}
            >
              <strong style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, letterSpacing: "0.18em", color: "rgba(20,19,17,.78)" }}>{v.label}</strong>
              <span style={{ color: "rgba(20,19,17,.7)" }}>{v.note}</span>
              <span aria-hidden="true" style={{ color: "#ed4327" }}>↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
