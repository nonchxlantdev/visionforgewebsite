import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { EmailLink } from "@/components/ui/EmailLink";
import { Logo } from "@/components/ui/Logo";
import { legalItems, site } from "@/lib/site";

const studio = [
  { href: "/#services", label: "Services" },
  { href: "/#forge", label: "The Forge" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
] as const;

function ColumnTitle({ children }: { children: string }) {
  return <h2 className="font-mono text-[11px] tracking-[0.2em] text-molten uppercase">{children}</h2>;
}

const linkClass = "heat-hover inline-flex min-h-10 items-center text-[15px] text-ash";

export function Footer() {
  const { legal } = site;
  return (
    <footer className="no-print relative z-10 border-t border-line bg-[#080605]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr] lg:px-10">
        <div>
          <Link href="/" aria-label="Vision Forge Studio, home" className="inline-block">
            <Logo className="h-28 w-28" sizes="112px" />
          </Link>
          <p className="mt-5 max-w-xs font-display text-2xl leading-[1.05] font-bold uppercase">
            <span className="chrome-text">{site.tagline[0]}</span>
            <br />
            <span className="hot-text">{site.tagline[1]}</span>
          </p>
          <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-ash uppercase">Based in Belize</p>
        </div>

        <nav aria-label="Studio">
          <ColumnTitle>Studio</ColumnTitle>
          <ul className="mt-4">
            {studio.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ColumnTitle>Contact</ColumnTitle>
          <ul className="mt-4">
            <li>
              <EmailLink address={site.sales.display} size="sm" className="text-ash" />
            </li>
            <li>
              <EmailLink address={site.support.display} size="sm" className="text-ash" />
            </li>
            <li>
              <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp {site.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={site.phone.href} className={linkClass}>
                Call {site.phone.display}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Legal">
          <ColumnTitle>Legal</ColumnTitle>
          <ul className="mt-4">
            {legalItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="max-w-3xl text-[13px] leading-relaxed text-ash">
            © {legal.copyrightYear} {legal.registeredName}. Registered in Belize under the Business Names Act, Cap. 247,
            Reg. No. {legal.registrationNumber}. Trading as {legal.tradingName}.
          </p>
          <a
            href="#main"
            aria-label="Back to top"
            className="group flex h-12 w-12 shrink-0 items-center justify-center self-end border border-line text-ash transition-[border-color,color,box-shadow] duration-300 hover:border-molten hover:text-whitehot hover:shadow-[0_0_24px_rgba(255,90,31,0.45)] md:self-auto"
          >
            <ArrowUp aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
