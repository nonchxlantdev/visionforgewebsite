import { CtaLink } from "@/components/ui/CtaLink";
import { site } from "@/lib/site";

/** Shared end-of-page call to action so no page is a dead end. */
export function ClosingBand({ secondary = { label: "Price your project", href: "/pricing" } }: { secondary?: { label: string; href: string } }) {
  return (
    <section aria-labelledby="closing-title" className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <p className="label text-gold">Free first chat</p>
          <h2 id="closing-title" className="font-wide mt-4 text-[clamp(2rem,4.6vw,3.5rem)] leading-none font-extrabold tracking-[-0.025em] text-steel-hi">
            Ready when you are.
          </h2>
          <p className="mt-4 max-w-xl text-steel-2">Tell us what&apos;s slowing your business down. We&apos;ll reply with a plan and a fixed price.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CtaLink href={site.whatsapp.href} external>
            WhatsApp us
          </CtaLink>
          <CtaLink href={secondary.href} variant="ghost" arrow>
            {secondary.label}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
