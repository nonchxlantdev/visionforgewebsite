import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { Lanes } from "@/components/sections/Lanes";

export const metadata: Metadata = {
  title: "Get Started | Vision Forge Studio",
  description:
    "Tell us about your business and what's slowing you down. Smaller projects start from BZ$500; complex integrations and multi-step workflows start with a free consultation.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <>
      <PageHeader
        title="Let's start with a conversation."
        lede="Tell us about your business and what's slowing you down. The first conversation is free, and there's no obligation."
      />
      <Lanes />
      <ContactSection title="Tell us about your business" />
    </>
  );
}
