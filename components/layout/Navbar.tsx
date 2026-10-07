"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { navItems, site } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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
    const elements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
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
    <header ref={headerRef} data-scrolled="false" className="site-header sticky top-0 z-50 no-print">
      <div className="nav-shell flex h-[var(--nav-h)] items-center border-b border-transparent px-4 transition-[background-color,border-color] duration-300 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Vision Forge Studio, home">
          <Logo priority className="h-11 w-11 sm:h-12 sm:w-12" sizes="48px" />
          <span className="hidden font-display text-xl font-bold tracking-[0.06em] text-chrome uppercase sm:inline">
            Vision<span className="text-molten">Forge</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-active={active === item.id}
              aria-current={active === item.id ? "true" : undefined}
              className="nav-link relative py-2 font-mono text-[11px] tracking-[0.16em] text-ash uppercase transition-colors duration-300 hover:text-whitehot data-[active=true]:text-whitehot"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-6 hidden lg:block">
          <CtaLink href={site.whatsapp.href} external className="min-h-11 px-4">
            WhatsApp us
          </CtaLink>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto flex h-12 w-12 items-center justify-center text-chrome lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden strokeWidth={1.5} className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      {open ? (
        <div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="brushed fixed inset-0 z-[60] flex flex-col lg:hidden"
        >
          <div className="flex h-[var(--nav-h)] items-center justify-between px-4">
            <Link href="/" onClick={closeMenu} aria-label="Vision Forge Studio, home">
              <Logo className="h-11 w-11" sizes="44px" />
            </Link>
            <button
              type="button"
              data-close-menu
              className="flex h-12 w-12 items-center justify-center text-chrome"
              onClick={() => {
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
            >
              <X aria-hidden strokeWidth={1.5} className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-5 pt-4" aria-label="Mobile">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="heat-hover flex min-h-16 items-baseline justify-between border-b border-line py-4"
              >
                <span className="font-display text-[2.6rem] leading-none font-bold tracking-[0.01em] uppercase">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] tracking-[0.16em] text-ash">0{index + 1}</span>
              </a>
            ))}
            <div className="pt-8">
              <CtaLink href={site.whatsapp.href} external className="w-full">
                Message us on WhatsApp
              </CtaLink>
            </div>
          </nav>

          <div className="grid border-t border-line">
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-16 items-center justify-between border-b border-line px-5"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-molten">WHATSAPP</span>
              <span>{site.whatsapp.display}</span>
            </a>
            <a href={site.phone.href} className="flex min-h-16 items-center justify-between px-5">
              <span className="font-mono text-[11px] tracking-[0.18em] text-molten">CALL</span>
              <span>{site.phone.display}</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
