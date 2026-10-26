import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImproveExamples } from "@/components/sections/ImproveExamples";
import { ServiceStage } from "@/components/sections/ServiceStage";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services | Vision Forge Studio",
  description:
    "Business process automation, systems integration, AI and intelligent workflows, and custom software and digital solutions. Plus consultation and optional training and support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Automate the work. Connect your systems."
        lede="Our core is helping businesses automate processes and connect the tools they already use. AI, custom software and websites support that work when they're the right fit."
      >
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-[15px] text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      {services.map((service, index) => (
        <ServiceStage key={service.id} stage={service} index={index}>
          {service.id === "automation" ? <ImproveExamples /> : null}
        </ServiceStage>
      ))}
      <ClosingBand />
    </>
  );
}
