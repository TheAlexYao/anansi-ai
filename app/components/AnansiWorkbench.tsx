"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Handle, Position, ReactFlow, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type MediaKind = "boots" | "street" | "leather" | "tram" | "palette" | "sketch" | "macro" | "puddle" | "walk" | "subway" | "exit" | "poster";

type SceneOption = {
  id: string;
  title: string;
  media: MediaKind;
  lens: string;
  motion: string;
  duration: string;
  strength: string;
};

type Scene = {
  label: string;
  time: string;
  options: SceneOption[];
};

type QueueItem = {
  status: string;
  progress: string;
  id: string;
  media: MediaKind;
  duration: string;
};

const mediaSources: Partial<Record<MediaKind, string>> = {
  boots: "/generated/runway/anansi-cinder/boots.png",
  street: "/generated/runway/anansi-cinder/street.png",
  leather: "/generated/runway/anansi-cinder/leather.png",
  tram: "/generated/runway/anansi-cinder/tram.png",
  macro: "/generated/runway/anansi-cinder/leather.png",
  puddle: "/generated/runway/anansi-cinder/boots.png",
  walk: "/generated/runway/anansi-cinder/walk.png",
  subway: "/generated/runway/anansi-cinder/tram.png",
  exit: "/generated/runway/anansi-cinder/poster.png",
  poster: "/generated/runway/anansi-cinder/poster.png"
};

const nav = ["Home", "Projects", "Briefs", "Mood", "Scenes", "Edit", "Exports"];
const library = ["Assets", "References", "Brand Kit", "Settings"];

const directions = [
  {
    id: "01",
    title: "The city keeps the secrets",
    body: "A moody portrait of Lisbon at night. The product is the shadow.",
    tone: "Gritty"
  },
  {
    id: "02",
    title: "A night walk becomes a launch ritual",
    body: "An intimate journey. Each step builds to the reveal.",
    tone: "Cinematic"
  },
  {
    id: "03",
    title: "Built to outlast the rain",
    body: "Texture-forward. The boot as armor against the elements.",
    tone: "Tactile"
  }
];

const scenes: Scene[] = [
  {
    label: "HOOK",
    time: "0:00 - 0:08",
    options: [
      { id: "1A", title: "Macro texture", media: "macro", lens: "100mm Macro", motion: "Static push-in", duration: "3.0s", strength: "0.75" },
      { id: "1B", title: "Puddle reflection", media: "puddle", lens: "35mm", motion: "Low angle tilt", duration: "3.0s", strength: "0.70" }
    ]
  },
  {
    label: "TURN",
    time: "0:08 - 0:18",
    options: [
      { id: "2A", title: "Tracking the walk", media: "walk", lens: "35mm", motion: "Tracking back", duration: "4.5s", strength: "0.80" },
      { id: "2B", title: "Subway blur", media: "subway", lens: "24mm", motion: "Whip pan", duration: "4.5s", strength: "0.65" }
    ]
  },
  {
    label: "MEMORY",
    time: "0:18 - 0:30",
    options: [
      { id: "3A", title: "Exit frame", media: "exit", lens: "50mm", motion: "Hold and let go", duration: "4.0s", strength: "0.70" },
      { id: "3B", title: "Product reveal in rain", media: "boots", lens: "85mm", motion: "Slow push-in", duration: "6.0s", strength: "0.85" }
    ]
  }
];

const queue: QueueItem[] = [
  { status: "RENDERING", progress: "48%", id: "1A", media: "macro", duration: "3.0s" },
  { status: "RENDERING", progress: "22%", id: "2A", media: "walk", duration: "4.5s" },
  { status: "NEEDS PICK", progress: "", id: "2B", media: "subway", duration: "4.5s" },
  { status: "APPROVED", progress: "", id: "3A", media: "exit", duration: "4.0s" },
  { status: "APPROVED", progress: "", id: "3B", media: "boots", duration: "6.0s" }
];

function Icon({ name }: { name: string }) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

