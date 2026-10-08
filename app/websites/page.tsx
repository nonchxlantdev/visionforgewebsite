import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteIncludes } from "@/components/sections/SiteIncludes";
import { WebsiteKinds } from "@/components/sections/WebsiteKinds";
import { CtaLink } from "@/components/ui/CtaLink";

export const metadata: Metadata = {
  title: "Websites, Online Stores & Virtual Shops in Belize | Vision Forge Studio",
  description:
    "Business websites, e-commerce stores, virtual shops for Instagram and WhatsApp sellers, and booking sites for Belizean businesses. From BZ$500.",
  alternates: { canonical: "/websites" },
};

export default function WebsitesPage() {
  return (
    <>
      <PageHeader
        kicker="Websites"
        title={
          <>
            A website that <span className="text-gold">brings the orders in.</span>
          </>
        }
        lede="Whether you sell from a shop, from Instagram or by appointment, we build the site around how your customers actually buy, and connect it to the rest of your business."
      >
        <CtaLink href="/pricing" arrow>
          Price a website
        </CtaLink>
      </PageHeader>
      <WebsiteKinds />
      <SiteIncludes />
      <ClosingBand />
    </>
  );
}
