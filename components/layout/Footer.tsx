import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { EmailLink } from "@/components/ui/EmailLink";
import { Logo } from "@/components/ui/Logo";
import { legalItems, primaryNav, site } from "@/lib/site";

const titleClass = "font-mono text-[12px] tracking-[0.04em] text-gold uppercase";
const linkClass = "inline-flex min-h-10 items-center text-[15px] text-on-ink-2 transition-colors hover:text-paper";

export function Footer() {
  const { legal } = site;
  return (
    <footer className="on-dark no-print border-t border-ink-line bg-ink text-on-ink-2">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1fr]">
          <div>
            <Link href="/" aria-label="Vision Forge Studio, home" className="inline-flex items-center gap-3">
              <Logo decorative className="h-12 w-auto" sizes="58px" />
              <span className="font-display text-[18px] font-semibold tracking-[-0.01em] text-paper">Vision Forge Studio</span>
            </Link>
            <p className="mt-5 max-w-xs text-[16px]">Business automation, systems integration and digital solutions. Belizean-owned.</p>
          </div>

          <nav aria-label="Pages">
            <h2 className={titleClass}>Pages</h2>
            <ul className="mt-3">
              {[{ href: "/", label: "Home" }, ...primaryNav, { href: "/get-started", label: "Get started" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={titleClass}>Contact</h2>
            <ul className="mt-3">
              <li>
                <EmailLink address={site.sales.display} size="sm" tone="onDark" />
              </li>
              <li>
                <Link href="/get-started" className={linkClass}>
                  Send us a message
                </Link>
              </li>
            </ul>
          </div>

          <nav aria-label="Legal">
            <h2 className={titleClass}>Legal</h2>
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

        <p aria-hidden className="font-display text-[clamp(2.75rem,8.6vw,7rem)] leading-[0.9] font-semibold tracking-[-0.06em] text-paper select-none">
          Vision Forge Studio
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-ink-line py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-[13px] leading-relaxed">
            © {legal.copyrightYear} {legal.registeredName}, registered in Belize. Trading as {legal.tradingName}.
          </p>
          <a
            href="#main"
            aria-label="Back to top"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full border border-white/25 text-paper transition-colors hover:bg-white/10 md:self-auto"
          >
            <ArrowUp aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
