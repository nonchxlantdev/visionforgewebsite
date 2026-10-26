import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhyUs } from "@/components/sections/WhyUs";
import { about } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Vision Forge Studio",
  description:
    "Vision Forge Studio is a Belizean-owned technology partner helping businesses automate the work, connect their systems and build technology that works for them.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title={about.title} lede={about.lede} />

      <section aria-labelledby="story-title" className="border-b border-line">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <SectionHeading id="story-title" title="Why Vision Forge exists" />
          <div className="max-w-[62ch] space-y-5 text-body">
            {about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="beliefs-title" className="border-b border-line bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <SectionHeading id="beliefs-title" title="What we believe" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {about.beliefs.map((belief) => (
              <li key={belief.title} className="rounded-lg border border-line bg-paper p-7">
                <h3 className="font-display text-[1.25rem] font-bold text-ink">{belief.title}</h3>
                <p className="mt-3 text-body">{belief.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WhyUs />

      <section aria-labelledby="owned-title" className="border-b border-line">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <SectionHeading id="owned-title" title="Belizean-owned" lede={about.owned} />
        </div>
      </section>

      <ClosingBand />
    </>
  );
}
