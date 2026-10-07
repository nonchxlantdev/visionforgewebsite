import { StrikeGame } from "@/components/game/StrikeGame";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Strike() {
  return (
    <section id="forge" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeading kicker="The forge · play" lines={["Strike while", "it's hot."]} hotLines={[1]}>
            Every system we build starts as raw metal. Hit the anvil at the right moment five times and you&apos;ll
            forge a website, an app, automation, data and cloud into one working system.
          </SectionHeading>
          <ul className="grid grid-cols-3 gap-px border border-line bg-line font-mono text-[10px] tracking-[0.14em] uppercase sm:text-[11px]">
            <li className="bg-forge p-4">
              <span className="block text-sm tracking-normal sm:text-lg text-whitehot">+300 × combo</span>
              <span className="mt-1 block text-ash">White-hot · perfect</span>
            </li>
            <li className="bg-forge p-4">
              <span className="block text-sm tracking-normal sm:text-lg text-molten">+100 × combo</span>
              <span className="mt-1 block text-ash">Gold · good</span>
            </li>
            <li className="bg-forge p-4">
              <span className="block text-sm tracking-normal sm:text-lg text-ash">Crack</span>
              <span className="mt-1 block text-ash">Cold · strike again</span>
            </li>
          </ul>
        </div>
        <div className="mt-12">
          <StrikeGame />
          <noscript>
            <p className="mt-4 font-mono text-sm text-ash">Enable JavaScript to play the forge.</p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
