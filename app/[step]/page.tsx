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
      <main className="premium-flow-page">
        <section className="install-slide" aria-labelledby="install-title">
          <Image src={slide.src} alt="" fill sizes="100vw" className="install-slide-bg" priority />
          <div className="install-backdrop" aria-hidden="true" />
          <article className="install-card">
            <div className="install-lockup">
              <span className="install-mark" />
              <span>Anansi</span>
            </div>
            <p className="install-label">Run it locally</p>
            <h1 id="install-title">Install Anansi locally</h1>
            <p className="install-copy">
              Anansi starts with your existing Hermes login. GPT-5.5 handles the creative
              direction layer. Connect Veo or Runway only when it&apos;s time to render video.
            </p>
            <InstallCommand />
            <div className="install-capabilities" aria-label="Included capabilities">
              <span><b>✓</b> Visual workbench <em>Included</em></span>
              <span><b>✓</b> Hermes skills <em>Included</em></span>
              <span><b>✓</b> GPT-5.5 via Hermes OAuth <em>Connected</em></span>
              <span><b>○</b> Veo 3.1 <em>Optional</em></span>
              <span><b>○</b> Runway <em>Optional</em></span>
            </div>
            <p className="install-note">
              Creative direction works immediately through Hermes. Video render engines connect when needed.
            </p>
            <div className="install-actions">
              <Link href="/workbench">Open workbench preview</Link>
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
