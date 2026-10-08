import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { EmailLink } from "@/components/ui/EmailLink";
import { site } from "@/lib/site";

const iconProps = { "aria-hidden": true, className: "h-4 w-4", strokeWidth: 2 } as const;

const phoneClass =
  "inline-flex min-h-11 items-center text-[clamp(1rem,4.4cqi,1.5rem)] whitespace-nowrap text-steel-hi tabular-nums underline decoration-gold/60 underline-offset-[6px] hover:decoration-gold";

function Tile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="@container flex min-h-40 flex-col justify-between gap-6 bg-bg p-7 transition-colors hover:bg-bg-2">
      <p className="label flex items-center gap-2 text-gold">
        {icon}
        {label}
      </p>
      <div>{children}</div>
    </li>
  );
}

export function Contact() {
  return (
    <section aria-label="Ways to reach us" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-10">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2">
          <Tile icon={<MessageCircle {...iconProps} />} label="WhatsApp · fastest">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className={phoneClass}>
              {site.whatsapp.display}
            </a>
          </Tile>
          <Tile icon={<Phone {...iconProps} />} label="Call">
            <a href={site.phone.href} className={phoneClass}>
              {site.phone.display}
            </a>
          </Tile>
          <Tile icon={<Mail {...iconProps} />} label="Sales · new projects">
            <EmailLink address={site.sales.display} size="lg" subject="New project enquiry" />
          </Tile>
          <Tile icon={<Mail {...iconProps} />} label="Support · existing clients">
            <EmailLink address={site.support.display} size="lg" />
          </Tile>
        </ul>
        <p className="label mt-8 text-steel-2">{site.trustLine}</p>
      </div>
    </section>
  );
}
