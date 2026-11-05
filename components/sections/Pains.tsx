import { pains } from "@/lib/site";

/** Heading on the left; the problems as a numbered list on the right. */
export function Pains() {
  return (
    <section aria-labelledby="pains-title" className="px-5 pb-24 sm:px-8 md:pb-32">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10 lg:flex-row lg:gap-20">
        <header className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:flex-1 lg:self-start">
          <p className="mb-4 font-mono text-[12px] tracking-[0.04em] text-accent uppercase">/ Problems</p>
          <h2 id="pains-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-ink">
            The problems we solve
          </h2>
          <p className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-body">
            Most businesses we meet aren&apos;t short on effort. Manual steps and disconnected tools are quietly slowing them down.
          </p>
        </header>

        <ol className="border-t border-line lg:flex-[2]">
          {pains.map((pain, i) => (
            <li key={pain.id} className="flex gap-5 border-b border-line py-6 md:gap-8 md:py-7">
              <span className="w-7 shrink-0 pt-1 font-mono text-[13px] text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-ink md:text-[1.375rem]">“{pain.quote}”</p>
                <p className="mt-2 text-[16px] leading-relaxed text-body">{pain.answer}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
