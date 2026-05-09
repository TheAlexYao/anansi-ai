"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const frames = [
  { src: "/generated/runway/anansi-cinder/walk.png" },
  { src: "/generated/runway/anansi-cinder/leather.png" },
  { src: "/generated/runway/anansi-cinder/tram.png" },
  { src: "/generated/runway/anansi-cinder/street.png" },
  { src: "/generated/runway/anansi-cinder/boots.png" }
];

const stages = [
  { code: "01", name: "Brief",         body: "Product, feeling, references, audience.",                                            owner: "you"   },
  { code: "02", name: "Mood weaver",   body: "References → palette + stills.",                                                   owner: "agent" },
  { code: "03", name: "Story weaver",  body: "Three directions. Tone. Pacing.",                                                  owner: "you"   },
  { code: "04", name: "Scene weaver",  body: "Three scenes × two options. Lens, motion, prompt strength.",                       owner: "you"   },
  { code: "05", name: "Runway render", body: "Workflow API queues drafts in gen4_turbo, finals in gen4.5.",                       owner: "you"   }
];

const features = [
  {
    tag: "Workbench",
    title: "A creative-director's desk, not a SaaS wizard.",
    body: "Brief on the left, mood up top, story weaver on the right, scenes branching below, final cut bottom-right. Every panel reads from the same project file."
  },
  {
    tag: "Drops in",
    title: "Five skills install once.",
    body: "Symlinks into Claude Code, Hermes, OpenClaw, Codex. The same skill in every runtime you already use. No new vendor; no second tool."
  },
  {
    tag: "Your key",
    title: "Your Runway. Your bill. No proxy.",
    body: "Renders live in your account. Exports stay on your machine. Anansi never sees the traffic — and the starter project is pre-rendered, so you can explore without a key."
  }
];

const manifesto = [
  {
    head: "Anansi is a creative producer.",
    body: "Stakeholders, customers, and investors can smell automated content. Anansi keeps you in the loop at three points where taste matters: direction, scene, final cut. The agents weave; you decide."
  },
  {
    head: "Composes existing tools. Reinvents none.",
    body: "Five skills install into the agent runtime you already use. Renders go through your Runway account. Workflow API for the routing; your CLI for the calls. We ship the conductor, not the orchestra."
  },
  {
    head: "One file. Every tool reads it.",
    body: "The workbench reads it. The CLI reads it. Your agent reads it. No proprietary state, no lock-in, no secret database — open the project in any editor on any machine."
  }
];

