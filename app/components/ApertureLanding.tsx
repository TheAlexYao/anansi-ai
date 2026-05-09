"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApertureMark } from "./ApertureMark";

/* ─── Data ───────────────────────────────────────── */

const teaserFrames = [
  { src: "/generated/runway/hinter-pitch-film/cabin-dawn.jpg",      time: "0:00 – 0:06", caption: "Hook  ·  Cabin at first light" },
  { src: "/generated/runway/hinter-pitch-film/forest-path.jpg",     time: "0:06 – 0:14", caption: "Approach  ·  Path through cedars" },
  { src: "/generated/runway/hinter-pitch-film/window-rain.jpg",     time: "0:14 – 0:20", caption: "Turn  ·  Rain on glass" },
  { src: "/generated/runway/hinter-pitch-film/firepit-evening.jpg", time: "0:20 – 0:30", caption: "Memory  ·  Stillness on the deck" }
];

const blades = [
  { code: "01", name: "BRIEF",  apis: ["Claude"] },
  { code: "02", name: "MOOD",   apis: ["Claude", "Runway Gen-4 Image", "Pexels"] },
  { code: "03", name: "STORY",  apis: ["Claude"] },
  { code: "04", name: "RENDER", apis: ["Runway Gen-4.5", "Aleph", "Characters API"] },
  { code: "05", name: "SOUND",  apis: ["ElevenLabs", "Suno · Udio"] }
];

const credits = [
  { tier: "REASONING",      apis: ["Claude"] },
  { tier: "STILLS",         apis: ["Runway Gen-4 Image", "Pexels", "Unsplash"] },
  { tier: "MOTION",         apis: ["Runway Gen-4.5", "Runway Aleph", "Characters API"] },
  { tier: "SOUND",          apis: ["ElevenLabs", "Suno", "Udio"] },
  { tier: "DELIVERY",       apis: ["Notion", "PDF"] }
];

/* ─── Components ─────────────────────────────────── */

function CmdLine({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="ap-cmd"
      onClick={async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <span className="ap-cmd__sigil">$</span>
      <code>{children}</code>
      <em className="ap-cmd__hint">{copied ? "copied" : "copy"}</em>
    </button>
  );
}

function Cta({ children, href, kind = "primary" }: { children: React.ReactNode; href: string; kind?: "primary" | "ghost" }) {
  return (
    <Link href={href} className={`ap-cta ap-cta--${kind}`}>
      <span>{children}</span>
      <em aria-hidden="true">→</em>
    </Link>
  );
}

function HeroDissolve() {
  // 0 = render (input), 1 = teaser (output). Slow alternating dissolve every 3.6s.
  const [showTeaser, setShowTeaser] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setShowTeaser((v) => !v), 3600);
    return () => clearInterval(id);
  }, []);
  return (
    <figure className="ap-hero__split">
      <div className={`ap-hero__layer ap-hero__layer--render${showTeaser ? "" : " is-on"}`}>
        <Image src="/hinter-render.jpg" alt="Architectural render of Hinter Property No. 02" fill unoptimized sizes="(max-width: 1080px) 100vw, 50vw" />
        <span className="ap-hero__chip">RENDER  ·  INPUT</span>
      </div>
      <div className={`ap-hero__layer ap-hero__layer--teaser${showTeaser ? " is-on" : ""}`}>
        <Image src="/generated/runway/hinter-pitch-film/firepit-evening.jpg" alt="Cinematic teaser frame, dusk on the deck" fill unoptimized sizes="(max-width: 1080px) 100vw, 50vw" />
        <span className="ap-hero__chip ap-hero__chip--out">TEASER  ·  OUTPUT</span>
      </div>
    </figure>
  );
}

function Player() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % teaserFrames.length), 6500);
    return () => clearInterval(id);
  }, []);
  const f = teaserFrames[i];
  return (
    <div className="ap-player">
      <div className="ap-player__chrome">
        {teaserFrames.map((frame, idx) => (
          <div key={frame.src} className={`ap-player__frame${idx === i ? " is-on" : ""}`}>
            <Image src={frame.src} alt={frame.caption} fill unoptimized sizes="(max-width: 1080px) 100vw, 60vw" priority={idx === 0} />
          </div>
        ))}
        <div className="ap-player__veil" aria-hidden="true" />
        <div className="ap-player__hud">
          <span className="ap-player__rec"><i />REC</span>
          <span className="ap-player__caption">{f.caption}</span>
          <span className="ap-player__time">{f.time}</span>
        </div>
        <div className="ap-player__rail">
          {teaserFrames.map((frame, idx) => (
            <i key={frame.src} className={idx === i ? "is-on" : ""} />
          ))}
        </div>
      </div>
      <div className="ap-player__caption-line">
        <span>HINTER PROPERTY NO. 02</span>
        <span>·</span>
        <span>30s · 16:9 · gen-4.5</span>
        <span>·</span>
        <span>OPS BUILT FOR THE RUNWAY API HACKATHON</span>
      </div>
    </div>
  );
}

