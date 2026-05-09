"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const stills = [
  { src: "/generated/runway/anansi-cinder/walk.png",   crop: "center 65%" },
  { src: "/generated/runway/anansi-cinder/leather.png",crop: "center 50%" },
  { src: "/generated/runway/anansi-cinder/tram.png",   crop: "center 60%" },
  { src: "/generated/runway/anansi-cinder/street.png", crop: "center 60%" },
  { src: "/generated/runway/anansi-cinder/boots.png",  crop: "center 65%" }
];

const issues = [
  { num: "01", agent: "Brief",         body: "Product, feeling, references, audience. Markdown or paste — both work." },
  { num: "02", agent: "Mood weaver",   body: "References become palette and stills. The visual world precedes the words." },
  { num: "03", agent: "Story weaver",  body: "Three cinematic directions. Tone, pacing, the sentence the film answers. You choose one." },
  { num: "04", agent: "Scene weaver",  body: "Three scenes × two options. Lens, motion, prompt strength. You pick the path." },
  { num: "05", agent: "Runway render", body: "Workflow API queues the variants. Drafts in gen4_turbo, finals in gen4.5. You approve the cut." }
];

const triptych = [
  {
    tag: "Workbench",
    title: "A creative-director's desk.",
    body: "Brief on the left. Mood up top. Story on the right. Scenes branching below. Final cut bottom-right. Every panel reads from the same project file.",
    keys: ["⌘", "K"],
    keyHint: "command palette"
  },
  {
    tag: "Skills",
    title: "Five markdown profiles.",
    body: "Install once, symlink into Claude Code, Hermes, OpenClaw, Codex. The same skill in every runtime. No new vendor, no second tool to learn.",
    keys: ["⌘", "I"],
    keyHint: "open install"
  },
  {
    tag: "Your key",
    title: "Your Runway. Your bill.",
    body: "Renders live in your account. Exports stay on your machine. Anansi never sees the traffic — and the starter project is pre-rendered, so you can explore without a key.",
    keys: ["⌥", "↩"],
    keyHint: "run pipeline"
  }
];

const manifesto = [
  {
    n: "Note .01",
    head: "Anansi is a creative producer.",
    body: "Stakeholders, customers, and investors can smell automated content. Anansi keeps you in the loop at three points where taste matters — direction, scene, final cut. The agents weave; you decide."
  },
  {
    n: "Note .02",
    head: "Composes existing tools. Reinvents none.",
    body: "Five skills install into the agent runtime you already use. Renders go through your Runway account. Workflow API for the routing; your CLI for the calls. We ship the conductor, not the orchestra."
  },
  {
    n: "Note .03",
    head: "One file. Every tool reads it.",
    body: "The workbench reads it. The CLI reads it. Your agent reads it. No proprietary state, no lock-in, no secret database — open the project in any editor on any machine."
  }
];

function HeroStill() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % stills.length), 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <figure className="e-hero__plate">
      {stills.map((s, idx) => (
        <div key={s.src} className={`e-hero__layer${idx === i ? " is-on" : ""}`} style={{ ["--crop" as string]: s.crop }}>
          <Image src={s.src} alt="" fill priority={idx === 0} sizes="(max-width: 900px) 92vw, 44vw" />
        </div>
      ))}
      <figcaption>
        <span>Plate&nbsp;0{i + 1}&nbsp;/&nbsp;{stills.length}</span>
        <span>From&nbsp;the&nbsp;<em>Cinder&nbsp;Studio</em>&nbsp;moodboard</span>
      </figcaption>
      <div className="e-hero__noise" aria-hidden="true" />
    </figure>
  );
}

