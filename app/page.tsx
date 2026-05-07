"use client";

import { useMemo, useState } from "react";

const directions = [
  {
    id: "01",
    title: "The city keeps the secrets",
    body: "A moody portrait of Lisbon at night. The product is the shadow.",
    reasons: ["Strongest atmosphere", "Best for a teaser cut", "Higher ambiguity risk"],
    next: "Build six nocturne shot prompts"
  },
  {
    id: "02",
    title: "A night walk becomes a launch ritual",
    body: "An intimate journey. Each step builds to the reveal.",
    reasons: ["Clearest product reveal", "Best emotional arc", "Lowest render risk"],
    next: "Apply ritual arc to scenes"
  },
  {
    id: "03",
    title: "Built to outlast the rain",
    body: "Texture-forward. The boot as armor against the elements.",
    reasons: ["Most product-forward", "Strong tactile language", "Less story tension"],
    next: "Generate texture-first prompt set"
  }
];

const scenes = [
  {
    label: "HOOK",
    purpose: "Establish rain, texture, and mood.",
    time: "0:00 - 0:08",
    options: [
      {
        id: "1A",
        title: "Macro texture",
        media: "leather",
        lens: "100mm Macro",
        motion: "Static push-in",
        duration: "3.0s",
        strength: "0.75",
        risk: "Low",
        why: "Makes the material feel expensive before the reveal.",
        prompt: "Macro close-up of black leather boot, rain beads catching sodium streetlight, static push-in."
      },
      {
        id: "1B",
        title: "Puddle reflection",
        media: "puddle",
        lens: "35mm",
        motion: "Low angle tilt",
        duration: "3.0s",
        strength: "0.70",
        risk: "Med",
        why: "Adds atmosphere, but the product is less readable.",
        prompt: "Low-angle puddle reflection, black boot passing through red sodium rain, intimate night street."
      }
    ]
  },
  {
    label: "TURN",
    purpose: "Introduce movement and ritual.",
    time: "0:08 - 0:18",
    options: [
      {
        id: "2A",
        title: "Tracking the walk",
        media: "walk",
        lens: "35mm",
        motion: "Tracking back",
        duration: "4.5s",
        strength: "0.80",
        risk: "Low",
        why: "Gives the film a clear human path without losing the boot.",
        prompt: "Tracking backward night walk through wet Lisbon street, defiant silhouette, black boots driving the frame."
      },
      {
        id: "2B",
        title: "Subway blur",
        media: "subway",
        lens: "24mm",
        motion: "Whip pan",
        duration: "4.5s",
        strength: "0.65",
        risk: "High",
        why: "Useful as an insert, but motion blur may dilute the ritual.",
        prompt: "Subway motion blur, charcoal coat and rain reflections, whip pan into sodium-lit tunnel."
      }
    ]
  },
  {
    label: "REVEAL",
    purpose: "Land the product memory.",
    time: "0:18 - 0:30",
    options: [
      {
        id: "3A",
        title: "Exit frame",
        media: "exit",
        lens: "50mm",
        motion: "Hold and let go",
        duration: "4.0s",
        strength: "0.70",
        risk: "Med",
        why: "A poetic ending, but the product payoff is softer.",
        prompt: "Figure exits frame into rain, neon edge light, boot steps fading into wet pavement."
      },
      {
        id: "3B",
        title: "Product reveal in rain",
        media: "boot",
        lens: "85mm",
        motion: "Slow push-in",
        duration: "6.0s",
        strength: "0.85",
        risk: "Low",
        why: "Best final product read while preserving the intimate mood.",
        prompt: "Slow push-in on Cinder Studio boot in rain, black leather, sodium reflections, cinematic product reveal."
      }
    ]
  }
];

const queue = [
  ["RENDERING", "48%", "1A", "leather", "3.0s"],
  ["RENDERING", "22%", "2A", "walk", "4.5s"],
  ["NEEDS PICK", "", "2B", "subway", "4.5s"],
  ["APPROVED", "", "3A", "exit", "4.0s"],
  ["APPROVED", "", "3B", "boot", "6.0s"]
];

