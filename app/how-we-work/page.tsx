import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { Promises } from "@/components/sections/Promises";
import { Timeline } from "@/components/sections/Timeline";
import { faq } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Work | Vision Forge Studio",
  description:
    "A free first chat, a fixed written quote, a build you can follow, and support after launch. How Vision Forge Studio works with Belizean businesses.",
  alternates: { canonical: "/how-we-work" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HowWeWorkPage() {
  return (
    <>
      <PageHeader
        kicker="How we work"
        title={
          <>
            Plain talk, fixed prices, <span className="text-gold">real support.</span>
          </>
        }
        lede="You tell us how your business runs in your own words. We map it, send a fixed written quote, build it with you and stay on after launch."
      />
      <Timeline />
      <Promises />
      <Faq />
      <ClosingBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
