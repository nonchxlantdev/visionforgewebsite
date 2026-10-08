import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { EmailLink } from "@/components/ui/EmailLink";
import { Logo } from "@/components/ui/Logo";
import { legalItems, navItems, site } from "@/lib/site";

function ColumnTitle({ children }: { children: string }) {
  return <h2 className="text-[13px] font-semibold text-ink">{children}</h2>;
}

const linkClass = "inline-flex min-h-10 items-center text-[13px] text-ink-2 transition-colors hover:text-ink hover:underline";

export function Footer() {
  const { legal } = site;
  return (
    <footer className="no-print bg-canvas">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="grid gap-10 border-b border-hairline py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr]">
          <div>
            <Link href="/" aria-label="Vision Forge Studio, home" className="inline-block">
              <Logo className="h-14 w-14" sizes="56px" />
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-snug text-ink">Automation and websites for Belizean businesses.</p>
            <p className="mt-2 text-[13px] text-ink-2">Based in Belize</p>
          </div>

          <nav aria-label="Studio">
            <ColumnTitle>Studio</ColumnTitle>
            <ul className="mt-3">
              {navItems.map((item) => (
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
            <ul className="mt-3">
              <li>
                <EmailLink address={site.sales.display} size="sm" tone="muted" />
              </li>
              <li>
                <EmailLink address={site.support.display} size="sm" tone="muted" />
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
            <ul className="mt-3">
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

        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-[12px] leading-relaxed text-ink-2">
            © {legal.copyrightYear} {legal.registeredName}. Registered in Belize under the Business Names Act, Cap. 247,
            Reg. No. {legal.registrationNumber}. Trading as {legal.tradingName}.
          </p>
          <a
            href="#main"
            aria-label="Back to top"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full border border-hairline text-ink-2 transition-colors hover:border-ink/30 hover:text-ink md:self-auto"
          >
            <ArrowUp aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
