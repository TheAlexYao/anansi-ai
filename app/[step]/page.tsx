import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
