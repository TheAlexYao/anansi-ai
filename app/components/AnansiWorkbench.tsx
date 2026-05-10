"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Circle,
  Clapperboard,
  Copy,
  Film,
  Play,
  RefreshCcw,
  Send,
  Sparkles,
  Square,
  WandSparkles,
  X,
} from "lucide-react";
import type { Project, SceneOption } from "../types/project";

type DemoStage = "brief" | "directions" | "storyboard" | "approval" | "render" | "review";

type HermesEvent = {
  id: string;
  event: "message.delta" | "tool.started" | "tool.completed" | "run.completed";
  title: string;
  body: string;
  status: "live" | "done" | "queued";
};

const stageCopy: Record<DemoStage, { eyebrow: string; title: string; body: string; action: string }> = {
  brief: {
    eyebrow: "01 / Brief intake",
    title: "Set the brief.",
    body: "Confirm the creative intent before anything is generated.",
    action: "Generate directions",
  },
  directions: {
    eyebrow: "02 / Creative directions",
    title: "Choose the route.",
    body: "Pick the direction you want Anansi to storyboard.",
    action: "Build storyboard",
  },
  storyboard: {
    eyebrow: "03 / Storyboard and shot list",
    title: "Pick the shots.",
    body: "Choose one option for each scene.",
    action: "Send for approval",
  },
  approval: {
    eyebrow: "04 / Human approval",
    title: "Approve the path.",
    body: "Lock the direction before Runway render.",
    action: "Approve direction",
  },
  render: {
    eyebrow: "05 / Runway render queue",
    title: "Render the clips.",
    body: "Approved shots move into generation.",
    action: "Review outputs",
  },
  review: {
    eyebrow: "06 / Final review",
    title: "Review the cut.",
    body: "Inspect generated media and the final direction summary.",
    action: "Restart demo",
  },
};

const stageOrder: DemoStage[] = ["brief", "directions", "storyboard", "approval", "render", "review"];

const stageLabels: Record<DemoStage, string> = {
  brief: "Brief",
  directions: "Direction",
  storyboard: "Shots",
  approval: "Approval",
  render: "Render",
  review: "Review",
};

const eventBatches: Record<DemoStage, HermesEvent[]> = {
  brief: [
    { id: "brief-1", event: "message.delta", title: "Waiting for brief", body: "Anansi is ready for product, audience, location, tone, and constraints.", status: "live" },
  ],
  directions: [
    { id: "dir-1", event: "tool.started", title: "Analyze brief", body: "Reading product, audience, references, and outcome.", status: "done" },
    { id: "dir-2", event: "message.delta", title: "Direction board", body: "Creating three cinematic routes from the same brand truth.", status: "live" },
    { id: "dir-3", event: "tool.completed", title: "Directions ready", body: "Three routes prepared for human selection.", status: "queued" },
  ],
  storyboard: [
    { id: "story-1", event: "tool.started", title: "Scene Weaver", body: "Translating approved direction into scenes and shot options.", status: "done" },
    { id: "story-2", event: "message.delta", title: "Camera language", body: "Adding lens, motion, timing, and continuity notes.", status: "live" },
    { id: "story-3", event: "tool.completed", title: "Storyboard ready", body: "Six shot options are ready for approval.", status: "queued" },
  ],
  approval: [
    { id: "app-1", event: "message.delta", title: "Approval checkpoint", body: "Waiting for Sofia to approve or request refinement.", status: "live" },
    { id: "app-2", event: "tool.completed", title: "Human decision", body: "Direction 01 and selected shot path approved.", status: "queued" },
  ],
  render: [
    { id: "ren-1", event: "tool.started", title: "Hermes prepares prompts", body: "Structuring Runway-ready tasks from the approved shot path.", status: "done" },
    { id: "ren-2", event: "message.delta", title: "Runway generation", body: "Rendering three selected clips with motion and visual constraints.", status: "live" },
    { id: "ren-3", event: "tool.completed", title: "Clips returned", body: "Generated outputs are available for review.", status: "queued" },
  ],
  review: [
    { id: "rev-1", event: "run.completed", title: "Final review ready", body: "Anansi has the direction summary, generated clips, and export state.", status: "done" },
  ],
};

