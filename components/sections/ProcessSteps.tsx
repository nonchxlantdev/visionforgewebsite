import { ProcessScroll } from "@/components/sections/process/ProcessScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { afterLaunch } from "@/lib/site";

/** The full "How we work" walkthrough: the scroll-driven steps, then optional training and support. */
export function ProcessSteps() {
  return (
    <section aria-labelledby="steps-title" className="px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading id="steps-title" eyebrow="Process" title="From first conversation to continuous improvement" />
        <ProcessScroll variant="full" />
        <aside aria-labelledby="after-launch-title" className="mt-16 rounded-[24px] border border-dashed border-line bg-mist p-7 md:p-9">
          <h3 id="after-launch-title" className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
            {afterLaunch.title}
          </h3>
          <p className="mt-2 max-w-[62ch] text-body">{afterLaunch.copy}</p>
        </aside>
      </div>
    </section>
  );
}
