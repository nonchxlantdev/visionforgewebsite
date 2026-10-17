import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Lanes } from "@/components/sections/Lanes";
import { Pains } from "@/components/sections/Pains";
import { Stages } from "@/components/sections/Stages";
import { WhyUs } from "@/components/sections/WhyUs";
import { Workbench } from "@/components/sections/Workbench";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Pains />
      <Stages />
      <Workbench />
      <Industries />
      <WhyUs />
      <Lanes title="Two ways to start" />
      <ContactSection />
    </>
  );
}
