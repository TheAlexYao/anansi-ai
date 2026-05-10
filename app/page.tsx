"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  LayoutGrid,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { InstallPopup } from "./components/InstallPopup";

const heroImages = {
  finalVideo: "/generated/runway/anansi/final-output.mp4",
  residence: "/generated/runway/anansi/direction-selected-route-1.png",
  exterior: "/generated/runway/anansi/brief-path-through-cedars.png",
  interior: "/generated/runway/anansi/brief-rain-on-glass.png",
  material: "/generated/runway/anansi/brief-cabin-at-first-light.png",
  lounge: "/generated/runway/anansi/direction-01.png",
  skyline: "/generated/runway/anansi/direction-03.png",
  storyboardOne: "/generated/runway/anansi/brief-cabin-at-first-light.png",
  storyboardTwo: "/generated/runway/anansi/brief-rain-on-glass.png",
  storyboardThree: "/generated/runway/anansi/brief-path-through-cedars.png",
};

const swatches = ["#2b231d", "#8f7a68", "#b7c6c7", "#171627", "#455244"];

const tasks: Array<[string, string, boolean]> = [
  ["Parse brief", "Complete", true],
  ["Route agent skills", "Complete", true],
  ["Prepare shot options", "Complete", true],
  ["Approve render path", "Complete", true],
  ["Send to Runway", "Ready", false],
];

function ArrowIcon() {
  return <ArrowRight aria-hidden="true" />;
}

function PlayIcon() {
  return <Play aria-hidden="true" />;
}

function PanelIcon({ type }: { type: "file" | "grid" | "briefcase" | "shield" | "hermes" | "runway" }) {
  const icons = {
    file: FileText,
    grid: LayoutGrid,
    briefcase: BriefcaseBusiness,
    shield: ShieldCheck,
  };
  const Icon = type in icons ? icons[type as keyof typeof icons] : null;

  if (type === "hermes") {
    return (
      <span className="hermes-mark" aria-label="Hermes">
        <span className="brand-icon-image" />
        <Sparkles aria-hidden="true" />
      </span>
    );
  }

  if (type === "runway") {
    return (
      <span className="runway-mark" aria-label="Runway">
        <span className="brand-icon-image" />
        <span>R</span>
      </span>
    );
  }

  return Icon ? <Icon aria-hidden="true" className="panel-icon" /> : null;
}

function FlowArrow() {
  return (
    <div className="flow-arrow" aria-hidden="true">
      <ArrowIcon />
    </div>
  );
}

function ImageTile({ src, label, large = false }: { src: string; label?: string; large?: boolean }) {
  return (
    <div className={large ? "image-tile image-tile-large" : "image-tile"} style={{ "--tile-image": `url(${src})` } as CSSProperties}>
      {label && <span>{label}</span>}
    </div>
  );
}

function PlayTile({ src }: { src: string }) {
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");

  return (
    <div className="play-tile" style={{ "--tile-image": `url(${src})` } as CSSProperties}>
      {isVideo ? <video src={src} muted loop playsInline autoPlay preload="metadata" /> : null}
      <button aria-label="Play clip">
        <PlayIcon />
      </button>
    </div>
  );
}

