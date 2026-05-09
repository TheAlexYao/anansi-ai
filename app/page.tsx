import type { CSSProperties } from "react";
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

const heroImages = {
  residence: "/generated/runway/hinter-pitch-film/cabin-dawn.jpg",
  exterior: "/generated/runway/hinter-pitch-film/forest-path.jpg",
  interior: "/generated/runway/hinter-pitch-film/window-rain.jpg",
  material: "/generated/runway/hinter-pitch-film/firepit-evening.jpg",
  lounge: "/generated/runway/hinter-pitch-film/cabin-dawn.jpg",
  skyline: "/generated/runway/hinter-pitch-film/forest-path.jpg",
  storyboardOne: "/generated/runway/hinter-pitch-film/cabin-dawn.jpg",
  storyboardTwo: "/generated/runway/hinter-pitch-film/window-rain.jpg",
  storyboardThree: "/generated/runway/hinter-pitch-film/firepit-evening.jpg",
};

const swatches = ["#33213d", "#9f7d79", "#8eb8df", "#171627", "#0d6068"];

const tasks: Array<[string, string, boolean]> = [
  ["Analyze brief", "Complete", true],
  ["Build direction board", "Complete", true],
  ["Write shots & prompts", "Complete", true],
  ["Plan camera & motion", "Complete", true],
  ["Prepare assets", "", false],
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
  return (
    <div className="play-tile" style={{ "--tile-image": `url(${src})` } as CSSProperties}>
      <button aria-label="Play clip">
        <PlayIcon />
      </button>
    </div>
  );
}

export default function Home() {
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
            <a href="#login" className="login-link">Log in</a>
            <Link href="/2" className="cta-button">Get started <ArrowIcon /></Link>
          </div>
        </header>

        <div className="hero-frame" aria-hidden="true">
          <span className="frame-spark frame-spark-left" />
          <span className="frame-spark frame-spark-right" />
        </div>

        <div className="hero-heading">
          <h1 id="hero-title">Anansi</h1>
          <p className="hero-kicker">Creative direction, kept human.</p>
          <p className="hero-subcopy">From brief to final frame. One intelligent workflow <br />for cinematic generated media.</p>
        </div>

        <div className="workflow-stage" aria-label="Anansi workflow preview">
          <article className="workflow-card brief-card">
            <div className="card-top">
              <span>01</span><b>Brief</b>
              <PanelIcon type="file" />
            </div>
            <h2>Luxury real-estate<br />brand film</h2>
            <p>A cinematic brand film that captures timeless architecture, elevated living, and a sense of calm aspiration.</p>
            <div className="tag-row">
              <span>Brand Film</span><span>Luxury</span><span>Cinematic</span><span>2-3 min</span><span>16:9</span>
            </div>
            <div className="person-row">
              <div className="avatar avatar-one" />
              <div><b>Sofia Delgado</b><span>Creative Lead</span></div>
            </div>
          </article>

          <FlowArrow />

          <article className="workflow-card board-card">
            <div className="card-top">
              <span>02</span><b>Direction board</b>
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
            <p>Mood. Tone. Story. Style.</p>
          </article>

          <FlowArrow />

          <article className="workflow-card storyboard-card">
            <div className="card-top">
              <span>03</span><b>Storyboard</b>
              <PanelIcon type="briefcase" />
            </div>
            {[
              ["01", "Arrival", "Dusk. Wide establishing shot of the property.", heroImages.storyboardOne],
              ["02", "Experience", "Intimate moments that evoke calm and clarity.", heroImages.storyboardTwo],
              ["03", "Aspiration", "The view. The lifestyle. The promise.", heroImages.storyboardThree],
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
            <blockquote>“This is exactly the feeling<br />we want to create.”</blockquote>
            <cite>— Marketing Director</cite>
          </article>

          <FlowArrow />

          <article className="workflow-card tasks-card">
            <div className="card-top">
              <span>05</span><b>Hermes — Tasks</b>
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
              <span>06</span><b>Runway — Generate</b>
              <PanelIcon type="runway" />
            </div>
            <div className="node-chart">
              <span>Shot 01<br /><em>Establishing Wide</em></span>
              <div>
                <span>Shot 02A<br /><em>Interior Detail</em></span>
                <span>Shot 02B<br /><em>Living Moment</em></span>
              </div>
              <span>Shot 03<br /><em>View & Lifestyle</em></span>
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
          <div className="film-toolbar">
            <span>07</span><b>Final film</b>
            <em>2:17</em><i>4K</i>
          </div>
        </div>

        <div className="video-dash video-dash-right" aria-hidden="true" />

        <div className="media-row media-row-right">
          <PlayTile src={heroImages.lounge} />
          <PlayTile src={heroImages.skyline} />
          <PlayTile src={heroImages.residence} />
        </div>

        <footer className="hero-footer">
          <div className="footer-brand">
            <span className="footer-mark" />
            <p>Anansi orchestrates the creative process<br />so you can focus on what matters: the story.</p>
          </div>
          <p className="brand-line">Cinematic. Intentional. On brand.</p>
          <div className="footer-cta">
            <span>Bring your next vision to life.</span>
            <Link href="/2" className="cta-button">Get started <ArrowIcon /></Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
