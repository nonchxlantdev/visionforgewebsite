import { ProcessScroll } from "@/components/sections/process/ProcessScroll";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Home-page summary of how a project runs, with the scroll-driven picture. */
export function Stages() {
  return (
    <section aria-labelledby="stages-title" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="stages-title"
          eyebrow="Process"
          title="How we work"
          lede="Every project follows the same path, from understanding your business to improving what we've built."
        />
        <ProcessScroll variant="compact" />
        <div className="mt-10">
          <CtaLink href="/how-we-work" variant="link">
            See each step in detail →
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
