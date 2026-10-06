import { Logo } from "@/components/ui/Logo";
import { navItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-14 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <a href="#home" aria-label="Vision Forge Studio, home">
            <Logo className="h-28 w-28" sizes="112px" />
          </a>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline[0]}
            <br />
            {site.tagline[1]}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.16em] text-muted transition-colors duration-300 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] tracking-[0.14em] text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Vision Forge Studio.</p>
        <p>Belize.</p>
      </div>
    </footer>
  );
}
