import { SectionHeading } from "@/components/ui/SectionHeading";
import { workflowExamples, workflowNote } from "@/lib/site";

/** "What this looks like in practice": each example as a short checklist, ending on the outcome step. */
export function Workflows() {
  return (
    <section aria-labelledby="workflows-title" className="px-3 sm:px-6">
      <div className="on-dark mx-auto max-w-[1168px] rounded-[28px] bg-ink px-5 py-16 sm:px-10 md:rounded-[36px] md:px-12 md:py-24">
        <SectionHeading
          id="workflows-title"
          tone="dark"
          eyebrow="In practice"
          title="What this looks like in practice"
          lede="Information moves from one step or system to the next on its own, so work gets done faster and more reliably."
        />

        <ul className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {workflowExamples.map((example) => (
            <li key={example.id} className="flex flex-col gap-5 rounded-[22px] bg-ink-raised p-6">
              <h3 className="font-display text-[1.125rem] leading-snug font-semibold text-paper">{example.title}</h3>
              <ol className="flex flex-col gap-2.5">
                {example.steps.map((step, i) => {
                  const last = i === example.steps.length - 1;
                  return (
                    <li key={step} className={`flex items-center gap-2.5 text-[14px] leading-snug ${last ? "font-semibold text-paper" : "text-[#e4e8ef]"}`}>
                      <span
                        aria-hidden
                        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full font-mono text-[11px] tabular-nums ${last ? "bg-brand text-paper" : "bg-ink-line text-paper"}`}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-auto border-t border-ink-line pt-4 text-[13px] leading-relaxed text-on-ink-2">{example.outcome}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[80ch] text-[13px] leading-relaxed text-on-ink-2">{workflowNote}</p>
      </div>
    </section>
  );
}
