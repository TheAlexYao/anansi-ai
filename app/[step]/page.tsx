import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstallCommand } from "./InstallCommand";

const slides: Record<number, { title: string; src: string; nextHref: string }> = {
  2: {
    title: "Brief Intake",
    src: "/generated/site-comps/anansi-premium/02-brief-intake.png",
    nextHref: "/3",
  },
  3: {
    title: "Creative Directions",
    src: "/generated/site-comps/anansi-premium/03-creative-directions.png",
    nextHref: "/4",
  },
  4: {
    title: "Storyboard / Shot List",
    src: "/generated/site-comps/anansi-premium/04-storyboard-shot-list.png",
    nextHref: "/5",
  },
  5: {
    title: "Human Approval",
    src: "/generated/site-comps/anansi-premium/05-human-approval.png",
    nextHref: "/6",
  },
  6: {
    title: "Hermes Agent Workflow",
    src: "/generated/site-comps/anansi-premium/06-hermes-agent-workflow.png",
    nextHref: "/7",
  },
  7: {
    title: "Runway Generation",
    src: "/generated/site-comps/anansi-premium/07-runway-generation.png",
    nextHref: "/8",
  },
  8: {
    title: "Final Review / CTA",
    src: "/generated/site-comps/anansi-premium/08-final-review-cta.png",
    nextHref: "/",
  },
};

export function generateStaticParams() {
  return Object.keys(slides).map((step) => ({ step }));
}

export default async function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const stepNumber = Number(step);

  if (!Number.isInteger(stepNumber) || !slides[stepNumber]) {
    notFound();
  }

  const slide = slides[stepNumber];

  if (stepNumber === 8) {
    return (
      <main className="premium-flow-page install-flow-page">
        <section className="install-slide" aria-labelledby="install-title">
          <Image src={slide.src} alt="" fill sizes="100vw" className="install-slide-bg" priority />
          <div className="install-backdrop" aria-hidden="true" />
          <article className="install-card">
            <div className="install-lockup">
              <span className="install-mark" />
              <span>Anansi</span>
            </div>
            <p className="install-label">Your direction is ready</p>
            <h1 id="install-title">Weave your story with Anansi</h1>
            <p className="install-copy">
              Turn a brief into approved directions, storyboarded shots, and Runway-ready
              video renders through your local Anansi workbench.
            </p>
            <InstallCommand />
            <div className="install-story" aria-label="Anansi install workflow">
              <div className="install-flow">
                <span><b>01</b> Creative direction approved</span>
                <span><b>02</b> Prompts queued by Hermes</span>
                <span><b>03</b> Runway render ready</span>
              </div>
              <div className="install-groups">
                <section>
                  <h2>Included</h2>
                  <p><b>✓</b> Visual workbench</p>
                  <p><b>✓</b> Hermes login</p>
                  <p><b>✓</b> GPT-5.5 creative direction</p>
                </section>
                <section>
                  <h2>Connect to render</h2>
                  <p><b>→</b> Add your Runway API key</p>
                  <p><b>+</b> Veo 3.1 additional engine</p>
                </section>
              </div>
              <div className="install-next">
                <h2>After installing</h2>
                <ol>
                  <li>Run the command locally.</li>
                  <li>Open the starter project.</li>
                  <li>Add your Runway API key.</li>
                  <li>Render approved shots.</li>
                </ol>
              </div>
            </div>
            <div className="install-actions">
              <Link href="/workbench">Preview workbench</Link>
              <Link href="/">Back to landing</Link>
            </div>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="premium-flow-page">
      <section className="premium-slide" aria-labelledby="premium-slide-title">
        <Link href={slide.nextHref} className="premium-slide-hitbox" aria-label={`Continue from ${slide.title}`}>
          <span className="premium-slide-frame">
            <Image src={slide.src} alt="" fill sizes="100vw" className="premium-slide-image" priority />
          </span>
          <span className="sr-only" id="premium-slide-title">
            {slide.title}
          </span>
        </Link>
      </section>
    </main>
  );
}
