import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArchitectureDiagram } from "@/components/visuals/ArchitectureDiagram";

export function ConnectedSystem() {
  return (
    <section id="system" className="scroll-mt-20 border-t border-line px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          kicker="How we think · try it"
          lines={["Not just a website.", "One connected system."]}
          hotLines={[1]}
        >
          We look past individual pages and features. Everything we forge is built to work with everything else, the
          way your business actually operates. Weld the six parts together and watch it come online.
        </SectionHeading>
        <ArchitectureDiagram />
      </div>
    </section>
  );
}
