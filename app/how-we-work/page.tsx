import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { questions } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Work | Vision Forge Studio",
  description:
    "Discover, map the workflow, design the solution, integrate and automate, test, deploy and improve. A free first conversation and a fixed quote before work starts.",
  alternates: { canonical: "/how-we-work" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HowWeWorkPage() {
  return (
    <>
      <PageHeader
        title="Here's what working with us looks like."
        lede="We start by understanding how your business runs, then map, design, connect and automate it with you, and keep improving it after launch."
      />
      <ProcessSteps />
      <Faq items={questions} />
      <ClosingBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
