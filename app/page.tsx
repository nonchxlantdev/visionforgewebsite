import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { AutomateList } from "@/components/sections/AutomateList";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { PageIndex } from "@/components/sections/PageIndex";
import { Workbench } from "@/components/sections/Workbench";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Workbench />
      <AutomateList />
      <Industries />
      <PageIndex />
      <ClosingBand />
    </>
  );
}
