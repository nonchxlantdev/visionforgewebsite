import type { Metadata } from "next";
import { Capabilities } from "@/components/sections/Capabilities";
import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Intro } from "@/components/sections/Intro";
import { Lanes } from "@/components/sections/Lanes";
import { MoreServices } from "@/components/sections/MoreServices";
import { Pains } from "@/components/sections/Pains";
import { Stages } from "@/components/sections/Stages";
import { Workflows } from "@/components/sections/Workflows";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Order follows the October 2026 brief; look is the November 2026 "Option B" redesign. */
export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Pains />
      <Capabilities />
      <Workflows />
      <Stages />
      <Industries />
      <MoreServices />
      <Lanes title="Your next step" />
      <ContactSection />
    </>
  );
}
