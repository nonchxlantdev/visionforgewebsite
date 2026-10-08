import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { CtaLink } from "@/components/ui/CtaLink";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Vision Forge Studio",
  description: "WhatsApp, call or email Vision Forge Studio in Belize. The first consultation is free.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title={
          <>
            Let&apos;s <span className="text-gold">talk.</span>
          </>
        }
        lede="Message us on WhatsApp, call or email. Tell us what's slowing your business down. The first consultation is free."
      >
        <CtaLink href={site.whatsapp.href} external>
          Message us on WhatsApp
        </CtaLink>
      </PageHeader>
      <Contact />
    </>
  );
}