function BigAperture() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % blades.length), 1900);
    return () => clearInterval(id);
  }, []);
  const angle = (i: number) => i * 72 - 90; // place labels around the mark, blade 0 at top
  return (
    <div className="ap-big">
      <div className="ap-big__lens">
        <ApertureMark size={420} color="#eaeaea" accent="#e61919" activeBlade={phase} variant="line" />
        {blades.map((b, i) => {
          const a = (angle(i) * Math.PI) / 180;
          const r = 230;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          return (
            <div
              key={b.code}
              className={`ap-big__label${i === phase ? " is-on" : ""}`}
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <span>{b.code}</span>
              <strong>{b.name}</strong>
              <em>{b.apis.join("  ·  ")}</em>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────── */

export function ApertureLanding() {
  return (
    <main className="ap2-page">

      {/* ── NAV ───────────────────────────────────── */}
      <header className="ap2-nav">
        <Link href="/" className="ap2-brand" aria-label="Anansi home">
          <Image src="/mark-light.jpg" alt="" width={28} height={28} unoptimized className="ap2-brand__mark" />
          <span>Anansi</span>
        </Link>
        <nav>
          <a href="#teaser">The teaser</a>
          <a href="#how">How it works</a>
          <a href="#stack">Built on</a>
        </nav>
        <Cta href="/workbench?project=hinter-pitch-film">Open the workbench</Cta>
      </header>

      {/* ── 1 · HERO ──────────────────────────────── */}
      <section className="ap2-hero">
        <div className="ap2-hero__copy">
          <p className="ap2-eyebrow">AI-native cinematic storytelling for architecture</p>
          <h1 className="ap2-h1">
            From render.<br />
            <em>To teaser.</em>
          </h1>
          <p className="ap2-lede">
            Drop in the architectural render. Anansi returns a 30-second cinematic film a developer, broker, or investor will take seriously — moodboard, voice, and treatment included.
          </p>
          <div className="ap2-actions">
            <CmdLine>npx anansi-ai connect</CmdLine>
            <Cta href="/workbench?project=hinter-pitch-film">Open the workbench</Cta>
          </div>
        </div>
        <HeroDissolve />
      </section>

      {/* ── 2 · THE TEASER (proof) ───────────────── */}
      <section className="ap2-proof" id="teaser">
        <header className="ap2-section__head">
          <p className="ap2-eyebrow">Hinter Property No. 02 · 30-second teaser</p>
          <h2 className="ap2-h2">
            Architectural render in.<br />
            <em>Thirty seconds out.</em>
          </h2>
        </header>
        <Player />
      </section>

      {/* ── 3 · HOW IT WORKS — the aperture ───────── */}
      <section className="ap2-how" id="how">
        <header className="ap2-section__head ap2-section__head--center">
          <p className="ap2-eyebrow">The system</p>
          <h2 className="ap2-h2 ap2-h2--center">
            Five blades.<br />
            <em>One cut.</em>
          </h2>
          <p className="ap2-lede ap2-lede--center">
            Eight agents grouped into five mechanical blades. The mark is the pipeline — when a render is in flight, the blade carrying it lights up.
          </p>
        </header>
        <BigAperture />
        <p className="ap2-how__handoff">
          You decide at three points: <strong>direction</strong>, <strong>scene</strong>, <strong>final cut</strong>. Everything between, the agents handle.
        </p>
      </section>

      {/* ── 4 · STACK (as credits) ────────────────── */}
      <section className="ap2-credits" id="stack">
        <header className="ap2-section__head">
          <p className="ap2-eyebrow">Composed from the tools you already use</p>
          <h2 className="ap2-h2">
            Built on the<br />
            <em>creative-AI stack.</em>
          </h2>
        </header>
        <ol className="ap2-credits__list">
          {credits.map((row, i) => (
            <li key={row.tier} style={{ animationDelay: `${i * 80}ms` }}>
              <span className="ap2-credits__tier">{row.tier}</span>
              <div className="ap2-credits__apis">
                {row.apis.map((api) => <span key={api}>{api}</span>)}
              </div>
            </li>
          ))}
        </ol>
        <p className="ap2-credits__note">
          Renders run on your Runway account. Narration on your ElevenLabs. Music on your Suno. Anansi never proxies traffic — your bills, your accounts, your control.
        </p>
      </section>

      {/* ── 5 · CLOSER ────────────────────────────── */}
      <section className="ap2-closer">
        <Image src="/brand/aperture-splash.jpg" alt="" fill unoptimized sizes="100vw" className="ap2-closer__bg" />
        <div className="ap2-closer__veil" aria-hidden="true" />
        <div className="ap2-closer__copy">
          <h2 className="ap2-h2 ap2-h2--mega">
            Open the bench.<br />
            <em>Walk every panel.</em>
          </h2>
          <p className="ap2-lede">
            The Hinter teaser is already loaded — moodboard, three directions, six scene options, final cut. Walk every panel before you bring your own keys.
          </p>
          <div className="ap2-actions">
            <CmdLine>npx anansi-ai connect</CmdLine>
            <Cta href="/workbench?project=hinter-pitch-film" kind="primary">Open the workbench</Cta>
          </div>
        </div>
      </section>

      <footer className="ap2-foot">
        <span>Anansi · 2026</span>
        <span>Built for the Runway API hackathon · May 2026</span>
        <span>Yao · Marin · Brukhman</span>
      </footer>
    </main>
  );
}
