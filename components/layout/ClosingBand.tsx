import { CtaLink } from "@/components/ui/CtaLink";
import { closing } from "@/lib/site";

/** Shared end-of-page call to action so no page is a dead end. */
export function ClosingBand() {
  return (
    <section aria-labelledby="closing-title" className="px-3 py-16 sm:px-6 md:py-24">
      <div className="on-dark mx-auto flex max-w-[1168px] flex-col gap-8 rounded-[28px] bg-ink px-6 py-14 sm:px-10 md:flex-row md:items-end md:justify-between md:rounded-[36px] md:px-12 md:py-20">
        <div className="max-w-2xl">
          <h2 id="closing-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-paper">
            {closing.title}
          </h2>
          <p className="mt-4 text-on-ink-2">{closing.copy}</p>
        </div>
        <CtaLink href={closing.cta.href} variant="gold">
          {closing.cta.label}
        </CtaLink>
      </div>
    </section>
  );
}
