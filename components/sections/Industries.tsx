import { SectionHeading } from "@/components/ui/SectionHeading";
import { audiences, featuredIndustries, moreIndustries } from "@/lib/site";

const SIZE: Record<(typeof audiences)[number]["id"], string> = {
  small: "S",
  growing: "M",
  established: "L",
};

const sectors = [...featuredIndustries.map((i) => i.name.toLowerCase()), ...moreIndustries];

/** Who we help: three sizes of business, then every sector as a tag. */
export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="px-5 pb-24 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="industries-title"
          eyebrow="Clients"
          title="Who we help"
          lede="Practical solutions sized to your business, from one automated task to workflows that span departments."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {audiences.map((item) => (
            <li key={item.id} className="flex flex-col gap-3.5 rounded-[24px] border border-line p-7 md:p-8">
              <span aria-hidden className="self-start rounded-full bg-brand-soft px-2.5 py-1 font-mono text-[11px] text-brand-hover">
                {SIZE[item.id]}
              </span>
              <h3 className="font-display text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-ink">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-body">{item.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <h3 className="text-[15px] font-semibold text-ink">We work with</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <li key={sector} className="rounded-full bg-mist px-3.5 py-2 text-[14px] text-ink">
                {sector}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[40ch] font-display text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-ink md:text-[1.5rem]">
            If your business runs on messages, spreadsheets or paperwork, we can help.
          </p>
        </div>
      </div>
    </section>
  );
}
