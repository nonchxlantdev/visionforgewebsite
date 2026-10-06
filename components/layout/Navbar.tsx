"use client";

import { Menu, X } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { navItems, site } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const header = headerRef.current;
    if (!header) return;
    const next = value > 8 ? "true" : "false";
    if (header.dataset.scrolled !== next) header.dataset.scrolled = next;
  });

  useEffect(() => {
    const elements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: [0.15, 0.35, 0.6] },
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
    <header ref={headerRef} className="site-header sticky top-0 z-30 border-b border-line">
      <div className="nav-blur flex h-[4.5rem] items-stretch">
        <a
          href="#home"
          className="flex items-center border-r border-line px-3 sm:px-4"
          aria-label="Vision Forge Studio, home"
        >
          <Logo priority className="h-11 w-11 sm:h-12 sm:w-12" sizes="48px" />
        </a>

        <nav
          className="ml-auto hidden items-center gap-6 px-6 md:flex lg:gap-8 lg:px-8"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-active={active === item.id}
              aria-current={active === item.id ? "true" : undefined}
              className="nav-link relative font-mono text-[11px] tracking-[0.16em] text-muted transition-colors duration-300 hover:text-ink data-[active=true]:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center border-l border-line px-4 md:flex">
          <CtaLink href="#contact" className="h-10 min-h-10 px-4">
            START A PROJECT
          </CtaLink>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="ml-auto flex w-16 items-center justify-center border-l border-line text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden strokeWidth={1.5} className="h-5 w-5" />
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
          className="fixed inset-0 z-50 flex flex-col bg-canvas md:hidden"
        >
          <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-3">
            <a href="#home" onClick={closeMenu} aria-label="Vision Forge Studio, home">
              <Logo className="h-11 w-11" sizes="44px" />
            </a>
            <button
              type="button"
              data-close-menu
              className="flex h-12 w-12 items-center justify-center text-ink"
              onClick={() => {
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
            >
              <X aria-hidden strokeWidth={1.5} className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-5 pt-6" aria-label="Mobile">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-14 items-baseline justify-between border-b border-line py-4"
              >
                <span className="font-sans text-[2rem] leading-none tracking-[-0.04em] text-ink">
                  {item.label}
                </span>
                <span className="font-mono text-[11px] tracking-[0.16em] text-faint">
                  0{index + 1}
                </span>
              </a>
            ))}
            <div className="pt-8">
              <CtaLink href="#contact" className="w-full" onClick={closeMenu}>
                START A PROJECT
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
              <span className="font-mono text-[11px] tracking-[0.18em] text-gold">WHATSAPP</span>
              <span>{site.whatsapp.display}</span>
            </a>
            <a href={site.phone.href} className="flex min-h-16 items-center justify-between px-5">
              <span className="font-mono text-[11px] tracking-[0.18em] text-gold">CALL</span>
              <span>{site.phone.display}</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
