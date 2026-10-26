import { CtaLink } from "@/components/ui/CtaLink";
import { additionalServices } from "@/lib/site";

/** Websites, apps and other digital services: visible, but kept below automation and integration. */
export function MoreServices() {
  return (
    <section aria-labelledby="more-services-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 md:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10">
        <div>
          <h2 id="more-services-title" className="font-display text-[1.5rem] leading-snug font-extrabold tracking-[-0.02em] text-ink md:text-[1.75rem]">
            Also from Vision Forge
          </h2>
          <p className="mt-3 max-w-[48ch] text-body">The digital services that sit alongside our automation and integration work.</p>
        </div>
        <div>
          <ul className="flex flex-wrap gap-2">
            {additionalServices.map((item) => (
              <li key={item} className="rounded-full border border-line bg-paper px-4 py-2 text-[15px] text-ink">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <CtaLink href="/services#build" variant="link">
              See all services
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
