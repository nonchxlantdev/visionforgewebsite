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
    <header ref={headerRef} data-scrolled="false" className="site-header no-print sticky top-0 z-50">
      <div className="nav-shell border-b border-transparent transition-[background-color,border-color] duration-300">
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1120px] items-center px-4 sm:px-6">
          <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="Vision Forge Studio, home">
            <Logo priority className="h-9 w-9" sizes="36px" />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Vision Forge</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={active === item.id}
                aria-current={active === item.id ? "true" : undefined}
                className="py-2 text-[13px] text-ink/75 transition-colors hover:text-ink data-[active=true]:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-7 hidden min-h-9 items-center rounded-full bg-accent px-4 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover lg:inline-flex"
          >
            WhatsApp us
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center text-ink lg:hidden"
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
          className="fixed inset-0 z-[60] flex flex-col bg-page lg:hidden"
        >
          <div className="flex h-[var(--nav-h)] items-center justify-between px-4">
            <Link href="/" onClick={closeMenu} className="flex min-h-11 items-center" aria-label="Vision Forge Studio, home">
              <Logo className="h-9 w-9" sizes="36px" />
            </Link>
            <button
              type="button"
              data-close-menu
              className="flex h-11 w-11 items-center justify-center text-ink"
              onClick={() => {
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
            >
              <X aria-hidden strokeWidth={1.75} className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-6 pt-4" aria-label="Mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-14 items-center border-b border-hairline text-[28px] font-semibold tracking-[-0.025em] text-ink"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-8">
              <CtaLink href={site.whatsapp.href} external className="w-full">
                Message us on WhatsApp
              </CtaLink>
            </div>
          </nav>

          <div className="grid border-t border-hairline px-6 py-4 text-[15px]">
            <a href={site.phone.href} className="flex min-h-12 items-center justify-between text-ink">
              <span className="text-ink-2">Call</span>
              <span>{site.phone.display}</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
