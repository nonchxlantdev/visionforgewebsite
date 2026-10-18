import { CtaLink } from "@/components/ui/CtaLink";
import { closing } from "@/lib/site";

/** Shared end-of-page call to action so no page is a dead end. */
export function ClosingBand() {
  return (
    <section aria-labelledby="closing-title" className="on-dark bg-ink bg-[radial-gradient(90%_120%_at_10%_100%,#1d2c46_0%,#0b1626_65%)]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div className="max-w-2xl">
          <h2 id="closing-title" className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.12] font-extrabold tracking-[-0.025em] text-balance text-paper">
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
