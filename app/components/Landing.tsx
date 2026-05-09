"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroFrames = [
  { src: "/generated/runway/anansi-cinder/street.png", caption: "0:14  ·  Lisbon, Rua da Bica  ·  35mm" },
  { src: "/generated/runway/anansi-cinder/walk.png",   caption: "0:11  ·  Tracking  ·  ƒ/1.8" },
  { src: "/generated/runway/anansi-cinder/leather.png",caption: "0:03  ·  Macro  ·  100mm" },
  { src: "/generated/runway/anansi-cinder/tram.png",   caption: "0:18  ·  Pass-by  ·  Sodium 2200K" },
  { src: "/generated/runway/anansi-cinder/boots.png",  caption: "0:24  ·  Reveal  ·  85mm" }
];

const stages = ["BRIEF", "MOOD", "STORY", "SCENE", "RENDER"];

const bento = [
  {
    tag: "01 / WORKBENCH",
    title: "A creative-director's desk, not a SaaS wizard.",
    body: "Brief on the left, mood up top, story weaver on the right, scenes branching below, final cut bottom-right. Every panel reads from the same project file.",
    artKind: "screenshot" as const
  },
  {
    tag: "02 / FIVE SKILLS",
    title: "Drops into Claude Code, Hermes, OpenClaw, Codex.",
    body: "Five markdown skills install once and symlink into every agent runtime on your machine. No new vendor. No second tool to learn.",
    artKind: "skills" as const
  },
  {
    tag: "03 / YOUR KEY",
    title: "Your Runway account. Your bill. No proxy.",
    body: "Renders live in your Runway account. Exports stay on your machine. Anansi never sees the traffic — and the starter project is pre-rendered, so you can explore without a key.",
    artKind: "key" as const
  }
];

const manifesto = [
  {
    n: ".01",
    head: "Anansi is a creative producer.",
    body: "Stakeholders, customers, and investors can smell automated content. Anansi keeps you in the loop at three points where taste matters: direction, scene, final cut. The agents weave; you decide."
  },
  {
    n: ".02",
    head: "Composes existing tools. Reinvents none.",
    body: "Five skills install into the agent runtime you already use. Renders go through your Runway account. Workflow API for the routing; your CLI for the calls. We ship the conductor, not the orchestra."
  },
  {
    n: ".03",
    head: "One file. Every tool reads it.",
    body: "The workbench reads it. The CLI reads it. Your agent reads it. No proprietary state, no lock-in, no secret database — open the project in any editor on any machine."
  }
];

function HeroFilm() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroFrames.length), 2600);
    return () => clearInterval(id);
  }, []);
  const frame = heroFrames[index];
  return (
    <div className="hero__film" aria-label="Cinematic montage demonstration">
      {heroFrames.map((f, i) => (
        <div key={f.src} className={`hero__frame${i === index ? " is-on" : ""}`}>
          <Image src={f.src} alt={f.caption} fill priority={i === 0} sizes="100vw" />
        </div>
      ))}
      <div className="hero__filmGradient" aria-hidden="true" />
      <div className="hero__rec" role="status">
        <span className="hero__recDot" />
        <span>REC</span>
        <i />
        <b className="hero__recCaption">{frame.caption}</b>
      </div>
      <div className="hero__filmStrip" aria-hidden="true">
        {heroFrames.map((f, i) => (
          <i key={f.src} className={i === index ? "is-on" : ""} />
        ))}
      </div>
    </div>
  );
}

function Cmd({ children, tone = "light" }: { children: string; tone?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`cmd cmd--${tone}`}
      onClick={async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      <span className="cmd__sigil">$</span>
      <code>{children}</code>
      <span className="cmd__hint">{copied ? "copied" : "copy"}</span>
    </button>
  );
}