export default function Home() {
  const [installOpen, setInstallOpen] = useState(false);

  return (
    <main className="clone-page">
      <section className="hero-clone" aria-labelledby="hero-title">
        <header className="clone-nav">
          <a href="#" className="logo" aria-label="Anansi home">Anansi</a>
          <nav aria-label="Primary">
            <a href="#product">Product</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <a href="#resources">Resources</a>
          </nav>
          <div className="nav-actions">
            <button type="button" className="login-link install-link" onClick={() => setInstallOpen(true)}>Install locally</button>
            <Link href="/workbench?project=hinter-pitch-film" className="cta-button">Open workbench <ArrowIcon /></Link>
          </div>
        </header>

        <div className="hero-frame" aria-hidden="true">
          <span className="frame-spark frame-spark-left" />
          <span className="frame-spark frame-spark-right" />
        </div>

        <div className="hero-heading">
          <h1 id="hero-title">Anansi</h1>
          <p className="hero-kicker">The creative orchestration layer for AI video.</p>
          <p className="hero-subcopy">Runway is the generation engine. Hermes runs the agents. Anansi coordinates the work from brief to approved render.</p>
        </div>

        <div className="workflow-stage" aria-label="Anansi workflow preview">
          <article className="workflow-card brief-card">
            <div className="card-top">
              <span>01</span><b>Brief</b>
              <PanelIcon type="file" />
            </div>
            <h2>Hinter pitch<br />film</h2>
            <p>A 30-second cinematic property film with mood, direction, shot options, approval, and Runway handoff.</p>
            <div className="tag-row">
              <span>Runway</span><span>Hermes</span><span>GPT-image-2</span><span>30s</span><span>16:9</span>
            </div>
            <div className="person-row">
              <div className="avatar avatar-one" />
              <div><b>Sofia Delgado</b><span>Creative Lead</span></div>
            </div>
          </article>

          <FlowArrow />

          <article className="workflow-card board-card">
            <div className="card-top">
              <span>02</span><b>Mood + direction</b>
              <PanelIcon type="grid" />
            </div>
            <div className="board-grid">
              <ImageTile src={heroImages.exterior} />
              <ImageTile src={heroImages.material} />
              <ImageTile src={heroImages.interior} />
              <ImageTile src={heroImages.lounge} />
            </div>
            <div className="swatches">
              {swatches.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
            </div>
            <p>Visual language before credits get spent.</p>
          </article>

          <FlowArrow />

          <article className="workflow-card storyboard-card">
            <div className="card-top">
              <span>03</span><b>Storyboard</b>
              <PanelIcon type="briefcase" />
            </div>
            {[
              ["01", "Hook", "Cabin at first light. Quiet entry into the world.", heroImages.storyboardOne],
              ["02", "Turn", "Rain on glass. Interior emotion and material detail.", heroImages.storyboardTwo],
              ["03", "Memory", "Path through cedars. The property becomes inevitable.", heroImages.storyboardThree],
            ].map(([num, title, copy, src]) => (
              <div className="story-row" key={num}>
                <ImageTile src={src} />
                <div><span>{num}</span><b>{title}</b><p>{copy}</p></div>
              </div>
            ))}
          </article>

          <FlowArrow />

          <article className="workflow-card approval-card">
            <div className="card-top">
              <span>04</span><b>Approval</b>
              <PanelIcon type="shield" />
            </div>
            <div className="approval-avatars">
              <div className="avatar avatar-sofia" />
              <div className="avatar avatar-marcus" />
              <div className="avatar avatar-amara" />
              <div className="avatar avatar-theo" />
            </div>
            <div className="approved-badge"><BadgeCheck aria-hidden="true" />Approved</div>
            <blockquote>“This is the route.<br />Send these shots to render.”</blockquote>
            <cite>— Producer approval</cite>
          </article>

          <FlowArrow />

          <article className="workflow-card tasks-card">
            <div className="card-top">
              <span>05</span><b>Hermes — Agent run</b>
              <PanelIcon type="hermes" />
            </div>
            <div className="task-list">
              {tasks.map(([label, status, done]) => (
                <div className="task-item" key={label}>
                  <span className={done ? "task-dot complete" : "task-dot"}>{done ? "✓" : ""}</span>
                  <b>{label}</b>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </article>

          <div className="dashed-link" aria-hidden="true" />

          <article className="workflow-card runway-card">
            <div className="card-top">
              <span>06</span><b>Runway — Render queue</b>
              <PanelIcon type="runway" />
            </div>
            <div className="node-chart">
              <span>Shot 1A<br /><em>Cabin at first light</em></span>
              <div>
                <span>Shot 2A<br /><em>Rain on glass</em></span>
                <span>Shot 2B<br /><em>Firepit catching</em></span>
              </div>
              <span>Shot 3B<br /><em>Stillness on deck</em></span>
            </div>
            <div className="generating">Generating… <i /></div>
          </article>
        </div>

        <div className="media-row media-row-left">
          <PlayTile src={heroImages.exterior} />
          <PlayTile src={heroImages.interior} />
          <PlayTile src={heroImages.material} />
        </div>

        <div className="video-dash video-dash-left" aria-hidden="true" />

        <div className="final-film" style={{ "--tile-image": `url(${heroImages.residence})` } as CSSProperties}>
          <video src={heroImages.finalVideo} muted loop playsInline autoPlay preload="metadata" />
          <div className="film-toolbar">
            <span>07</span><b>Final output</b>
            <em>0:30</em><i>16:9</i>
          </div>
        </div>

        <div className="video-dash video-dash-right" aria-hidden="true" />

        <div className="media-row media-row-right">
          <PlayTile src={heroImages.lounge} />
          <PlayTile src={heroImages.skyline} />
          <PlayTile src={heroImages.finalVideo} />
        </div>

        <footer className="hero-footer">
          <div className="footer-brand">
            <span className="footer-mark" />
            <p>From brief to approved render,<br />Anansi keeps the creative process human-led.</p>
          </div>
          <p className="brand-line">Memory. Taste. Approval. Handoff.</p>
          <div className="footer-cta">
            <span>Open the live workbench.</span>
            <Link href="/workbench?project=hinter-pitch-film" className="cta-button">Open workbench <ArrowIcon /></Link>
            <button type="button" className="cta-button cta-button-secondary" onClick={() => setInstallOpen(true)}>Install locally <ArrowIcon /></button>
          </div>
        </footer>
      </section>
      <InstallPopup open={installOpen} onClose={() => setInstallOpen(false)} />
    </main>
  );
}