function CmdLine({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="e-cmd"
      onClick={async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <span className="e-cmd__sigil">$</span>
      <code>{children}</code>
      <span className="e-cmd__hint">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function EditorialLanding() {
  return (
    <main className="e-page">
      {/* ── Masthead ── */}
      <header className="e-masthead">
        <div className="e-mastline">
          <span>The Anansi Quarterly</span>
          <span>Vol. 01 · Issue 02</span>
          <span>Lisbon · May 2026</span>
        </div>
        <div className="e-mastnav">
          <Link href="/" className="e-brand">
            <span className="e-brand__mark" aria-hidden="true">A</span>
            <span className="e-brand__word">Anansi</span>
          </Link>
          <nav>
            <a href="#process">Process</a>
            <a href="#triptych">Inside</a>
            <a href="#manifesto">Manifesto</a>
            <a href="https://github.com/TheAlexYao/anansi" target="_blank" rel="noreferrer">Source</a>
          </nav>
          <Link href="/workbench?project=hinter-pitch-film" className="e-cta e-cta--ghost">
            Open the workbench<span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="e-hero">
        <div className="e-hero__copy">
          <p className="e-eyebrow"><i />The visual storytelling agent for Runway</p>
          <h1 className="e-hero__head">
            Bring the brief.<br />
            <em>Anansi weaves the&nbsp;film.</em>
          </h1>
          <p className="e-lede">
            A 30-second cinematic film stakeholders take seriously. Five agents handle the references, palette, and renders. You keep the brief, the direction, and the cut.
          </p>
          <div className="e-actions">
            <CmdLine>npx anansi-ai connect</CmdLine>
            <Link href="/workbench?project=hinter-pitch-film" className="e-cta">
              Open the workbench<span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="e-pull">
            <span>“They can smell automated content. Anansi keeps you in the loop at three points where taste matters.”</span>
            <em>— from the manifesto, page 03</em>
          </p>
        </div>
        <HeroStill />
      </section>

      {/* ── Drop cap dek ── */}
      <section className="e-dek">
        <div className="e-dek__rule">
          <span>Page 02 — Process</span>
          <hr />
          <span>Five agents · One brief</span>
        </div>
        <p className="e-dek__lede">
          <span className="e-dropcap">A</span>nansi is built around a single conviction: human taste survives the AI by being asked the right questions in the right order. The pipeline pauses at three deliberate moments and runs autonomously between them. The agents are five; the operator is one.
        </p>
      </section>

      {/* ── Process — five-issue index ── */}
      <section className="e-process" id="process">
        <ol className="e-process__list">
          {issues.map((step) => (
            <li key={step.num}>
              <span className="e-process__num">{step.num}</span>
              <div>
                <h3>{step.agent}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Triptych ── */}
      <section className="e-triptych" id="triptych">
        <div className="e-triptych__head">
          <span className="e-tag e-tag--rose">Page 03 — Inside the bundle</span>
          <h2>One install. <em>Three doorways.</em></h2>
        </div>
        <div className="e-triptych__grid">
          {triptych.map((c) => (
            <article key={c.tag}>
              <span className="e-tag e-tag--bone">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <div className="e-keys">
                {c.keys.map((k) => <kbd key={k}>{k}</kbd>)}
                <span>{c.keyHint}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pull quote spread ── */}
      <section className="e-spread">
        <span className="e-tag e-tag--bone">An aside</span>
        <blockquote>
          <p>We ship the <em>conductor</em>, not the orchestra.</p>
        </blockquote>
        <p className="e-spread__attr">— from <em>Anansi</em>, manifesto note .02</p>
      </section>

      {/* ── Manifesto ── */}
      <section className="e-manifesto" id="manifesto">
        <div className="e-manifesto__head">
          <span className="e-tag e-tag--bone">Page 04 — Manifesto</span>
          <h2>How Anansi sees the work.</h2>
        </div>
        <ol className="e-manifesto__list">
          {manifesto.map((m) => (
            <li key={m.head}>
              <span className="e-manifesto__num">{m.n}</span>
              <h3>{m.head}</h3>
              <p>{m.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Closer ── */}
      <section className="e-closer">
        <div>
          <span className="e-tag e-tag--rose">Page 05 — Run it now</span>
          <h2>The starter project<br /><em>is already loaded.</em></h2>
          <p>A real fundraising film for Hinter Property No. 2 — moodboard, three directions, six scene options, final cut. Walk every panel before you bring your own Runway key.</p>
          <div className="e-actions">
            <CmdLine>npx anansi-ai connect</CmdLine>
            <Link href="/workbench?project=hinter-pitch-film" className="e-cta">
              Open the workbench<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Colophon ── */}
      <footer className="e-colophon">
        <div>
          <span className="e-brand__mark" aria-hidden="true">A</span>
          <strong>Anansi</strong>
        </div>
        <span>Built for the Runway API hackathon · May 2026</span>
        <span>Set in Geist & Instrument Serif · Yao · Marin · Brukhman</span>
      </footer>
    </main>
  );
}
