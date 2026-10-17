"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ctaClassName } from "@/components/ui/CtaLink";

/** Phone-only bottom bar so the form is always one tap away. Hidden on the form's own page. */
export function GetStartedBar() {
  const pathname = usePathname();
  if (pathname === "/get-started") return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <Link href="/get-started" className={ctaClassName("primary", "w-full")}>
        Get started
      </Link>
    </div>
  );
}
