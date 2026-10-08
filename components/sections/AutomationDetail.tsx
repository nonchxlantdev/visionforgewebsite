import { SectionHeading } from "@/components/ui/SectionHeading";
import { automations } from "@/lib/site";

const insteadDetail: Record<string, string> = {
  payments: "Reminders go out on WhatsApp or email on the day you choose, and stop as soon as the customer pays.",
  forms: "Staff fill in a short form on their phone. It saves itself, adds photos and the time, and builds the report.",
  bookings: "Customers pick a free slot themselves. You both get a reminder, and double-bookings can't happen.",
  reports: "Your numbers update on their own. Open one page on Friday and the report is already done.",
  accounts: "Each sale is recorded once and lands in your books automatically, so the totals always match.",
  website: "A fast site with your services, photos and WhatsApp button, so new customers can find you and reach you.",
};

export function AutomationDetail() {
  return (
    <section id="every-automation" aria-labelledby="every-title" className="scroll-mt-24 border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="every-title"
          kicker="Six jobs we take off your plate"
          title="What you do now. What happens instead."
        />
        <div className="mt-12 border-t border-line">
          <div className="label hidden grid-cols-[3rem_1fr_1fr] gap-8 border-b border-line py-4 text-steel-2 md:grid">
            <span />
            <span>What you do now</span>
            <span className="text-gold">What happens instead</span>
          </div>
          <ol>
            {automations.map((item, i) => (
              <li key={item.id} className="reveal grid gap-3 border-b border-line py-8 md:grid-cols-[3rem_1fr_1fr] md:gap-8">
                <span className="font-mono text-[13px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-wide text-[20px] leading-tight font-bold text-steel-hi">“{item.pain}”</p>
                <div>
                  <p className="text-[17px] font-semibold text-steel-hi">{item.fix}</p>
                  <p className="mt-2 text-[15px] text-steel-2">{insteadDetail[item.id]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
