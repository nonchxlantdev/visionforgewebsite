import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { stages } from "@/lib/site";

/** Home-page summary of how we work with a business. A real sequence, so it's numbered. */
export function Stages() {
  return (
    <section aria-labelledby="stages-title" className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="stages-title"
          title="How we work with you"
          lede="We start by understanding your business. Then we improve how it runs and build what it needs."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <li key={stage.id} className="border-t-2 border-ink pt-5">
              <p className="flex flex-wrap items-baseline gap-x-3 font-display text-[1.3125rem] font-bold text-ink">
                <span className="text-accent tabular-nums">{index + 1}</span>
                {stage.name}
                {stage.optional ? <span className="font-sans text-[14px] font-normal text-muted">Optional</span> : null}
              </p>
              <p className="mt-1 text-[15px] font-medium text-ink">{stage.title}</p>
              <p className="mt-3 text-[16px] text-body">{stage.summary}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <CtaLink href="/services" variant="link">
            See what each stage includes
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
