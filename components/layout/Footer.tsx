import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { EmailLink } from "@/components/ui/EmailLink";
import { Logo } from "@/components/ui/Logo";
import { legalItems, navItems, site } from "@/lib/site";

function ColumnTitle({ children }: { children: string }) {
  return <h2 className="label text-gold">{children}</h2>;
}

const linkClass = "inline-flex min-h-10 items-center text-[14px] text-steel-2 transition-colors hover:text-steel-hi";

export function Footer() {
  const { legal } = site;
  return (
    <footer className="no-print border-t border-line bg-bg-2">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr_1fr]">
          <div>
            <Link href="/" aria-label="Vision Forge Studio, home" className="inline-block">
              <Logo className="h-20 w-auto" sizes="97px" />
            </Link>
            <p className="font-wide mt-5 max-w-xs text-[17px] leading-snug font-bold text-steel-hi">
              Automation and websites for Belizean businesses.
            </p>
            <p className="label mt-3 text-steel-2">Based in Belize</p>
          </div>

          <nav aria-label="Pages">
            <ColumnTitle>Pages</ColumnTitle>
            <ul className="mt-3">
              <li>
                <Link href="/" className={linkClass}>
                  Home
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
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
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-[12px] leading-relaxed text-steel-2">
            © {legal.copyrightYear} {legal.registeredName}. Registered in Belize under the Business Names Act, Cap. 247,
            Reg. No. {legal.registrationNumber}. Trading as {legal.tradingName}.
          </p>
          <a
            href="#main"
            aria-label="Back to top"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-[4px] border border-line-2 text-steel-2 transition-colors hover:border-gold hover:text-steel-hi md:self-auto"
          >
            <ArrowUp aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
