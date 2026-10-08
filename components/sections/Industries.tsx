import {
  BriefcaseBusiness,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Store,
  TreePalm,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries, industryRibbon, type IndustryIcon } from "@/lib/site";

const icons: Record<IndustryIcon, LucideIcon> = {
  cart: ShoppingCart,
  phone: Smartphone,
  food: UtensilsCrossed,
  palm: TreePalm,
  health: Stethoscope,
  briefcase: BriefcaseBusiness,
  store: Store,
  truck: Truck,
};

function Ribbon() {
  return (
    <ul className="flex shrink-0 items-center gap-3 pr-3">
      {industryRibbon.map((name) => (
        <li key={name} className="label border border-line px-4 py-2.5 whitespace-nowrap text-steel-2">
          {name}
        </li>
      ))}
    </ul>
  );
}

export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="industries-title"
          kicker="Who we work with"
          title="Built for the way Belize does business."
          lede="From online stores to tour operators, we build around how your business already runs, not the other way round."
        />
        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.id} className="group reveal bg-bg p-7 transition-colors duration-300 hover:bg-bg-2">
                <Icon aria-hidden className="h-6 w-6 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.6} />
                <h3 className="font-wide mt-6 text-[18px] leading-tight font-bold text-steel-hi">{item.name}</h3>
                <p className="mt-2.5 text-[15px] text-steel-2">{item.copy}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="marquee mx-auto max-w-[1320px] overflow-hidden pb-6">
        <p className="sr-only">We also work with {industryRibbon.join(", ")}.</p>
        <div aria-hidden className="marquee-track flex w-max">
          <Ribbon />
          <Ribbon />
        </div>
      </div>
      <p className="mx-auto max-w-[1240px] px-5 pb-16 text-[15px] text-steel-2 sm:px-8 lg:px-10">
        Don&apos;t see your business? If it runs on messages, spreadsheets or paperwork, we can help.
      </p>
    </section>
  );
}
