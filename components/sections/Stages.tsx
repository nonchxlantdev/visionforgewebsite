import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howWeWorkSteps } from "@/lib/site";

/** Home-page summary of how a project runs. A real sequence, so it's numbered. */
export function Stages() {
  return (
    <section aria-labelledby="stages-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="stages-title"
          title="How we work"
          lede="Every project follows the same path, from understanding your business to improving what we've built."
        />
        <ol className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-7">
          {howWeWorkSteps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-ink pt-4">
              <p className="flex items-baseline gap-2 font-display text-[1.125rem] leading-snug font-bold text-ink">
                <span className="text-accent tabular-nums">{index + 1}</span>
                {step.title}
              </p>
              <p className="mt-2 text-[15px] text-body lg:hidden">{step.copy}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <CtaLink href="/how-we-work" variant="link">
            See each step in detail
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
