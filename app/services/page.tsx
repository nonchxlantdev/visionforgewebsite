import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImproveExamples } from "@/components/sections/ImproveExamples";
import { ServiceStage } from "@/components/sections/ServiceStage";
import { stages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services | Vision Forge Studio",
  description:
    "Business reviews and consultation, process improvement and automation, websites and custom systems, plus optional training and support. For businesses big and small in Belize.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="How we help your business"
        lede="Every business is different, so we start by understanding yours. Then we improve how it runs and build what it needs. Training and support are there if you want them."
      >
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <li key={stage.id}>
                <a
                  href={`#${stage.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[15px] text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  {stage.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      {stages.map((stage, index) => (
        <ServiceStage key={stage.id} stage={stage} index={index}>
          {stage.id === "improve" ? <ImproveExamples /> : null}
        </ServiceStage>
      ))}
      <ClosingBand />
    </>
  );
}
