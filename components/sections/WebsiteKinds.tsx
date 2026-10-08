import { CalendarCheck, Globe, ShoppingCart, Smartphone, type LucideIcon } from "lucide-react";
import { websiteKinds } from "@/lib/site";

const icons: Record<(typeof websiteKinds)[number]["id"], LucideIcon> = {
  business: Globe,
  ecommerce: ShoppingCart,
  virtual: Smartphone,
  booking: CalendarCheck,
};

export function WebsiteKinds() {
  return (
    <section aria-label="Kinds of website" className="border-b border-line">
      <ul className="mx-auto grid max-w-[1240px] gap-px bg-line sm:grid-cols-2">
        {websiteKinds.map((kind, i) => {
          const Icon = icons[kind.id];
          return (
            <li key={kind.id} className="reveal bg-bg px-5 py-12 sm:px-8 lg:px-10">
              <div className="flex items-center justify-between">
                <Icon aria-hidden className="h-7 w-7 text-gold" strokeWidth={1.5} />
                <span className="font-mono text-[13px] text-steel-2">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h2 className="font-wide mt-8 text-[28px] leading-none font-extrabold tracking-[-0.02em] text-steel-hi">{kind.title}</h2>
              <ul className="mt-6 space-y-3">
                {kind.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[16px] text-steel-2">
                    <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
