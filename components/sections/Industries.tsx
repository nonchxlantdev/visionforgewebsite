import { BriefcaseBusiness, ShoppingCart, Stethoscope, Store, TreePalm, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredIndustries, moreIndustries, type FeaturedIndustryIcon } from "@/lib/site";

const icons: Record<FeaturedIndustryIcon, LucideIcon> = {
  cart: ShoppingCart,
  food: UtensilsCrossed,
  palm: TreePalm,
  health: Stethoscope,
  briefcase: BriefcaseBusiness,
  store: Store,
};

const moreList = `${moreIndustries.slice(0, -1).join(", ")} and ${moreIndustries[moreIndustries.length - 1]}`;

export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="industries-title"
          title="From the corner shop to the established company."
          lede="We work around how your business already runs, not the other way round."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredIndustries.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.id} className="rounded-lg border border-line bg-paper p-7">
                <Icon aria-hidden className="h-6 w-6 text-accent" strokeWidth={1.75} />
                <h3 className="mt-5 font-display text-[1.1875rem] leading-snug font-bold text-ink">{item.name}</h3>
                <p className="mt-2 text-[16px] text-body">{item.copy}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-[70ch] text-body">
          We also work with {moreList}. If your business runs on messages, spreadsheets or paperwork, we can help.
        </p>
      </div>
    </section>
  );
}
