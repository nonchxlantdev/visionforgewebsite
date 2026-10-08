import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { PricingBuilder } from "@/components/sections/PricingBuilder";
import { TierCards } from "@/components/sections/TierCards";
import { faq } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing | Vision Forge Studio",
  description:
    "Websites from BZ$500, automation from BZ$1,500, connected business systems from BZ$8,000. Build your project and see the starting price. Fixed written quotes.",
  alternates: { canonical: "/pricing" },
};

const questions = faq.filter((f) =>
  ["How much will my project cost?", "How long does it take?", "Who owns what you build?"].includes(f.q),
);

export default function PricingPage() {
  return (
    <>
      <PageHeader
        kicker="Pricing"
        title={
          <>
            Build it. <span className="text-gold">See the price.</span>
          </>
        }
        lede="Three honest starting points. Pick what you need below and your work ticket shows where you'd start. Every project gets a fixed written quote after a free chat."
      />
      <TierCards />
      <PricingBuilder />
      <Faq items={questions} title="About prices." />
      <ClosingBand secondary={{ label: "How we work", href: "/how-we-work" }} />
    </>
  );
}
