import { Check, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { websiteIncludes } from "@/lib/site";

/** A static browser-frame sketch of a shop site, so people can picture the result. */
function BrowserFrame() {
  return (
    <div aria-hidden className="overflow-hidden rounded-[8px] border border-line-2 bg-bg-3 shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 border-b border-line-2 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line-2" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-2" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-2" />
        <span className="ml-3 flex-1 rounded-[4px] bg-bg px-3 py-1 font-mono text-[12px] text-steel-2">yourshop.bz</span>
      </div>
      <div className="bg-paper p-6 text-paper-ink">
        <div className="flex items-center justify-between">
          <span className="font-wide text-[18px] font-extrabold">Maria&apos;s Market</span>
          <span className="label text-paper-ink-2">Shop · About · Contact</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {["Water, 6 pk", "Rice, 25 lb", "Cooking oil"].map((name, i) => (
            <div key={name} className="rounded-[4px] border border-[#d8ccb5] bg-[#f7f1e4] p-3">
              <div className="h-16 rounded-[3px] bg-[#e3d6bd]" />
              <p className="mt-2 text-[13px] font-semibold">{name}</p>
              <p className="font-mono text-[12px] text-paper-ink-2">BZ${[12, 38, 15][i]}.00</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-[4px] bg-paper-ink px-4 py-3 text-paper">
          <span className="text-[13px]">2 items in your order</span>
          <span className="flex items-center gap-2 text-[13px] font-semibold text-gold">
            <MessageCircle className="h-4 w-4" /> Order on WhatsApp
          </span>
        </div>
      </div>
    </div>
  );
}

export function SiteIncludes() {
  return (
    <section aria-labelledby="includes-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div>
          <SectionHeading id="includes-title" kicker="Every site includes" title="Built to bring in work, not just look nice." />
          <ul className="mt-10 grid border-t border-line sm:grid-cols-2">
            {websiteIncludes.map((item) => (
              <li key={item} className="flex min-h-14 items-center gap-3 border-b border-line text-[16px] text-steel-hi sm:odd:pr-6">
                <Check aria-hidden className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <BrowserFrame />
      </div>
    </section>
  );
}