function GlassFilm() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="g-bezel">
      <div className="g-bezel__inner">
        {frames.map((f, idx) => (
          <div key={f.src} className={`g-frame${idx === i ? " is-on" : ""}`}>
            <Image src={f.src} alt="" fill priority={idx === 0} sizes="(max-width:980px) 100vw, 56vw" />
          </div>
        ))}
        <div className="g-frame__veil" aria-hidden="true" />
        <div className="g-island">
          <span className="g-island__dot" />
          <span>Live render</span>
          <i />
          <span>{stages[i % stages.length].name}</span>
          <i />
          <span className="g-island__time">0:{(i + 3).toString().padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

function CmdPill({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="g-cmd"
      onClick={async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      <span className="g-cmd__sigil">$</span>
      <code>{children}</code>
      <em className="g-cmd__hint">{copied ? "Copied" : "Copy"}</em>
    </button>
  );
}

function CtaArrow({ label, href, dark = false }: { label: string; href: string; dark?: boolean }) {
  return (
    <Link href={href} className={`g-cta${dark ? " g-cta--dark" : ""}`}>
      <span>{label}</span>
      <span className="g-cta__icon" aria-hidden="true">↗</span>
    </Link>
  );
}

export function GlassLanding() {
  return (
    <main className="g-page">
      <div className="g-aurora" aria-hidden="true">
        <i className="g-aurora__a" />
        <i className="g-aurora__b" />
        <i className="g-aurora__c" />
      </div>
      <div className="g-grid" aria-hidden="true" />

      {/* ── Floating island nav ── */}
      <header className="g-island g-island--nav">
        <Link href="/" className="g-brand" aria-label="Anansi home">
          <span className="g-mark" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>Anansi</span>
        </Link>
        <nav>
          <a href="#process">Process</a>
          <a href="#features">Features</a>
          <a href="#manifesto">Manifesto</a>
        </nav>
        <CtaArrow href="/workbench?project=hinter-pitch-film" label="Open the workbench" />
      </header>

      {/* ── Hero ── */}
      <section className="g-hero">
        <div className="g-hero__copy">
          <span className="g-eyebrow">The visual storytelling agent for Runway</span>
          <h1 className="g-hero__head">
            Bring the brief.<br />
            <em>Anansi weaves the&nbsp;film.</em>
          </h1>
          <p className="g-lede">
            A 30-second cinematic film stakeholders take seriously. Five agents handle the references, palette, and renders. You keep the brief, the direction, and the cut.
          </p>
          <div className="g-actions">
            <CmdPill>npx anansi-ai connect</CmdPill>
            <CtaArrow href="/workbench?project=hinter-pitch-film" label="Open the workbench" dark />
          </div>
          <ul className="g-runtimes">
            <li><span>Drops into</span></li>
            <li>Claude Code</li>
            <li>Hermes</li>
            <li>OpenClaw</li>
            <li>Codex</li>
          </ul>
        </div>
        <GlassFilm />
      </section>

      {/* ── Process bento ── */}
      <section className="g-process" id="process">
        <header className="g-section__head">
          <span className="g-pill">Process</span>
          <h2>
            Five agents. One brief.<br />
            <em>You stay in the&nbsp;loop.</em>
          </h2>
          <p>Anansi stops at three points where taste matters — direction, scene, final cut. Everything else, the agents handle.</p>
        </header>
        <ol className="g-stages">
          {stages.map((s) => (
            <li key={s.code} className={`g-stage g-stage--${s.owner}`}>
              <div className="g-stage__bezel">
                <div className="g-stage__inner">
                  <span className="g-stage__code">{s.code}</span>
                  <h3>{s.name}</h3>
                  <p>{s.body}</p>
                  <span className={`g-stage__owner g-stage__owner--${s.owner}`}>{s.owner === "you" ? "you" : "auto"}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Features ── */}
      <section className="g-features" id="features">
        <header className="g-section__head">
          <span className="g-pill">Inside</span>
          <h2>One install. <em>Three&nbsp;doorways.</em></h2>
        </header>
        <div className="g-features__grid">
          {features.map((f, i) => (
            <article key={f.tag} className={`g-card g-card--${i + 1}`}>
              <div className="g-card__bezel">
                <div className="g-card__inner">
                  <span className="g-pill g-pill--ghost">{f.tag}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="g-manifesto" id="manifesto">
        <header className="g-section__head">
          <span className="g-pill">Manifesto</span>
          <h2>How Anansi sees<br /><em>the&nbsp;work.</em></h2>
        </header>
        <ol className="g-manifesto__list">
          {manifesto.map((m, i) => (
            <li key={m.head}>
              <span className="g-manifesto__n">.{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{m.head}</h3>
                <p>{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Closer ── */}
      <section className="g-closer">
        <div className="g-closer__bezel">
          <div className="g-closer__inner">
            <span className="g-pill">Run it now</span>
            <h2>
              The starter project<br />
              <em>is already loaded.</em>
            </h2>
            <p>
              A real fundraising film for Hinter Property No. 2 — moodboard, three directions, six scene options, final cut. Walk every panel before you bring your own Runway key.
            </p>
            <div className="g-actions">
              <CmdPill>npx anansi-ai connect</CmdPill>
              <CtaArrow href="/workbench?project=hinter-pitch-film" label="Open the workbench" dark />
            </div>
          </div>
        </div>
      </section>

      <footer className="g-foot">
        <span>Anansi</span>
        <span>Built for the Runway API hackathon · May 2026</span>
        <span>Yao · Marin · Brukhman</span>
      </footer>
    </main>
  );
}
