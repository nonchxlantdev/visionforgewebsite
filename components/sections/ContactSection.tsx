import { ContactForm } from "@/components/sections/ContactForm";
import { EmailLink } from "@/components/ui/EmailLink";
import { closing, site } from "@/lib/site";

export function ContactSection({ title = closing.title }: { title?: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-mist">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <h2 id="contact-title" className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold text-balance text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-[46ch] text-body">
            Tell us a little about your business and what isn&apos;t working. The first conversation is free.
          </p>
          <p className="mt-8 text-body">Prefer email?</p>
          <EmailLink address={site.sales.display} subject="New project enquiry" />
        </div>
        <div className="rounded-lg border border-line bg-paper p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
