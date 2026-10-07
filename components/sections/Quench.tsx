import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { EmailLink } from "@/components/ui/EmailLink";
import { HeatText } from "@/components/forge/HeatText";
import { Label } from "@/components/ui/Label";
import { site } from "@/lib/site";

const iconProps = { "aria-hidden": true, className: "h-4 w-4", strokeWidth: 1.75 } as const;

/** One value per tile; text sizes off the tile width (cqi) so every tile reads the same. */
const phoneClass =
  "heat-hover inline-flex min-h-11 items-center py-2 font-mono text-[clamp(0.75rem,4.6cqi,1.6rem)] whitespace-nowrap text-chrome underline decoration-chrome/20 decoration-1 underline-offset-[6px] hover:decoration-molten";

function ContactTile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="@container flex min-h-36 flex-col justify-between gap-6 bg-forge p-5 transition-colors duration-300 hover:bg-soot sm:p-8">
      <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-molten uppercase">
        {icon}
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

export function Quench() {
  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-20 overflow-hidden border-t border-line px-4 py-24 sm:px-6 lg:px-10 lg:py-36"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(60%_70%_at_30%_100%,rgba(255,90,31,0.16),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1400px]">
        <Label>Start something · quench</Label>
        <HeatText
          lines={["Have an idea?", "Let's forge it."]}
          hotLines={[1]}
          restWeight={800}
          className="mt-6 font-display text-[clamp(3.4rem,10vw,9rem)] leading-[0.84] uppercase"
        />
        <p className="mt-8 max-w-[38rem] text-base leading-relaxed text-ash sm:text-lg">
          A website, a custom business system, an automation project, or something nobody has built yet. Tell us what
          you&apos;re working on and we&apos;ll tell you how we&apos;d forge it.
        </p>

        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
          <ContactTile icon={<Mail {...iconProps} />} label="Sales · new projects">
            <EmailLink address={site.sales.display} size="fluid" subject="New project enquiry" />
          </ContactTile>
          <ContactTile icon={<Mail {...iconProps} />} label="Support · existing clients">
            <EmailLink address={site.support.display} size="fluid" />
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
        </div>

        <div className="mt-10">
          <CtaLink href={site.projectMailto}>Start a project</CtaLink>
        </div>
      </div>
    </section>
  );
}