const agents = [
  ["Taste Director", "recommended Direction 2 for the clearest ritual structure"],
  ["Scene Weaver", "mapped the launch film into hook, turn, and memory beats"],
  ["Runway Producer", "queued 5 clips with locked rain, sodium, and charcoal motifs"],
  ["Critic", "flagged subway blur as needs pick before final assembly"]
];

function MediaTile({ type }: { type: string }) {
  return (
    <div className={`mediaArt media-${type}`} aria-hidden="true">
      <span />
      <i />
      <b />
    </div>
  );
}

export default function Home() {
  const [selectedDirection, setSelectedDirection] = useState("02");
  const [selectedShots, setSelectedShots] = useState<Record<string, string>>({
    HOOK: "1A",
    TURN: "2A",
    REVEAL: "3B"
  });

  const activeDirection = useMemo(
    () => directions.find((direction) => direction.id === selectedDirection) ?? directions[1],
    [selectedDirection]
  );
  const selectedPath = useMemo(
    () => scenes.map((scene) => scene.options.find((option) => option.id === selectedShots[scene.label]) ?? scene.options[0]),
    [selectedShots]
  );
  const selectedDuration = selectedPath.reduce((total, option) => total + Number.parseFloat(option.duration), 0).toFixed(1);

  return (
    <main className="workspace">
      <aside className="sideRail">
        <div className="brand"><span className="brandMark" />ANANSI</div>
        <nav className="railNav" aria-label="Primary">
          {["Home", "Projects", "Briefs", "Mood", "Scenes", "Edit", "Exports"].map((item) => (
            <a className={item === "Mood" ? "railItem active" : "railItem"} href="#" key={item}>{item}</a>
          ))}
        </nav>
        <nav className="railNav lower" aria-label="Project">
          {["Assets", "References", "Brand Kit", "Settings"].map((item) => (
            <a className="railItem" href="#" key={item}>{item}</a>
          ))}
        </nav>
        <div className="profile"><span>A</span><div><strong>Adrian Okoro</strong><small>Studio Black Thread</small></div></div>
      </aside>

      <section className="appShell">
        <header className="topBar">
          <div className="crumbs"><span>Projects</span><span>/</span><button>Cinder Studio Launch Film</button></div>
          <nav className="tabs" aria-label="Workflow">
            {["Brief", "Mood", "Scenes", "Edit"].map((tab) => <a className={tab === "Brief" ? "tab selected" : "tab"} href="#" key={tab}>{tab}</a>)}
          </nav>
          <div className="topActions"><button>Share</button><button className="exportButton">Export</button></div>
        </header>

        <div className="contentGrid">
          <section className="briefPanel panel">
            <div className="panelTitle"><h2>BRIEF</h2><button>Edit</button></div>
            <div className="briefRows">
              <div><span>Product</span><strong>Cinder Studio boots</strong></div>
              <div><span>Feeling</span><strong>rain-soaked, defiant, intimate</strong></div>
              <div><span>Reference</span><strong>Wong Kar-wai street stills<br />+ 90s skate videos</strong></div>
            </div>
            <div className="sliderBlock">
              <label><span>Reference weight</span><b>70%</b></label><div className="slider"><i style={{ width: "70%" }} /></div>
              <label><span>Story tension</span><b>65%</b></label><div className="slider"><i style={{ width: "65%" }} /></div>
            </div>
            <div className="approval"><span>Human approval</span><strong>On</strong><button aria-label="Human approval enabled"><span /></button></div>
          </section>

          <section className="moodPanel panel">
            <div className="sectionHead"><div><h1>MOOD WEAVE <span>i</span></h1><p>Visual threads connecting tone, texture and story.</p></div></div>
            <div className="moodBoard">
              <MediaTile type="boot" />
              <MediaTile type="tram" />
              <MediaTile type="leather" />
              <MediaTile type="subway" />
              <div className="paletteNote">
                <span>Cobalt</span><i style={{ background: "#263542" }} />
                <span>Charcoal</span><i style={{ background: "#1e1d1b" }} />
                <span>Rust</span><i style={{ background: "#9a412b" }} />
                <span>Sodium</span><i style={{ background: "#b7734e" }} />
              </div>
              <div className="storySketch">WALK.<br />RAIN.<br />NEON.<br />TURN.<br />LEAVE.</div>
            </div>
          </section>

          <aside className="storyPanel panel">
            <div className="storyHeader"><h2>STORY WEAVER</h2><span>AI co-producer</span></div>
            <p className="storyIntro">I’ve woven your brief and references into three cinematic directions.</p>
            <div className="agentStrip">{["Taste", "Scene", "Runway", "Critic"].map((agent) => <span key={agent}>{agent}</span>)}</div>
            <div className="directionList">
              {directions.map((direction) => (
                <button className={direction.id === selectedDirection ? "direction active" : "direction"} key={direction.id} onClick={() => setSelectedDirection(direction.id)}>
                  <span>{direction.id}</span><div><h3>{direction.title}</h3><p>{direction.body}</p></div><i />
                </button>
              ))}
            </div>
            <div className="recommendation">
              <h3>Recommended because</h3>
              {activeDirection.reasons.map((reason) => <p key={reason}>{reason}</p>)}
              <strong>Next: {activeDirection.next}</strong>
            </div>
            <div className="activityDrawer">
              <h3>Anansi activity</h3>
              {agents.map(([agent, message]) => <p key={agent}><b>{agent}</b><span>{message}</span></p>)}
            </div>
            <div className="storyFooter"><button className="primaryAction">Apply direction to scenes</button><button className="secondaryAction">Generate alternate path</button></div>
          </aside>

          <section className="scenePanel panel">
            <div className="sectionHead slim"><div><h2>SCENE WEAVE</h2><p>Choose one approved shot for each story beat before Anansi prepares the Runway queue.</p></div></div>
            <div className="selectedPath"><div><span>Selected path</span><strong>{selectedPath.map((shot) => `${shot.id} ${shot.title}`).join(" -> ")}</strong></div><div className="pathStats"><span>{selectedDuration}s approved</span><span>$4.80 est.</span></div></div>
            <div className="sceneColumns">
              {scenes.map((scene) => (
                <article className="sceneColumn" key={scene.label}>
                  <header><div><strong>{scene.label}</strong><p>{scene.purpose}</p></div><span>{scene.time}</span></header>
                  {scene.options.map((option) => (
                    <button className={selectedShots[scene.label] === option.id ? "shotCard active" : "shotCard"} key={option.id} onClick={() => setSelectedShots((current) => ({ ...current, [scene.label]: option.id }))}>
                      <MediaTile type={option.media} />
                      <div className="shotMeta"><div><b>{option.id}</b><strong>{option.title}</strong></div><p>{option.prompt}</p><span>{option.lens} / {option.motion} / {option.duration}</span><em>{option.why}</em></div>
                    </button>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section className="queuePanel panel">
            <div className="queueHeader"><h2>RUNWAY QUEUE</h2><span>4 in progress</span><button>Connect</button></div>
            <div className="queueCards">
              {queue.map(([status, progress, id, image, duration]) => (
                <article className="queueCard" key={id}>
                  <MediaTile type={image} /><header><span className={`status ${status.toLowerCase().replace(" ", "-")}`}>{status}</span><b>{progress || "○"}</b></header><footer><span>{id}</span><b>{duration}</b></footer>{progress ? <div className="renderProgress"><i style={{ width: progress }} /></div> : null}
                </article>
              ))}
            </div>
          </section>

          <aside className="outputPanel">
            <div className="outputCard">
              <header><h2>FINAL OUTPUT</h2><span>30s social film</span><b>9:16</b></header>
              <div className="poster"><MediaTile type="poster" /><strong>CINDER<br /><span>STUDIO</span></strong><footer><span>▶</span><b>0:00 / 0:30</b></footer></div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