function MediaTile({ kind, label }: { kind: MediaKind; label?: string }) {
  if (kind === "palette") {
    return (
      <div className="mediaTile paletteTile">
        {["Cobalt", "Charcoal", "Rust", "Sodium", "Smoke"].map((color, index) => (
          <div className="swatchRow" key={color}>
            <span>{color}</span>
            <i style={{ ["--swatch" as string]: ["#243947", "#1d1d1a", "#8d3d2a", "#b77045", "#2b2924"][index] }} />
          </div>
        ))}
      </div>
    );
  }

  if (kind === "sketch") {
    return (
      <div className="mediaTile sketchTile">
        <div className="sketchFrame" />
        <div className="sketchPerson" />
        <p>WALK.<br />RAIN.<br />NEON.<br />TURN.<br />LEAVE.</p>
      </div>
    );
  }

  const src = mediaSources[kind];

  return (
    <div className={`mediaTile media-${kind} ${src ? "hasImage" : ""}`} aria-label={label}>
      {src ? <Image src={src} alt={label ?? ""} fill sizes="(max-width: 760px) 92vw, (max-width: 1180px) 44vw, 34vw" /> : null}
      <span />
      <i />
      <b />
    </div>
  );
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
      <div className="brandLockup"><span className="anansiMark" />ANANSI</div>
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

function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>Projects</span><b>/</b><button>Cinder Studio Launch Film <Icon name="chevron" /></button></div>
      <nav className="tabs" aria-label="Workflow">
        {["Brief", "Mood", "Scenes", "Edit"].map((tab) => <a className={tab === "Brief" ? "selected" : ""} href="#" key={tab}>{tab}</a>)}
      </nav>
      <div className="actions"><button aria-label="Undo"><Icon name="undo" /></button><button aria-label="Redo"><Icon name="redo" /></button><button><Icon name="share" />Share</button><button className="export">Export</button></div>
    </header>
  );
}

function BriefPanel() {
  return (
    <section className="briefPanel panel">
      <header><h2>BRIEF</h2><button>Edit</button></header>
      <dl>
        <div><dt>Product</dt><dd>Cinder Studio boots</dd></div>
        <div><dt>Feeling</dt><dd>rain-soaked, defiant, intimate</dd></div>
        <div><dt>Reference</dt><dd>Wong Kar-wai street stills<br />+ 90s skate videos</dd></div>
      </dl>
      <div className="controlStack">
        <label><span>Reference weight</span><b>70%</b></label><div className="range"><i style={{ width: "70%" }} /></div>
        <label><span>Story tension</span><b>65%</b></label><div className="range"><i style={{ width: "65%" }} /></div>
      </div>
      <div className="toggleRow"><span>Human approval</span><b>On</b><button aria-label="Human approval on"><i /></button></div>
    </section>
  );
}

function MoodPanel() {
  return (
    <section className="moodPanel panel">
      <header className="sectionHeader">
        <div><h1>MOOD WEAVE <span>i</span></h1><p>Visual references connecting tone, texture and story.</p></div>
        <div className="viewTools"><Icon name="grid" /><Icon name="sliders" /><button><Icon name="plus" />Add reference</button></div>
      </header>
      <div className="moodBoard">
        <MediaTile kind="boots" label="Rain-soaked boots" />
        <MediaTile kind="street" label="Wet Lisbon street" />
        <MediaTile kind="leather" label="Macro leather texture" />
        <MediaTile kind="tram" label="Passing tram" />
        <MediaTile kind="palette" />
        <MediaTile kind="sketch" />
      </div>
    </section>
  );
}

