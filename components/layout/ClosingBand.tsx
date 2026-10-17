import { CtaLink } from "@/components/ui/CtaLink";
import { closing } from "@/lib/site";

/** Shared end-of-page call to action so no page is a dead end. */
export function ClosingBand() {
  return (
    <section aria-labelledby="closing-title" className="bg-mist">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div className="max-w-2xl">
          <h2 id="closing-title" className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold text-balance text-ink">
            {closing.title}
          </h2>
          <p className="mt-4 text-body">{closing.copy}</p>
        </div>
        <CtaLink href={closing.cta.href}>{closing.cta.label}</CtaLink>
      </div>
    </section>
  );
}
