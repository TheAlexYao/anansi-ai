"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApertureMark } from "./ApertureMark";

const frames = [
  { src: "/generated/runway/anansi-cinder/street.png", caption: "0014  /  35MM  /  ƒ1.8  /  ISO 800" },
  { src: "/generated/runway/anansi-cinder/walk.png",   caption: "0011  /  TRACKING  /  T2.1  /  ISO 1600" },
  { src: "/generated/runway/anansi-cinder/leather.png",caption: "0003  /  100MM  /  ƒ2.8  /  ISO 400" },
  { src: "/generated/runway/anansi-cinder/tram.png",   caption: "0018  /  PASS-BY  /  T1.4  /  ISO 3200" },
  { src: "/generated/runway/anansi-cinder/boots.png",  caption: "0024  /  85MM  /  ƒ1.4  /  ISO 800" }
];

const stages = [
  { code: "01", name: "BRIEF",   sub: "INTAKE / NORMALIZE" },
  { code: "02", name: "MOOD",    sub: "PALETTE / STILLS" },
  { code: "03", name: "STORY",   sub: "DIRECTIONS  ×3" },
  { code: "04", name: "SCENE",   sub: "OPTIONS  3×2" },
  { code: "05", name: "RENDER",  sub: "WORKFLOW  GEN-4.5" }
];

function LiveAperture() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % stages.length), 1800);
    return () => clearInterval(id);
  }, []);
  const s = stages[phase];
  return (
    <div className="b-live">
      <div className="b-live__mark">
        <ApertureMark size={148} color="#0a0a0a" accent="#e61919" activeBlade={phase} variant="line" />
      </div>
      <div className="b-live__readout">
        <span className="b-live__code">{s.code}</span>
        <strong>{s.name}</strong>
        <em>{s.sub}</em>
        <hr />
        <div className="b-live__telem">
          <span><b>BLADE</b>{phase + 1}/5</span>
          <span><b>F</b>1.4</span>
          <span><b>T</b>1</span>
          <span><b>STATE</b>{phase === 4 ? "RENDER" : phase >= 2 ? "OPERATOR" : "AGENT"}</span>
        </div>
      </div>
    </div>
  );
}

function Film() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="b-film">
      {frames.map((f, idx) => (
        <div key={f.src} className={`b-film__frame${idx === i ? " is-on" : ""}`}>
          <Image src={f.src} alt={f.caption} fill priority={idx === 0} sizes="100vw" />
        </div>
      ))}
      <div className="b-film__scan" aria-hidden="true" />
      <div className="b-film__hud">
        <span><b>● REC</b></span>
        <span>UNIT / CINDER-02</span>
        <span>{frames[i].caption}</span>
        <span>FRAME {String(i + 1).padStart(2, "0")} / {frames.length.toString().padStart(2, "0")}</span>
      </div>
      <div className="b-film__cross b-film__cross--tl">+</div>
      <div className="b-film__cross b-film__cross--tr">+</div>
      <div className="b-film__cross b-film__cross--bl">+</div>
      <div className="b-film__cross b-film__cross--br">+</div>
    </div>
  );
}

