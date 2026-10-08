"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { navItems, site } from "@/lib/site";

function Brand() {
  return (
    <span className="font-wide hidden text-[14px] font-bold tracking-[0.06em] text-steel-hi uppercase sm:inline">
      Vision <span className="text-gold">Forge</span> Studio
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => {
      const header = headerRef.current;
      if (!header) return;
      const next = window.scrollY > 8 ? "true" : "false";
      if (header.dataset.scrolled !== next) header.dataset.scrolled = next;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-close-menu]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>("a, button"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header ref={headerRef} data-scrolled="false" className="site-header no-print sticky top-0 z-50">
      <div className="nav-shell border-b border-line transition-[background-color] duration-300">
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1240px] items-center gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="Vision Forge Studio, home">
            <Logo priority className="h-11 w-auto" sizes="54px" />
            <Brand />
          </Link>

          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="relative py-2 text-[14px] text-steel-2 transition-colors hover:text-steel-hi aria-[current=page]:text-steel-hi aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-[1.05rem] aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center rounded-[4px] bg-gold px-4 text-[14px] font-semibold text-on-gold transition-colors hover:bg-gold-hi lg:inline-flex"
          >
            WhatsApp us
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center text-steel-hi lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden strokeWidth={1.75} className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
        >
          <div className="flex h-[var(--nav-h)] items-center justify-between border-b border-line px-5">
            <Link href="/" onClick={closeMenu} className="flex min-h-11 items-center gap-3" aria-label="Vision Forge Studio, home">
              <Logo className="h-11 w-auto" sizes="54px" />
              <Brand />
            </Link>
            <button
              type="button"
              data-close-menu
              className="flex h-11 w-11 items-center justify-center text-steel-hi"
              onClick={() => {
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
            >
              <X aria-hidden strokeWidth={1.75} className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-5 pt-2" aria-label="Mobile">
            {[{ href: "/", label: "Home" }, ...navItems].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                className="flex min-h-16 items-baseline justify-between border-b border-line py-4 text-steel-hi aria-[current=page]:text-gold"
              >
                <span className="font-wide text-[2rem] leading-none font-bold tracking-[-0.02em]">{item.label}</span>
                <span className="label text-steel-2">0{index + 1}</span>
              </Link>
            ))}
            <div className="pt-8">
              <CtaLink href={site.whatsapp.href} external className="w-full">
                Message us on WhatsApp
              </CtaLink>
            </div>
          </nav>

          <a href={site.phone.href} className="flex min-h-14 items-center justify-between border-t border-line px-5 text-[15px] text-steel">
            <span className="label text-gold">Call</span>
            <span>{site.phone.display}</span>
          </a>
        </div>
      ) : null}
    </header>
  );
}
