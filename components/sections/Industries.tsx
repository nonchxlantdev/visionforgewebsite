import { Building2, Store, TrendingUp, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { audiences, featuredIndustries, moreIndustries } from "@/lib/site";

const icons: Record<(typeof audiences)[number]["id"], LucideIcon> = {
  small: Store,
  growing: TrendingUp,
  established: Building2,
};

const sectors = [...featuredIndustries.map((i) => i.name.toLowerCase()), ...moreIndustries];
const sectorList = `${sectors.slice(0, -1).join(", ")} and ${sectors[sectors.length - 1]}`;

/** Who we help: three sizes of business, then the sectors in one sentence. */
export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="industries-title"
          title="Who we help"
          lede="Practical solutions sized to your business, from one automated task to workflows that span departments."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {audiences.map((item) => {
            const Icon = icons[item.id];
            return (
              <li key={item.id} className="rounded-lg border border-line bg-paper p-7">
                <Icon aria-hidden className="h-6 w-6 text-accent" strokeWidth={1.75} />
                <h3 className="mt-5 font-display text-[1.25rem] leading-snug font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-[16px] text-body">{item.copy}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-[80ch] text-[16px] text-body">
          We work with {sectorList}. If your business runs on messages, spreadsheets or paperwork, we can help.
        </p>
      </div>
    </section>
  );
}
