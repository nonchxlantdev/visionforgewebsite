import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { coreServices, keyMessage } from "@/lib/site";

/** Lower-cases the first word for mid-sentence use, but keeps acronyms like "AI". */
const linkName = (title: string) => (/^[A-Z]{2}/.test(title) ? title : title.charAt(0).toLowerCase() + title.slice(1));

type Tone = "dark" | "light" | "brand";

/** Card order sets the bento: wide dark, narrow light, narrow blue, wide light. */
const LAYOUT: ReadonlyArray<{ tone: Tone; span: string }> = [
  { tone: "dark", span: "lg:col-span-7" },
  { tone: "light", span: "lg:col-span-5" },
  { tone: "brand", span: "lg:col-span-5" },
  { tone: "light", span: "lg:col-span-7" },
];

const CARD: Record<Tone, string> = {
  dark: "on-dark bg-ink text-paper",
  light: "border border-line bg-mist text-ink",
  brand: "on-dark bg-brand text-paper",
};

const SUMMARY: Record<Tone, string> = {
  dark: "text-on-ink-2",
  light: "text-body",
  brand: "text-white/90",
};

const LINK: Record<Tone, string> = {
  dark: "text-paper decoration-white/40",
  light: "text-accent decoration-accent/30",
  brand: "text-paper decoration-white/50",
};

/** A small, decorative sketch at the top of the two wide-format cards. */
function Sketch({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div aria-hidden className="mb-2 flex flex-col gap-2 rounded-2xl bg-ink-raised p-4">
        {[40, 55, 30].map((w, i) => (
          <div key={w} className="flex items-center gap-2.5">
            <span className={`h-[18px] w-[18px] rounded-full ${i < 2 ? "bg-success" : "border-2 border-gold"}`} />
            <span className="h-2 rounded bg-ink-line" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div aria-hidden className="mb-2 flex h-20 items-center justify-center">
        <span className="h-11 w-11 rounded-xl border border-line bg-paper" />
        <span className="h-0.5 w-10 bg-brand" />
        <span className="h-14 w-14 rounded-2xl bg-brand" />
        <span className="h-0.5 w-10 bg-brand" />
        <span className="h-11 w-11 rounded-xl border border-line bg-paper" />
      </div>
    );
  }
  if (index === 3) {
    return (
      <div aria-hidden className="mb-2 overflow-hidden rounded-2xl border border-line bg-paper">
        <div className="flex gap-1.5 border-b border-line px-3 py-2.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2 w-2 rounded-full bg-line" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2.5 p-4">
          <span className="col-span-3 h-9 rounded-lg bg-brand-soft" />
          <span className="h-12 rounded-lg bg-mist" />
          <span className="h-12 rounded-lg bg-mist" />
          <span className="h-12 rounded-lg bg-mist" />
        </div>
      </div>
    );
  }
  return null;
}

/** The four core services as a bento grid; automation and integration lead. */
export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="px-5 pb-24 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading id="capabilities-title" eyebrow="Services" title="What we do" lede={keyMessage} />
        <ul className="mt-12 grid gap-4 lg:grid-cols-12">
          {coreServices.map((service, index) => {
            const { tone, span } = LAYOUT[index % LAYOUT.length];
            return (
              <li key={service.id} className={`flex flex-col gap-4 rounded-[28px] p-7 md:p-9 ${CARD[tone]} ${span}`}>
                <Sketch index={index} />
                <span className={`font-mono text-[12px] tabular-nums ${tone === "light" ? "text-muted" : "text-white/85"}`}>0{index + 1}</span>
                <h3 className="font-display text-[1.625rem] leading-tight font-semibold tracking-[-0.03em] md:text-[1.75rem]">{service.title}</h3>
                <p className={`text-[16px] leading-relaxed ${SUMMARY[tone]}`}>{service.summary}</p>
                <ul className="flex flex-col gap-2">
                  {service.weDo.slice(0, 3).map((item) => (
                    <li key={item} className={`flex gap-2.5 text-[15px] leading-snug ${tone === "light" ? "text-ink" : "text-paper"}`}>
                      <span aria-hidden>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${service.id}`}
                  className={`mt-auto inline-flex min-h-11 items-center self-start pt-2 text-[15px] font-semibold underline underline-offset-4 ${LINK[tone]}`}
                >
                  More about {linkName(service.title)} →
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