function ScreenshotArt() {
  return (
    <div className="bento__art bento__art--shot">
      <div className="bento__shotChrome">
        <span className="bento__shotPanel bento__shotPanel--left">
          <i /><i /><i style={{ width: "60%" }} /><b />
        </span>
        <span className="bento__shotPanel bento__shotPanel--main">
          <span className="bento__shotTile" />
          <span className="bento__shotTile" />
          <span className="bento__shotTile" />
          <span className="bento__shotTile bento__shotTile--wide" />
          <span className="bento__shotTile bento__shotTile--wide" />
          <span className="bento__shotTile bento__shotTile--wide" />
        </span>
        <span className="bento__shotPanel bento__shotPanel--right">
          <i /><i /><i /><i style={{ width: "70%" }} />
          <em />
        </span>
      </div>
      <div className="bento__shotPulse" aria-hidden="true" />
    </div>
  );
}

function SkillsArt() {
  const skills = ["brief", "mood-weaver", "story-weaver", "scene-weaver", "runway-render"];
  return (
    <div className="bento__art bento__art--skills">
      <ul>
        {skills.map((s, i) => (
          <li key={s} style={{ animationDelay: `${i * 240}ms` }}>
            <span className="skillsArt__path">~/.agents/skills/</span>
            <span className="skillsArt__name">anansi-{s}</span>
            <span className="skillsArt__ok">●</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeyArt() {
  return (
    <div className="bento__art bento__art--key">
      <div className="keyArt__row">
        <span className="keyArt__label">RUNWAYML_API_KEY_AUTH</span>
        <span className="keyArt__value">rw_•••••••••••••••••••••</span>
      </div>
      <div className="keyArt__pipe">
        <span>You</span>
        <i className="keyArt__line" />
        <span className="keyArt__node">Anansi</span>
        <i className="keyArt__line keyArt__line--ghost" />
        <span>Runway</span>
      </div>
      <div className="keyArt__caption">No proxy. No relay. Direct.</div>
    </div>
  );
}

function BentoArt({ kind }: { kind: "screenshot" | "skills" | "key" }) {
  if (kind === "screenshot") return <ScreenshotArt />;
  if (kind === "skills") return <SkillsArt />;
  return <KeyArt />;
}

export function Landing() {
  return (
    <main className="lp">
      {/* ───────── Nav ───────── */}
      <header className="lp-nav">
        <Link href="/" className="lp-brand" aria-label="Anansi home">
          <span className="lp-mark" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <span className="lp-brandWord">ANANSI</span>
        </Link>
        <nav aria-label="Primary">
          <a href="#how">How</a>
          <a href="#manifesto">Manifesto</a>
          <a href="https://github.com/TheAlexYao/anansi" target="_blank" rel="noreferrer">Source</a>
        </nav>
        <Link href="/workbench?project=hinter-pitch-film" className="lp-navCta">
          Open the workbench
          <span aria-hidden="true">↗</span>
        </Link>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="hero" aria-label="Anansi — the visual storytelling agent for Runway">
        <HeroFilm />
        <div className="hero__copy">
          <p className="hero__eyebrow"><i />THE VISUAL STORYTELLING AGENT FOR RUNWAY</p>
          <h1 className="hero__head">
            Bring the brief.
            <em>Anansi&nbsp;weaves the&nbsp;film.</em>
          </h1>
          <p className="hero__lede">
            A 30-second cinematic film stakeholders take seriously. Five agents handle the references, palette, and renders. You keep the brief, the direction, and the cut.
          </p>
          <div className="hero__actions">
            <Cmd>npx anansi-ai connect</Cmd>
            <Link className="btn btn--primary" href="/workbench?project=hinter-pitch-film">
              Open the workbench
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <aside className="hero__meta" aria-label="Runtimes">
          <span className="hero__metaLabel">DROPS&nbsp;INTO</span>
          <ul>
            <li>Claude Code</li>
            <li>Hermes</li>
            <li>OpenClaw</li>
            <li>Codex</li>
          </ul>
        </aside>
      </section>

      {/* ───────── Marquee ───────── */}
      <section className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...Array(3)].map((_, set) => (
            <span key={set} className="marquee__set">
              {stages.map((s, i) => (
                <span key={`${set}-${s}`} className="marquee__item">
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>{s}</span>
                  <i />
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ───────── How it weaves (asymmetric story) ───────── */}
      <section className="how" id="how">
        <header className="how__head">
          <span className="how__tag">HOW</span>
          <h2>
            Five agents. One brief.<br />
            <em>You stay in the loop.</em>
          </h2>
          <p>
            Anansi stops at three points where taste matters — direction, scene, final cut. Everything else, the agents handle: pulling references, weaving the palette, queuing renders, assembling the timeline.
          </p>
        </header>
        <ol className="how__list">
          <li className="how__step" data-step="01">
            <span className="how__num">01</span>
            <div className="how__body">
              <h3>Brief.</h3>
              <p>Product, feeling, references, audience. Markdown or paste — both work.</p>
            </div>
          </li>
          <li className="how__step" data-step="02">
            <span className="how__num">02</span>
            <div className="how__body">
              <h3>Mood&nbsp;weaver.</h3>
              <p>References become palette and stills. The visual world precedes the words.</p>
            </div>
          </li>
          <li className="how__step is-checkpoint" data-step="03">
            <span className="how__num">03</span>
            <div className="how__body">
              <h3>Story&nbsp;weaver.</h3>
              <p>Three cinematic directions. Tone, pacing, the sentence the film answers. <b>You choose one.</b></p>
            </div>
          </li>
          <li className="how__step is-checkpoint" data-step="04">
            <span className="how__num">04</span>
            <div className="how__body">
              <h3>Scene&nbsp;weaver.</h3>
              <p>Three scenes × two options. Lens, motion, prompt strength. <b>You pick the path.</b></p>
            </div>
          </li>
          <li className="how__step is-checkpoint" data-step="05">
            <span className="how__num">05</span>
            <div className="how__body">
              <h3>Runway&nbsp;render.</h3>
              <p>Workflow API queues the variants. Drafts in <code>gen4_turbo</code>, finals in <code>gen4.5</code>. <b>You approve the cut.</b></p>
            </div>
          </li>
        </ol>
      </section>

      {/* ───────── Bento (asymmetric) ───────── */}
      <section className="bento" aria-label="What's in the box">
        <header className="bento__head">
          <span className="bento__tag">WHAT'S IN THE BOX</span>
          <h2>One install. <em>Three doorways.</em></h2>
        </header>
        <div className="bento__grid">
          {bento.map((cell, i) => (
            <article key={cell.tag} className={`bento__cell bento__cell--${i + 1}`}>
              <BentoArt kind={cell.artKind} />
              <div className="bento__caption">
                <span className="bento__cellTag">{cell.tag}</span>
                <h3>{cell.title}</h3>
                <p>{cell.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── Manifesto (zig-zag) ───────── */}
      <section className="manifesto" id="manifesto">
        <header className="manifesto__head">
          <span className="manifesto__tag">MANIFESTO</span>
          <h2>
            How Anansi sees<br />the work.
          </h2>
        </header>
        <ol className="manifesto__list">
          {manifesto.map((m) => (
            <li key={m.head} className="manifesto__item">
              <span className="manifesto__n">{m.n}</span>
              <div className="manifesto__body">
                <h3>{m.head}</h3>
                <p>{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── Closer ───────── */}
      <section className="closer">
        <div className="closer__inner">
          <p className="closer__eyebrow">RUN IT NOW</p>
          <h2 className="closer__head">
            The starter project<br />
            <em>is already loaded.</em>
          </h2>
          <p className="closer__lede">
            A real fundraising film for Hinter Property No. 2 — moodboard, three directions, six scene options, final cut. Walk every panel before you bring your own Runway key.
          </p>
          <div className="closer__actions">
            <Cmd tone="dark">npx anansi-ai connect</Cmd>
            <Link className="btn btn--accent" href="/workbench?project=hinter-pitch-film">
              Open the workbench
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="closer__mesh" aria-hidden="true" />
      </section>

      {/* ───────── Foot ───────── */}
      <footer className="lp-foot">
        <div>
          <span className="lp-mark lp-mark--inline" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>ANANSI</span>
        </div>
        <span>BUILT FOR THE RUNWAY API HACKATHON · MAY 2026</span>
        <span>YAO · MARIN · BRUKHMAN</span>
      </footer>
    </main>
  );
}
