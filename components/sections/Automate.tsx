import { CalendarCheck, ChartColumn, ClipboardList, Globe, Scale, Wallet, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { automations, type AutomationIcon } from "@/lib/site";

const icons: Record<AutomationIcon, LucideIcon> = {
  wallet: Wallet,
  forms: ClipboardList,
  bookings: CalendarCheck,
  reports: ChartColumn,
  accounts: Scale,
  website: Globe,
};

export function Automate() {
  return (
    <section id="automate" aria-labelledby="automate-title" className="scroll-mt-14 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="automate-title"
          kicker="What we automate"
          title="Same idea, everywhere you lose time."
          lede="If it sounds like your week, we can take it off your plate."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {automations.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li
                key={item.id}
                className="reveal flex flex-col rounded-[24px] bg-canvas p-7 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-page text-accent shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="mt-6 text-[21px] leading-[1.25] font-semibold tracking-[-0.02em] text-ink">“{item.pain}”</p>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{item.fix}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