function Cmd({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="b-cmd"
      onClick={async () => {
        if (typeof navigator === "undefined" || !navigator.clipboard) return;
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <span>{">"}</span>
      <code>{children}</code>
      <em>{copied ? "[ COPIED ]" : "[ COPY ]"}</em>
    </button>
  );
}

export function BrutalLanding() {
  return (
    <main className="b-page">
      <div className="b-grain" aria-hidden="true" />

      {/* ── Header bar ── */}
      <header className="b-bar">
        <div>
          <Link href="/" className="b-brand">
            <Image src="/mark-dark.jpg" alt="" width={26} height={26} priority className="b-brand__mark" />
            ANANSI<sup>®</sup>
          </Link>
        </div>
        <div className="b-bar__meta">
          <span>REV  2.6.0</span>
          <span>UNIT  /  ANS-PRD-001</span>
          <span>CL  /  PUBLIC</span>
          <span className="b-bar__live"><i />OPERATIONAL</span>
        </div>
        <nav>
          <a href="#process">PROCESS</a>
          <a href="#manifest">MANIFEST</a>
          <a href="https://github.com/TheAlexYao/anansi" target="_blank" rel="noreferrer">SRC</a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="b-hero">
        <div className="b-hero__nums" aria-hidden="true">
          <i>01</i>
          <i>/</i>
          <i>05</i>
        </div>
        <div className="b-hero__copy">
          <p className="b-eyebrow">
            &lt; OPERATING&nbsp;MANUAL&nbsp;/&nbsp;CINEMATIC&nbsp;OUTPUT&nbsp;UNIT &gt;
          </p>
          <h1 className="b-h1">
            BRING<br />
            <span>THE&nbsp;BRIEF.</span>
          </h1>
          <h2 className="b-sub">
            ANANSI<sup>®</sup>&nbsp;WEAVES&nbsp;THE&nbsp;FILM.
          </h2>
          <hr className="b-rule b-rule--red" />
          <p className="b-lede">
            A 30-SECOND CINEMATIC FILM STAKEHOLDERS TAKE SERIOUSLY. FIVE AGENTS HANDLE REFERENCES, PALETTE, AND RENDERS. YOU KEEP THE BRIEF, THE DIRECTION, AND THE CUT.
          </p>
          <div className="b-actions">
            <Cmd>npx anansi-ai connect</Cmd>
            <Link href="/workbench?project=hinter-pitch-film" className="b-cta">
              <span>OPEN WORKBENCH</span>
              <em>{"//"}</em>
            </Link>
          </div>
          <dl className="b-spec">
            <div><dt>RUNTIMES</dt><dd>CLAUDE / HERMES / OPENCLAW / CODEX</dd></div>
            <div><dt>RENDERER</dt><dd>RUNWAY GEN-4 TURBO &rarr; GEN-4.5</dd></div>
            <div><dt>OUTPUT</dt><dd>30s · 16:9 · 9:16 · MP4</dd></div>
          </dl>
        </div>
        <div className="b-hero__film">
          <Film />
        </div>
      </section>

      <hr className="b-rule b-rule--full" />

      {/* ── Live aperture telemetry ── */}
      <section className="b-strip" aria-label="Pipeline stages">
        <LiveAperture />
        <div className="b-strip__list">
          {stages.map((s, i) => (
            <div key={s.code} className="b-strip__cell">
              <span className="b-strip__code">{s.code}</span>
              <strong>{s.name}</strong>
              <em>{s.sub}</em>
              <i aria-hidden="true" className="b-strip__bar"><b style={{ width: `${(i + 1) * 20}%` }} /></i>
            </div>
          ))}
        </div>
      </section>

      <hr className="b-rule b-rule--full" />

      {/* ── PROCESS ── */}
      <section className="b-process" id="process">
        <header className="b-section__head">
          <span className="b-section__tag">[ &nbsp;PROCESS&nbsp; ]</span>
          <h2 className="b-display">
            FIVE&nbsp;AGENTS.<br />
            ONE&nbsp;BRIEF.<br />
            <span>YOU&nbsp;STAY&nbsp;IN&nbsp;THE&nbsp;LOOP.</span>
          </h2>
          <p>ANANSI STOPS AT THREE POINTS WHERE TASTE MATTERS &mdash; DIRECTION, SCENE, FINAL CUT. EVERYTHING ELSE, THE AGENTS HANDLE: PULLING REFERENCES, WEAVING PALETTE, QUEUING RENDERS, ASSEMBLING THE TIMELINE.</p>
        </header>
        <table className="b-table" cellSpacing={0}>
          <thead>
            <tr><th>NO.</th><th>AGENT</th><th>FUNCTION</th><th>HANDOFF</th><th>OPERATOR</th></tr>
          </thead>
          <tbody>
            <tr><td>01</td><td>BRIEF</td><td>INGEST PRODUCT, FEELING, REFERENCES, AUDIENCE</td><td>JSON / MARKDOWN</td><td>USER</td></tr>
            <tr><td>02</td><td>MOOD WEAVER</td><td>SYNTHESIZE PALETTE, STILLS, VISUAL WORLD</td><td>AUTO</td><td>AGENT</td></tr>
            <tr className="is-checkpoint"><td>03</td><td>STORY WEAVER</td><td>RETURN 3 CINEMATIC DIRECTIONS w/ TONE & PACING</td><td>USER PICK</td><td><b>USER</b></td></tr>
            <tr className="is-checkpoint"><td>04</td><td>SCENE WEAVER</td><td>3 SCENES × 2 SHOT OPTIONS w/ LENS, MOTION, STRENGTH</td><td>USER PICK</td><td><b>USER</b></td></tr>
            <tr className="is-checkpoint"><td>05</td><td>RUNWAY RENDER</td><td>QUEUE VARIANTS, ASSEMBLE FINAL CUT</td><td>USER APPROVE</td><td><b>USER</b></td></tr>
          </tbody>
        </table>
      </section>

      <hr className="b-rule b-rule--full" />

      {/* ── INSTALL / TRIPTYCH ── */}
      <section className="b-tri">
        <header className="b-section__head">
          <span className="b-section__tag">[ &nbsp;PAYLOAD&nbsp; ]</span>
          <h2 className="b-display">ONE&nbsp;INSTALL.<br /><span>THREE&nbsp;DOORWAYS.</span></h2>
        </header>
        <div className="b-tri__grid">
          <article className="b-tri__cell">
            <span className="b-tri__num">/01</span>
            <h3>WORKBENCH<sup>®</sup></h3>
            <p>A CREATIVE-DIRECTOR'S DESK, NOT A SaaS WIZARD. BRIEF LEFT, MOOD UP TOP, STORY RIGHT, SCENES BRANCHING BELOW, FINAL CUT BOTTOM-RIGHT. EVERY PANEL READS FROM THE SAME PROJECT FILE.</p>
            <hr />
            <code>$ open localhost:3002</code>
          </article>
          <article className="b-tri__cell">
            <span className="b-tri__num">/02</span>
            <h3>FIVE SKILLS</h3>
            <p>FIVE MARKDOWN SKILLS INSTALL ONCE AND SYMLINK INTO EVERY AGENT RUNTIME ON YOUR MACHINE. NO NEW VENDOR. NO SECOND TOOL.</p>
            <hr />
            <code>~/.agents/skills/anansi-*</code>
          </article>
          <article className="b-tri__cell">
            <span className="b-tri__num">/03</span>
            <h3>YOUR KEY</h3>
            <p>RENDERS LIVE IN YOUR RUNWAY ACCOUNT. EXPORTS STAY ON YOUR MACHINE. ANANSI NEVER SEES THE TRAFFIC. STARTER PROJECT IS PRE-RENDERED &mdash; EXPLORE WITHOUT A KEY.</p>
            <hr />
            <code>$ export RUNWAYML_API_KEY_AUTH=…</code>
          </article>
        </div>
      </section>

      <hr className="b-rule b-rule--full" />

      {/* ── MANIFEST ── */}
      <section className="b-manifest" id="manifest">
        <header className="b-section__head">
          <span className="b-section__tag">[ &nbsp;MANIFEST&nbsp; ]</span>
          <h2 className="b-display">HOW&nbsp;ANANSI<br /><span>SEES&nbsp;THE&nbsp;WORK.</span></h2>
        </header>
        <ol className="b-manifest__list">
          <li>
            <span>.01</span>
            <h3>ANANSI IS A CREATIVE PRODUCER.</h3>
            <p>STAKEHOLDERS, CUSTOMERS, AND INVESTORS CAN SMELL AUTOMATED CONTENT. ANANSI KEEPS YOU IN THE LOOP AT THREE POINTS WHERE TASTE MATTERS: DIRECTION, SCENE, FINAL CUT. THE AGENTS WEAVE; YOU DECIDE.</p>
          </li>
          <li>
            <span>.02</span>
            <h3>COMPOSES EXISTING TOOLS. REINVENTS NONE.</h3>
            <p>FIVE SKILLS INSTALL INTO THE AGENT RUNTIME YOU ALREADY USE. RENDERS GO THROUGH YOUR RUNWAY ACCOUNT. WORKFLOW API FOR THE ROUTING; YOUR CLI FOR THE CALLS. WE SHIP THE CONDUCTOR, NOT THE ORCHESTRA.</p>
          </li>
          <li>
            <span>.03</span>
            <h3>ONE FILE. EVERY TOOL READS IT.</h3>
            <p>THE WORKBENCH READS IT. THE CLI READS IT. YOUR AGENT READS IT. NO PROPRIETARY STATE, NO LOCK-IN, NO SECRET DATABASE &mdash; OPEN THE PROJECT IN ANY EDITOR ON ANY MACHINE.</p>
          </li>
        </ol>
      </section>

      <hr className="b-rule b-rule--full" />

      {/* ── CLOSER ── */}
      <section className="b-closer">
        <h2 className="b-megatype">
          OPEN<br />THE<br /><span>BENCH.</span>
        </h2>
        <div className="b-closer__panel">
          <p>STARTER PROJECT: A REAL FUNDRAISING FILM FOR HINTER PROPERTY NO. 02. MOODBOARD, THREE DIRECTIONS, SIX SCENE OPTIONS, FINAL CUT. WALK EVERY PANEL BEFORE YOU BRING YOUR OWN RUNWAY KEY.</p>
          <div className="b-actions">
            <Cmd>npx anansi-ai connect</Cmd>
            <Link href="/workbench?project=hinter-pitch-film" className="b-cta b-cta--red">
              <span>OPEN WORKBENCH</span>
              <em>{"//"}</em>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOT ── */}
      <footer className="b-foot">
        <span>ANANSI<sup>®</sup>&nbsp; ANANSI/2026  REV 2.6</span>
        <span>BUILT FOR THE RUNWAY API HACKATHON · MAY 2026</span>
        <span>OP / YAO · MARIN · BRUKHMAN</span>
      </footer>
    </main>
  );
}
