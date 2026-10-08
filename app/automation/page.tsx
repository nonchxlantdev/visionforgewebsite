import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { AutomationDetail } from "@/components/sections/AutomationDetail";
import { Demo } from "@/components/sections/Demo";
import { Faq } from "@/components/sections/Faq";
import { WorksWith } from "@/components/sections/WorksWith";
import { CtaLink } from "@/components/ui/CtaLink";
import { faq } from "@/lib/site";

export const metadata: Metadata = {
  title: "Business Automation in Belize | Vision Forge Studio",
  description:
    "Orders, invoices, payment reminders and reports that run themselves. We connect WhatsApp, spreadsheets and accounting software for Belizean businesses. From BZ$1,500.",
  alternates: { canonical: "/automation" },
};

const questions = faq.filter((f) =>
  ["Do I have to change the software I already use?", "Is automation only for big companies?"].includes(f.q),
);

export default function AutomationPage() {
  return (
    <>
      <PageHeader
        kicker="Automation"
        title={
          <>
            Let the busywork <span className="text-gold">run itself.</span>
          </>
        }
        lede="Automation just means the computer does the repeat jobs: saving orders, sending invoices, chasing payments, building reports. You keep doing the work only you can do."
      >
        <CtaLink href="/pricing" arrow>
          Price an automation
        </CtaLink>
      </PageHeader>
      <Demo />
      <AutomationDetail />
      <WorksWith />
      <Faq items={questions} title="Common questions." />
      <ClosingBand />
    </>
  );
}