function nextStage(stage: DemoStage): DemoStage {
  const current = stageOrder.indexOf(stage);
  return stageOrder[(current + 1) % stageOrder.length];
}

function stageIndex(stage: DemoStage) {
  return stageOrder.indexOf(stage);
}

function previousStages(stage: DemoStage) {
  return stageOrder.slice(0, stageIndex(stage));
}

function isVideoSrc(src?: string) {
  return Boolean(src?.match(/\.(mp4|webm|mov)$/i));
}

function MediaFrame({ src, label, tall = false, onOpen }: { src?: string; label: string; tall?: boolean; onOpen?: () => void }) {
  const isVideo = isVideoSrc(src);
  const className = `${tall ? "demo-media demo-media--tall" : "demo-media"}${onOpen ? " demo-media--clickable" : ""}`;
  const content = (
    <>
      {src && isVideo ? (
        <video src={src} muted loop playsInline autoPlay preload="metadata" aria-label={label} />
      ) : src ? (
        <Image src={src} alt={label} fill sizes="(max-width: 900px) 88vw, 36vw" />
      ) : null}
      <span>{label}</span>
      {onOpen ? <b className="demo-media-open">Click to view</b> : null}
    </>
  );

  if (onOpen) {
    return (
      <button type="button" className={className} onClick={(event) => { event.stopPropagation(); onOpen(); }}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

function VideoLightbox({ media, onClose }: { media: { src: string; label: string } | null; onClose: () => void }) {
  useEffect(() => {
    if (!media) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div className="demo-lightbox" role="dialog" aria-modal="true" aria-label={media.label} onClick={onClose}>
      <div className="demo-lightbox-inner" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose}>Close</button>
        {isVideoSrc(media.src) ? (
          <video src={media.src} controls autoPlay playsInline />
        ) : (
          <Image src={media.src} alt={media.label} width={1280} height={720} />
        )}
        <span>{media.label}</span>
      </div>
    </div>
  );
}

function StatusGlyph({ status }: { status: HermesEvent["status"] }) {
  if (status === "done") return <Check aria-hidden="true" />;
  if (status === "live") return <Sparkles aria-hidden="true" />;
  return <Circle aria-hidden="true" />;
}

function activityLabel(event: HermesEvent["event"]) {
  if (event === "tool.started") return "Working";
  if (event === "tool.completed") return "Ready";
  if (event === "run.completed") return "Complete";
  return "Thinking";
}

function ActivityRail({ events }: { events: HermesEvent[] }) {
  return (
    <aside className="demo-activity">
      <span>Activity</span>
      <div className="demo-event-list" aria-live="polite">
        {events.map((item) => (
          <article className={`demo-event demo-event--${item.status}`} key={item.id}>
            <i><StatusGlyph status={item.status} /></i>
            <div>
              <span>{activityLabel(item.event)}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

function BriefComposer({ project }: { project: Project }) {
  return (
    <section className="demo-card demo-card--brief demo-brief">
      <div className="brief-desk">
        <div className="brief-sheet">
          <header>
            <span>Brand/product brief</span>
            <button><Copy size={15} /> Import</button>
          </header>
          <label>
            Product
            <textarea defaultValue={`${project.brief.product}\n\nA cinematic fundraising film for a design-forward property launch.`} />
          </label>
          <div className="demo-field-grid">
            <label>Audience<input defaultValue="Investors, guests, creative partners" /></label>
            <label>Location<input defaultValue="Forest property, twilight interiors" /></label>
            <label>Tone<input defaultValue={project.brief.feeling} /></label>
            <label>Outcome<input defaultValue="30s approval-ready brand film" /></label>
          </div>
        </div>
        <aside className="brief-intent">
          <span>Producer intent</span>
          <h2>Creative intent before generation.</h2>
          <p>References become constraints for pacing, palette, framing, and emotional temperature.</p>
          <div className="brief-intent-grid">
            <div><b>{project.brief.reference_weight}%</b><small>reference weight</small></div>
            <div><b>{project.brief.story_tension}%</b><small>story tension</small></div>
          </div>
          <div className="brief-intent-note">Human approval stays on before Runway render.</div>
        </aside>
      </div>
      <div className="demo-reference-row">
        {project.mood.tiles.filter((tile) => tile.kind === "image").slice(0, 3).map((tile) => (
          <MediaFrame key={tile.label} src={tile.src} label={tile.label} />
        ))}
      </div>
    </section>
  );
}

function DirectionBoard({ project, selectedDirection, setSelectedDirection }: { project: Project; selectedDirection: string; setSelectedDirection: (id: string) => void }) {
  const active = project.directions.find((direction) => direction.id === selectedDirection) ?? project.directions[0];
  const images = project.mood.tiles.filter((tile) => tile.kind === "image");
  return (
    <section className="demo-card demo-card--directions demo-directions">
      <header>
        <span>Creative direction options</span>
        <b>Human chooses one</b>
      </header>
      <div className="direction-feature">
        <MediaFrame src={images[0]?.src} label={active.title} tall />
        <div>
          <span>Selected route {active.id}</span>
          <h2>{active.title}</h2>
          <p>{active.body}</p>
          <ul>
            <li>Visual world: cedar, mist, glass, low interior warmth</li>
            <li>Camera: slow push, held frames, quiet reveal</li>
            <li>Outcome: premium stakeholder film, not social filler</li>
          </ul>
        </div>
      </div>
      <div className="demo-direction-grid">
        {project.directions.map((direction, index) => (
          <button className={direction.id === selectedDirection ? "demo-direction is-selected" : "demo-direction"} key={direction.id} onClick={() => setSelectedDirection(direction.id)}>
            <MediaFrame src={images[index + 1]?.src ?? images[index]?.src} label={direction.tone} />
            <span>{direction.id}</span>
            <strong>{direction.title}</strong>
            <p>{direction.body}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function Storyboard({ project, selected, setSelected, openMedia }: { project: Project; selected: Record<string, string>; setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>>; openMedia: (media: { src: string; label: string }) => void }) {
  return (
    <section className="demo-card demo-card--storyboard demo-storyboard">
      <header>
        <span>Storyboard / shot list</span>
        <b>2 options per scene</b>
      </header>
      <div className="storyboard-strip">
        {project.scenes.map((scene) => {
          const chosen = scene.options.find((option) => option.id === selected[scene.label]) ?? scene.options[0];
          return (
            <article key={scene.id}>
              <MediaFrame src={chosen.src} label={chosen.title} onOpen={() => openMedia({ src: chosen.src, label: chosen.title })} />
              <span>{scene.time}</span>
              <strong>{scene.label}: {chosen.title}</strong>
              <p>{chosen.lens} / {chosen.motion}</p>
            </article>
          );
        })}
      </div>
      <div className="demo-scene-list">
        {project.scenes.map((scene) => (
          <article key={scene.id}>
            <header>
              <span>{scene.label}</span>
              <b>{scene.time}</b>
            </header>
            <div>
              {scene.options.map((option) => (
                <button className={selected[scene.label] === option.id ? "demo-shot is-selected" : "demo-shot"} key={option.id} onClick={() => setSelected((current) => ({ ...current, [scene.label]: option.id }))}>
                  <MediaFrame src={option.src} label={option.title} onOpen={() => openMedia({ src: option.src, label: option.title })} />
                  <strong>{option.id} · {option.title}</strong>
                  <p>{option.lens} · {option.motion} · {option.duration}</p>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApprovalPanel({ approved, selectedPath, setApproved }: { approved: boolean; selectedPath: SceneOption[]; setApproved: (approved: boolean) => void }) {
  return (
    <section className="demo-card demo-card--approval demo-approval">
      <header>
        <span>Approval checkpoint</span>
        <b>Producer remains in control</b>
      </header>
      <div className="approval-stage">
        <div>
          <div className="demo-people">
            <Image src="/generated/profiles/anansi-approval/sofia-delgado.png" alt="Sofia Delgado" width={54} height={54} />
            <Image src="/generated/profiles/anansi-approval/marcus-chen.png" alt="Marcus Chen" width={54} height={54} />
            <Image src="/generated/profiles/anansi-approval/amara-okafor.png" alt="Amara Okafor" width={54} height={54} />
            <Image src="/generated/profiles/anansi-approval/theo-laurent.png" alt="Theo Laurent" width={54} height={54} />
          </div>
          <blockquote>“This is the route. Keep the pacing quiet, but make the property feel inevitable.”</blockquote>
          <div className="demo-approval-actions">
            <button className={approved ? "is-primary is-confirmed" : "is-primary"} onClick={() => setApproved(true)}>
              <BadgeCheck size={18} /> {approved ? "Approved" : "Approve"}
            </button>
            <button><RefreshCcw size={18} /> Refine</button>
            <button><WandSparkles size={18} /> Regenerate</button>
            <button onClick={() => setApproved(false)}><X size={18} /> Reject</button>
          </div>
        </div>
        <aside>
          <span>Approved path</span>
          <div className="demo-approved-path">
            {selectedPath.map((shot) => <b key={shot.id}>{shot.id}</b>)}
          </div>
          {selectedPath.map((shot) => (
            <p key={shot.id}><strong>{shot.id}</strong>{shot.title}</p>
          ))}
        </aside>
      </div>
    </section>
  );
}

function RenderQueue({ selectedPath, active, openMedia }: { selectedPath: SceneOption[]; active: boolean; openMedia: (media: { src: string; label: string }) => void }) {
  return (
    <section className="demo-card demo-card--render demo-render">
      <header>
        <span>Runway generation</span>
        <b>{active ? "Rendering via approved prompts" : "Locked until approval"}</b>
      </header>
      <div className="render-command">
        <span>Hermes handoff</span>
        <code>approved_shots → prompt_tasks → runway_queue</code>
      </div>
      <div className="demo-render-grid">
        {selectedPath.map((shot, index) => (
          <article className={active ? "demo-render-card is-active" : "demo-render-card"} key={shot.id}>
            <MediaFrame src={shot.src} label={shot.title} onOpen={() => openMedia({ src: shot.src, label: shot.title })} />
            <div>
              <span>Shot {shot.id}</span>
              <strong>{shot.motion}</strong>
              <p>{active ? `Runway task ${index + 1} · ${index === 2 ? "complete" : "rendering"}` : "Waiting for approval"}</p>
            </div>
            <i style={{ width: active ? `${58 + index * 18}%` : "8%" }} />
          </article>
        ))}
      </div>
      <footer>
        <code>runway-pp-cli image-to-video create --agent --json</code>
      </footer>
    </section>
  );
}

function FinalReview({ project, selectedPath }: { project: Project; selectedPath: SceneOption[] }) {
  return (
    <section className="demo-card demo-card--final demo-final">
      <div className="demo-final-film">
        <MediaFrame src={project.output.poster_src} label={project.output.title} tall />
        <button aria-label="Play final film"><Play size={24} fill="currentColor" /></button>
        <footer>
          <span>FINAL FILM</span>
          <b>{project.output.duration}</b>
          <em>{project.output.format_label}</em>
        </footer>
      </div>
      <div className="demo-review-notes">
        <span>Review notes</span>
        <h3>Cinematic. Intentional. On brand.</h3>
        <p>Approved direction, selected shot path, Runway-ready prompts, and generated clips are now visible in the workbench. Final output drops into <code>/generated/runway/anansi/final-output.mp4</code>.</p>
        <div>
          {selectedPath.map((shot) => <MediaFrame key={shot.id} src={shot.src} label={shot.title} />)}
        </div>
      </div>
    </section>
  );
}

export function AnansiWorkbench({ project }: { project: Project }) {
  const [stage, setStage] = useState<DemoStage>("brief");
  const [selectedDirection, setSelectedDirection] = useState(project.selected_direction);
  const [selected, setSelected] = useState<Record<string, string>>(project.selected_scenes);
  const [approved, setApproved] = useState(false);
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState<{ src: string; label: string } | null>(null);

  const selectedPath = useMemo(
    () => project.scenes.map((scene) => scene.options.find((option) => option.id === selected[scene.label]) ?? scene.options[0]),
    [selected, project.scenes]
  );

  const index = stageIndex(stage);
  const activeCopy = stageCopy[stage];
  const selectedCount = project.scenes.filter((scene) => selected[scene.label]).length;
  const allShotsSelected = selectedCount === project.scenes.length;
  const canAdvance =
    stage === "brief" ||
    (stage === "directions" && Boolean(selectedDirection)) ||
    (stage === "storyboard" && allShotsSelected) ||
    (stage === "approval" && approved) ||
    stage === "render" ||
    stage === "review";
  const blocker =
    stage === "directions" && !selectedDirection
      ? "Choose a direction first"
      : stage === "storyboard" && !allShotsSelected
        ? `Choose ${project.scenes.length - selectedCount} more shot${project.scenes.length - selectedCount === 1 ? "" : "s"}`
        : stage === "approval" && !approved
          ? "Approve the shot path first"
          : "";
  const primaryAction =
    stage === "approval"
      ? approved ? activeCopy.action : "Approve for Runway"
      : activeCopy.action;

  function advance() {
    if (stage === "review") {
      setStage("brief");
      setMaxUnlockedIndex(0);
      setApproved(false);
      return;
    }
    if (stage === "approval" && !approved) {
      setApproved(true);
      return;
    }
    if (!canAdvance) return;
    const next = nextStage(stage);
    const nextIndex = stageIndex(next);
    setMaxUnlockedIndex((current) => Math.max(current, nextIndex));
    setStage(next);
  }

  return (
    <main className={`demo-workbench demo-workbench--${stage}`}>
      <header className="demo-topbar">
        <Link href="/" className="demo-brand">
          <Image src="/anansi-spider-mark.png" alt="" width={34} height={34} />
          <span>Anansi</span>
        </Link>
        <nav aria-label="Demo stages">
          {stageOrder.map((item, itemIndex) => (
            <button
              className={item === stage ? "is-active" : itemIndex < index ? "is-complete" : itemIndex > maxUnlockedIndex ? "is-locked" : ""}
              disabled={itemIndex > maxUnlockedIndex}
              key={item}
              onClick={() => setStage(item)}
            >
              {itemIndex < index ? <Check size={14} /> : <Square size={12} />}
              {stageLabels[item]}
            </button>
          ))}
        </nav>
        <button className="demo-topbar-action" disabled={!canAdvance && !(stage === "approval" && !approved)} onClick={advance}>
          {primaryAction}
          <ArrowRight size={17} />
        </button>
      </header>

      <section className="demo-stage-frame">
        <aside className="demo-hero">
          <div>
            <span>{activeCopy.eyebrow}</span>
            <h1>{activeCopy.title}</h1>
            <p>{activeCopy.body}</p>
          </div>
          {previousStages(stage).length ? (
            <div className="demo-decision-summary">
              <span>Selected</span>
              {previousStages(stage).includes("directions") ? <p><b>Direction</b>{project.directions.find((item) => item.id === selectedDirection)?.title}</p> : null}
              {previousStages(stage).includes("storyboard") ? <p><b>Shots</b>{selectedPath.map((shot) => shot.id).join(" / ")}</p> : null}
              {previousStages(stage).includes("approval") ? <p><b>Approval</b>{approved ? "Approved for Runway" : "Pending"}</p> : null}
            </div>
          ) : null}
          <div className="demo-stage-meter">
            <i style={{ width: `${((index + 1) / stageOrder.length) * 100}%` }} />
          </div>
          <ActivityRail events={eventBatches[stage]} />
        </aside>

        <section className="demo-layout">
          <div className="demo-main">
            {stage === "brief" ? <BriefComposer project={project} /> : null}
            {stage === "directions" ? <DirectionBoard project={project} selectedDirection={selectedDirection} setSelectedDirection={setSelectedDirection} /> : null}
            {stage === "storyboard" ? <Storyboard project={project} selected={selected} setSelected={setSelected} openMedia={setLightboxMedia} /> : null}
            {stage === "approval" ? <ApprovalPanel approved={approved} selectedPath={selectedPath} setApproved={setApproved} /> : null}
            {stage === "render" ? <RenderQueue selectedPath={selectedPath} active openMedia={setLightboxMedia} /> : null}
            {stage === "review" ? <FinalReview project={project} selectedPath={selectedPath} /> : null}
          </div>
        </section>
      </section>

      <VideoLightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />

      <footer className="demo-footer">
        <span><Clapperboard size={16} /> Public Anansi product</span>
        <ChevronRight size={15} />
        <span><Sparkles size={16} /> Hermes workflow events</span>
        <ChevronRight size={15} />
        <span><Film size={16} /> Runway generation</span>
        {blocker ? <em>{blocker}</em> : null}
        <button disabled={!canAdvance && !(stage === "approval" && !approved)} onClick={advance}><Send size={16} /> {primaryAction}</button>
      </footer>
    </main>
  );
}
