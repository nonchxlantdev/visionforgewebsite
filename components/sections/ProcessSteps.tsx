import { SectionHeading } from "@/components/ui/SectionHeading";
import { afterLaunch, howWeWorkSteps } from "@/lib/site";

export function ProcessSteps() {
  return (
    <section aria-labelledby="steps-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading id="steps-title" title="From first conversation to continuous improvement" />
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {howWeWorkSteps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-ink pt-5">
              <span className="font-display text-[1.5rem] font-bold text-accent tabular-nums">{index + 1}</span>
              <h3 className="mt-2 font-display text-[1.25rem] leading-snug font-bold text-ink">{step.title}</h3>
              <p className="mt-3 text-[16px] text-body">{step.copy}</p>
            </li>
          ))}
        </ol>
        <aside aria-labelledby="after-launch-title" className="mt-12 rounded-lg border border-dashed border-muted/60 bg-mist p-7 md:p-8">
          <h3 id="after-launch-title" className="font-display text-[1.25rem] font-bold text-ink">
            {afterLaunch.title}
          </h3>
          <p className="mt-2 max-w-[62ch] text-body">{afterLaunch.copy}</p>
        </aside>
      </div>
    </section>
  );
}
