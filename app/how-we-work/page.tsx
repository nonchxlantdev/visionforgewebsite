import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { questions } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Work | Vision Forge Studio",
  description:
    "A free first conversation, a look at how your business runs, a written plan with a fixed quote, and a build you test with us. Training and support if you want them.",
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
        lede="You tell us how your business runs in your own words. We learn it, send a written plan with a fixed quote, then build and test it with you."
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