function StoryPanel({ activeDirection, direction, setDirection }: { activeDirection: typeof directions[number]; direction: string; setDirection: (direction: string) => void }) {
  return (
    <aside className="storyPanel panel">
      <header><h2>STORY WEAVER</h2><span>AI co-producer</span></header>
      <p>I’ve woven your brief and references into three cinematic directions.</p>
      <div className="directionList">
        {directions.map((item) => (
          <button className={item.id === direction ? "direction selected" : "direction"} key={item.id} onClick={() => setDirection(item.id)}>
            <span>{item.id}</span><div><strong>{item.title}</strong><small>{item.body}</small></div><i />
          </button>
        ))}
      </div>
      <div className="tonePicker">
        <span>Tone</span>
        {["Cinematic", "Intimate", "Gritty", "Nostalgic"].map((tone) => <button className={tone === activeDirection.tone ? "active" : ""} key={tone}>{tone}</button>)}
      </div>
      <div className="pacing">
        <label><span>Pacing</span><b>Measured</b><b>Propulsive</b></label>
        <div className="range"><i style={{ width: "76%" }} /></div>
      </div>
      <button className="applyButton">Apply direction to scenes</button>
    </aside>
  );
}

function ScenePanel({ selected, selectedPath, setSelected }: { selected: Record<string, string>; selectedPath: SceneOption[]; setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>> }) {
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
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
          />
        </div>
        {scenes.map((scene) => (
          <article className="sceneColumn" key={scene.label}>
            <header><strong>{scene.label}</strong><span>{scene.time}</span></header>
            {scene.options.map((option) => (
              <button className={selected[scene.label] === option.id ? "shot selected" : "shot"} key={option.id} onClick={() => setSelected((current) => ({ ...current, [scene.label]: option.id }))}>
                <span className="radio" />
                <MediaTile kind={option.media} />
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

function QueuePanel() {
  return (
    <section className="queuePanel panel">
      <header><h2>RUNWAY QUEUE</h2><span>4 in progress</span><button>Connect</button><select aria-label="Runway model" defaultValue="gen3"><option value="gen3">Runway Gen-3 Alpha</option></select><Icon name="spark" /></header>
      <div className="queueStrip">
        {queue.map((item) => (
          <article className="queueCard" key={item.id}>
            <MediaTile kind={item.media} />
            <header><span className={`queueStatus ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span><b>{item.progress || "○"}</b></header>
            <footer><span>{item.id}</span><b>{item.duration}</b></footer>
            {item.progress ? <div className="progress"><i style={{ width: item.progress }} /></div> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function OutputPanel() {
  return (
    <aside className="outputPanel">
      <header><h2>FINAL OUTPUT</h2><span>30s social film</span><b>9:16</b></header>
      <div className="outputBody">
        <div className="poster"><MediaTile kind="poster" /><strong>CINDER<br /><span>STUDIO</span></strong><footer><Icon name="play" /><span>0:00 / 0:30</span><Icon name="expand" /></footer></div>
        <div className="exportControls">
          <label>Audio<select defaultValue="night"><option value="night">Night Walk (Original Mix)</option></select></label>
          <div className="waveform">{Array.from({ length: 44 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 13) % 36)}px` }} />)}</div>
          <div className="exportToggle"><span>Captions</span><b>On</b><button><i /></button></div>
          <div className="exportToggle"><span>Safe zones</span><b>On</b><button><i /></button></div>
          <button className="editButton"><Icon name="share" />Open in Edit</button>
        </div>
      </div>
    </aside>
  );
}

export function AnansiWorkbench() {
  const [direction, setDirection] = useState("02");
  const [selected, setSelected] = useState<Record<string, string>>({ HOOK: "1A", TURN: "2A", MEMORY: "3B" });

  const activeDirection = useMemo(() => directions.find((item) => item.id === direction) ?? directions[1], [direction]);
  const selectedPath = useMemo(
    () => scenes.map((scene) => scene.options.find((option) => option.id === selected[scene.label]) ?? scene.options[0]),
    [selected]
  );

  return (
    <main className="anansiWorkspace">
      <Sidebar />
      <section className="workbench">
        <Topbar />
        <div className="mainGrid">
          <BriefPanel />
          <MoodPanel />
          <StoryPanel activeDirection={activeDirection} direction={direction} setDirection={setDirection} />
          <ScenePanel selected={selected} selectedPath={selectedPath} setSelected={setSelected} />
          <QueuePanel />
          <OutputPanel />
        </div>
      </section>
    </main>
  );
}
