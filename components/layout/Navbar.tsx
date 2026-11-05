"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { primaryNav } from "@/lib/site";

function Brand() {
  return <span className="hidden font-display text-[16px] font-semibold tracking-[-0.01em] text-ink sm:inline">Vision Forge Studio</span>;
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
    <header ref={headerRef} data-scrolled="false" className="site-header no-print sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="nav-shell mx-auto max-w-[1120px] rounded-full border border-line transition-shadow duration-300">
        <div className="flex h-[var(--nav-h)] items-center gap-6 pr-2 pl-4 sm:pl-5">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="Vision Forge Studio, home">
            <Logo priority decorative className="h-9 w-auto" sizes="44px" />
            <Brand />
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="rounded-full px-4 py-2.5 text-[15px] font-medium text-body transition-colors hover:bg-mist hover:text-ink aria-[current=page]:bg-mist aria-[current=page]:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/get-started" className={ctaClassName("primary", "min-h-11 px-5 text-[15px]")}>
              Get started
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-mist lg:hidden"
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
          className="fixed inset-0 z-[60] flex flex-col bg-paper lg:hidden"
        >
          <div className="flex h-[calc(var(--nav-h)+0.75rem)] items-center justify-between border-b border-line px-5">
            <Link href="/" onClick={closeMenu} className="flex min-h-11 items-center gap-3" aria-label="Vision Forge Studio, home">
              <Logo decorative className="h-9 w-auto" sizes="44px" />
              <Brand />
            </Link>
            <button
              type="button"
              data-close-menu
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-mist"
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
            {[{ href: "/", label: "Home" }, ...primaryNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                className="flex min-h-16 items-center border-b border-line py-4 font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-ink aria-[current=page]:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-8">
              <Link href="/get-started" onClick={closeMenu} className={ctaClassName("gold", "w-full")}>
                Get started
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
