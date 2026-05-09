"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Handle, Position, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { MoodTile, PaletteSwatch, Project, SceneOption } from "../types/project";

const nav = ["Home", "Projects", "Briefs", "Mood", "Scenes", "Edit", "Exports"];
const library = ["Assets", "References", "Brand Kit", "Settings"];

function Icon({ name }: { name: string }) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

function MediaTile({ src, label, className }: { src?: string; label?: string; className?: string }) {
  const classes = ["mediaTile", className, src ? "hasImage" : "mediaTile-fallback"].filter(Boolean).join(" ");
  return (
    <div className={classes} aria-label={label}>
      {src ? <Image src={src} alt={label ?? ""} fill sizes="(max-width: 760px) 92vw, (max-width: 1180px) 44vw, 34vw" /> : null}
      <span />
      <i />
      <b />
    </div>
  );
}

function PaletteTile({ palette }: { palette: PaletteSwatch[] }) {
  return (
    <div className="mediaTile paletteTile">
      {palette.map((swatch) => (
        <div className="swatchRow" key={swatch.name}>
          <span>{swatch.name}</span>
          <i style={{ ["--swatch" as string]: swatch.hex }} />
        </div>
      ))}
    </div>
  );
}

function SketchTile({ themes }: { themes: string[] }) {
  return (
    <div className="mediaTile sketchTile">
      <div className="sketchFrame" />
      <div className="sketchPerson" />
      <p>
        {themes.map((line, index) => (
          <span key={line}>
            {line}
            {index < themes.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    </div>
  );
}

function MoodTileRender({ tile, palette, themes }: { tile: MoodTile; palette: PaletteSwatch[]; themes: string[] }) {
  if (tile.kind === "palette") return <PaletteTile palette={palette} />;
  if (tile.kind === "sketch") return <SketchTile themes={themes} />;
  return <MediaTile src={tile.src} label={tile.label} />;
}

function Strength({ value }: { value: string }) {
  return <span className="strength"><i style={{ width: `${Number(value) * 100}%` }} /></span>;
}

function SceneNode() {
  return (
    <span className="flowPort">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </span>
  );
}

function BranchNode() {
  return (
    <span className="flowBranch">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      +
    </span>
  );
}

const sceneNodeTypes = {
  port: SceneNode,
  branch: BranchNode
};

const sceneFlowNodes: Node[] = [
  { id: "1AOut", type: "port", position: { x: 235, y: 34 }, data: {} },
  { id: "1BOut", type: "port", position: { x: 235, y: 122 }, data: {} },
  { id: "J1", type: "branch", position: { x: 257, y: 70 }, data: {} },
  { id: "2AIn", type: "port", position: { x: 280, y: 34 }, data: {} },
  { id: "2BIn", type: "port", position: { x: 280, y: 122 }, data: {} },
  { id: "2AOut", type: "port", position: { x: 512, y: 34 }, data: {} },
  { id: "2BOut", type: "port", position: { x: 512, y: 122 }, data: {} },
  { id: "J2", type: "branch", position: { x: 534, y: 70 }, data: {} },
  { id: "3AIn", type: "port", position: { x: 557, y: 34 }, data: {} },
  { id: "3BIn", type: "port", position: { x: 557, y: 122 }, data: {} }
];

const sceneFlowEdges: Edge[] = [
  { id: "1A-J1", source: "1AOut", target: "J1", type: "straight", className: "selectedEdge" },
  { id: "1B-J1", source: "1BOut", target: "J1", type: "straight", className: "alternateEdge" },
  { id: "J1-2A", source: "J1", target: "2AIn", type: "straight", className: "alternateEdge" },
  { id: "J1-2B", source: "J1", target: "2BIn", type: "straight", className: "selectedEdge" },
  { id: "2A-J2", source: "2AOut", target: "J2", type: "straight", className: "alternateEdge" },
  { id: "2B-J2", source: "2BOut", target: "J2", type: "straight", className: "selectedEdge" },
  { id: "J2-3A", source: "J2", target: "3AIn", type: "straight", className: "alternateEdge" },
  { id: "J2-3B", source: "J2", target: "3BIn", type: "straight", className: "selectedEdge" }
].map((edge) => ({
  ...edge,
  focusable: false
}));

function Sidebar() {
  return (
    <aside className="rail">
      <Link href="/" className="brandLockup" aria-label="Anansi home"><Image src="/mark-light.jpg" alt="" width={28} height={28} priority className="brandLockup__mark" />ANANSI</Link>
      <nav className="navGroup" aria-label="Main sections">
        {nav.map((item) => <a className={item === "Mood" ? "navItem active" : "navItem"} href="#" key={item}><Icon name={item.toLowerCase()} />{item}</a>)}
      </nav>
      <nav className="navGroup utility" aria-label="Project library">
        {library.map((item) => <a className="navItem" href="#" key={item}><Icon name={item.toLowerCase().replace(" ", "-")} />{item}</a>)}
      </nav>
      <div className="operator"><span /> <div><strong>Adrian Okoro</strong><small>Studio Black Thread</small></div><Icon name="chevron" /></div>
    </aside>
  );
}

function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>Projects</span><b>/</b><button>{title} <Icon name="chevron" /></button></div>
      <nav className="tabs" aria-label="Workflow">
        {["Brief", "Mood", "Scenes", "Edit"].map((tab) => <a className={tab === "Brief" ? "selected" : ""} href="#" key={tab}>{tab}</a>)}
      </nav>
      <div className="actions"><button aria-label="Undo"><Icon name="undo" /></button><button aria-label="Redo"><Icon name="redo" /></button><button><Icon name="share" />Share</button><button className="export">Export</button></div>
    </header>
  );
}

function BriefPanel({ project }: { project: Project }) {
  const { brief } = project;
  const referenceLines = brief.reference.split(/\s*\+\s*/);
  return (
    <section className="briefPanel panel">
      <header><h2>BRIEF</h2><button>Edit</button></header>
      <dl>
        <div><dt>Product</dt><dd>{brief.product}</dd></div>
        <div><dt>Feeling</dt><dd>{brief.feeling}</dd></div>
        <div><dt>Reference</dt><dd>{referenceLines.map((line, index) => (
          <span key={line}>{line}{index < referenceLines.length - 1 ? <br /> : null}</span>
        ))}</dd></div>
      </dl>
      <div className="controlStack">
        <label><span>Reference weight</span><b>{brief.reference_weight}%</b></label>
        <div className="range"><i style={{ width: `${brief.reference_weight}%` }} /></div>
        <label><span>Story tension</span><b>{brief.story_tension}%</b></label>
        <div className="range"><i style={{ width: `${brief.story_tension}%` }} /></div>
      </div>
      <div className="toggleRow"><span>Human approval</span><b>{brief.human_approval ? "On" : "Off"}</b><button aria-label={`Human approval ${brief.human_approval ? "on" : "off"}`}><i /></button></div>
    </section>
  );
}

function MoodPanel({ project }: { project: Project }) {
  const { mood } = project;
  return (
    <section className="moodPanel panel">
      <header className="sectionHeader">
        <div><h1>{mood.title} <span>i</span></h1><p>{mood.subtitle}</p></div>
        <div className="viewTools"><Icon name="grid" /><Icon name="sliders" /><button><Icon name="plus" />Add reference</button></div>
      </header>
      <div className="moodBoard">
        {mood.tiles.map((tile, index) => (
          <MoodTileRender key={index} tile={tile} palette={mood.palette} themes={mood.themes} />
        ))}
      </div>
    </section>
  );
}

function StoryPanel({ project, direction, setDirection }: { project: Project; direction: string; setDirection: (direction: string) => void }) {
  const activeDirection = project.directions.find((item) => item.id === direction) ?? project.directions[0];
  return (
    <aside className="storyPanel panel">
      <header><h2>STORY WEAVER</h2><span>AI co-producer</span></header>
      <p>I’ve woven your brief and references into three cinematic directions.</p>
      <div className="directionList">
        {project.directions.map((item) => (
          <button className={item.id === direction ? "direction selected" : "direction"} key={item.id} onClick={() => setDirection(item.id)}>
            <span>{item.id}</span><div><strong>{item.title}</strong><small>{item.body}</small></div><i />
          </button>
        ))}
      </div>
      <div className="tonePicker">
        <span>Tone</span>
        {project.tone_chips.map((tone) => <button className={tone === activeDirection.tone ? "active" : ""} key={tone}>{tone}</button>)}
      </div>
      <div className="pacing">
        <label><span>Pacing</span><b>Measured</b><b>Propulsive</b></label>
        <div className="range"><i style={{ width: `${project.pacing}%` }} /></div>
      </div>
      <button className="applyButton">Apply direction to scenes</button>
    </aside>
  );
}

function ScenePanel({ project, selected, selectedPath, setSelected }: { project: Project; selected: Record<string, string>; selectedPath: SceneOption[]; setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>> }) {
  return (
    <section className="scenePanel panel" aria-label={`Selected scene path ${selectedPath.map((shot) => shot.id).join(" to ")}`}>
      <header className="sectionHeader compact">
        <div><h2>SCENE WEAVE</h2><p>Branching narrative. Choose the path.</p></div>
        <div className="sceneTools"><span><i />Board</span><span><Icon name="timeline" />Timeline</span><button><Icon name="plus" />Add scene</button></div>
      </header>
      <div className="sceneColumns">
        <div className="sceneFlow" aria-hidden="true">
          <ReactFlow
            nodes={sceneFlowNodes}
            edges={sceneFlowEdges}
            nodeTypes={sceneNodeTypes}
            style={{ width: "100%", height: "100%" }}
            fitView={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            preventScrolling={false}
          />
        </div>
        {project.scenes.map((scene) => (
          <article className="sceneColumn" key={scene.label}>
            <header><strong>{scene.label}</strong><span>{scene.time}</span></header>
            {scene.options.map((option) => (
              <button className={selected[scene.label] === option.id ? "shot selected" : "shot"} key={option.id} onClick={() => setSelected((current) => ({ ...current, [scene.label]: option.id }))}>
                <span className="radio" />
                <MediaTile src={option.src} label={option.title} />
                <div className="shotCopy">
                  <h3><b>{option.id}</b>{option.title}</h3>
                  <p><span>Lens</span>{option.lens}</p>
                  <p><span>Motion</span>{option.motion}</p>
                  <p><span>Duration</span>{option.duration}</p>
                  <p><span>Prompt strength</span>{option.strength}<Strength value={option.strength} /></p>
                </div>
              </button>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

function QueuePanel({ project }: { project: Project }) {
  return (
    <section className="queuePanel panel">
      <header><h2>RUNWAY QUEUE</h2><span>{project.queue_count} in progress</span><button>Connect</button><select aria-label="Runway model" defaultValue={project.model}><option value={project.model}>{project.model}</option></select><Icon name="spark" /></header>
      <div className="queueStrip">
        {project.queue.map((item) => (
          <article className="queueCard" key={item.id}>
            <MediaTile src={item.src} label={item.id} />
            <header><span className={`queueStatus ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span><b>{item.progress || "○"}</b></header>
            <footer><span>{item.id}</span><b>{item.duration}</b></footer>
            {item.progress ? <div className="progress"><i style={{ width: item.progress }} /></div> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function OutputPanel({ project }: { project: Project }) {
  const { output } = project;
  const [primary, accent, ...rest] = output.poster_lines;
  return (
    <aside className="outputPanel">
      <header><h2>{output.title}</h2><span>{output.subtitle}</span><b>{output.format_label}</b></header>
      <div className="outputBody">
        <div className="poster">
          <MediaTile src={output.poster_src} label={output.title} />
          <strong>{primary}<br /><span>{[accent, ...rest].filter(Boolean).join(" ")}</span></strong>
          <footer><Icon name="play" /><span>0:00 / {output.duration}</span><Icon name="expand" /></footer>
        </div>
        <div className="exportControls">
          <label>Audio<select defaultValue={output.audio_label}><option value={output.audio_label}>{output.audio_label}</option></select></label>
          <div className="waveform">{Array.from({ length: 44 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 13) % 36)}px` }} />)}</div>
          <div className="exportToggle"><span>Captions</span><b>{output.captions ? "On" : "Off"}</b><button><i /></button></div>
          <div className="exportToggle"><span>Safe zones</span><b>{output.safe_zones ? "On" : "Off"}</b><button><i /></button></div>
          <button className="editButton"><Icon name="share" />Open in Edit</button>
        </div>
      </div>
    </aside>
  );
}

export function AnansiWorkbench({ project }: { project: Project }) {
  const [direction, setDirection] = useState(project.selected_direction);
  const [selected, setSelected] = useState<Record<string, string>>(project.selected_scenes);

  const selectedPath = useMemo(
    () => project.scenes.map((scene) => scene.options.find((option) => option.id === selected[scene.label]) ?? scene.options[0]),
    [selected, project.scenes]
  );

  return (
    <main className="anansiWorkspace">
      <Sidebar />
      <section className="workbench">
        <Topbar title={project.title} />
        <div className="mainGrid">
          <BriefPanel project={project} />
          <MoodPanel project={project} />
          <StoryPanel project={project} direction={direction} setDirection={setDirection} />
          <ScenePanel project={project} selected={selected} selectedPath={selectedPath} setSelected={setSelected} />
          <QueuePanel project={project} />
          <OutputPanel project={project} />
        </div>
      </section>
    </main>
  );
}
