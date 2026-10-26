import { AppWindow, Cable, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { coreServices, keyMessage, type ServiceId } from "@/lib/site";

const icons: Partial<Record<ServiceId, LucideIcon>> = {
  automation: Workflow,
  integration: Cable,
  ai: Sparkles,
  build: AppWindow,
};

/** Lower-cases the first word for mid-sentence use, but keeps acronyms like "AI". */
const linkName = (title: string) => (/^[A-Z]{2}/.test(title) ? title : title.charAt(0).toLowerCase() + title.slice(1));

/** The four core services, automation and integration first and given the most weight. */
export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading id="capabilities-title" title="What we do" lede={keyMessage} />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {coreServices.map((service, index) => {
            const Icon = icons[service.id] ?? Workflow;
            const lead = index < 2;
            return (
              <li
                key={service.id}
                className={`flex flex-col rounded-lg border bg-paper p-7 md:p-8 ${lead ? "border-ink/25 shadow-[0_1px_0_rgba(11,22,38,0.04),0_12px_32px_-20px_rgba(11,22,38,0.35)]" : "border-line"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-gold">
                    <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-[14px] font-semibold text-muted tabular-nums">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-[1.375rem] leading-snug font-bold text-ink">{service.title}</h3>
                <p className="mt-3 text-body">{service.summary}</p>
                <ul className="mt-5 space-y-2">
                  {service.weDo.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-3 text-[16px] text-body">
                      <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services#${service.id}`}
                  className="mt-6 inline-flex min-h-11 items-center self-start text-[16px] font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                >
                  More about {linkName(service.title)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
