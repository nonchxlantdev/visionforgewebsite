import { ContactForm } from "@/components/sections/ContactForm";
import { EmailLink } from "@/components/ui/EmailLink";
import { closing, site } from "@/lib/site";

export function ContactSection({ title = closing.title }: { title?: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink">
      <div className="mx-auto grid max-w-[1120px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="on-dark flex flex-col">
          <h2 id="contact-title" className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance text-paper">
            {title}
          </h2>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-on-ink-2">
            Tell us a little about your business and what isn&apos;t working. The first conversation is free.
          </p>
          <div className="mt-10 lg:mt-auto">
            <p className="text-[14px] text-on-ink-2">Prefer email?</p>
            <EmailLink address={site.sales.display} subject="New project inquiry" size="lg" tone="onDark" className="font-semibold" />
          </div>
        </div>
        <div className="rounded-[28px] bg-paper p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
