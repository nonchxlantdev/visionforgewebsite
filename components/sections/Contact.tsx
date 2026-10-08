import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { EmailLink } from "@/components/ui/EmailLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

const iconProps = { "aria-hidden": true, className: "h-4 w-4", strokeWidth: 2 } as const;

const phoneClass =
  "inline-flex min-h-11 items-center text-[clamp(1rem,4.2cqi,1.5rem)] whitespace-nowrap text-link tabular-nums underline-offset-4 hover:underline";

function ContactTile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="@container flex min-h-36 flex-col justify-between gap-6 rounded-[24px] bg-canvas p-7">
      <p className="flex items-center gap-2 text-[14px] font-medium text-ink-2">
        {icon}
        {label}
      </p>
      <div>{children}</div>
    </li>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-14 px-4 pt-8 pb-24 sm:px-6 md:pb-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="contact-title"
          kicker="Contact"
          title="Ready to start? Let's talk."
          lede="Message us on WhatsApp, call or email. The first consultation is free."
        />
        <div className="mt-8 flex justify-center">
          <CtaLink href={site.whatsapp.href} external>
            Message us on WhatsApp
          </CtaLink>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          <ContactTile icon={<Mail {...iconProps} />} label="Sales · new projects">
            <EmailLink address={site.sales.display} size="lg" subject="New project enquiry" />
          </ContactTile>
          <ContactTile icon={<Mail {...iconProps} />} label="Support · existing clients">
            <EmailLink address={site.support.display} size="lg" />
          </ContactTile>
          <ContactTile icon={<MessageCircle {...iconProps} />} label="WhatsApp">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className={phoneClass}>
              {site.whatsapp.display}
            </a>
          </ContactTile>
          <ContactTile icon={<Phone {...iconProps} />} label="Call">
            <a href={site.phone.href} className={phoneClass}>
              {site.phone.display}
            </a>
          </ContactTile>
        </ul>

        <p className="mt-10 text-center text-[15px] text-ink-2">{site.trustLine}</p>
      </div>
    </section>
  );
}
