import { workflowExamples, workflowNote } from "@/lib/site";

/**
 * "What this looks like in practice": each example drawn as connected nodes,
 * echoing the hub in the hero. Across on wide screens, down on phones.
 */
export function Workflows() {
  return (
    <section aria-labelledby="workflows-title" className="on-dark border-b border-white/10 bg-ink bg-[radial-gradient(80%_70%_at_90%_10%,#1d2c46_0%,#0b1626_65%)]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <header className="max-w-3xl">
          <h2 id="workflows-title" className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.12] font-extrabold tracking-[-0.025em] text-balance text-paper">
            What this looks like in practice
          </h2>
          <p className="mt-4 max-w-[60ch] text-on-ink-2">
            Information moves from one step or system to the next on its own, so work gets done faster and more reliably.
          </p>
        </header>

        <ul className="mt-12 grid gap-5 lg:grid-cols-2">
          {workflowExamples.map((example) => (
            <li key={example.id} className="rounded-lg border border-white/12 bg-white/[0.03] p-6 md:p-7">
              <h3 className="font-display text-[1.1875rem] leading-snug font-bold text-paper">{example.title}</h3>
              <ol className="mt-5 flex flex-col gap-0 sm:flex-row sm:items-stretch">
                {example.steps.map((step, i) => (
                  <li key={step} className="relative flex flex-1 items-start gap-3 pb-5 last:pb-0 sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center">
                    {/* connector to the next node */}
                    {i < example.steps.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute top-3 left-[11px] h-full w-px bg-gradient-to-b from-gold/70 to-gold/20 sm:top-[11px] sm:left-1/2 sm:h-px sm:w-full sm:bg-gradient-to-r"
                      />
                    ) : null}
                    <span
                      aria-hidden
                      className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold bg-ink text-[11px] font-bold text-gold tabular-nums"
                    >
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-snug text-paper sm:px-1">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-white/10 pt-4 text-[15px] text-on-ink-2">{example.outcome}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[80ch] text-[14px] leading-relaxed text-on-ink-2">{workflowNote}</p>
      </div>
    </section>
  );
}
