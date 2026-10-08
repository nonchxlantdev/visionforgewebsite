"use client";

import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/** Phone-only bottom bar so WhatsApp is always one tap away. Not shown on the contact page itself. */
export function MobileContactBar() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-line bg-bg/92 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a
        href={site.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-gold text-[15px] font-semibold text-on-gold"
      >
        <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
        WhatsApp us
      </a>
      <a
        href={site.phone.href}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] border border-line-2 px-5 text-[15px] font-semibold text-steel-hi"
      >
        <Phone aria-hidden className="h-4 w-4" strokeWidth={2} />
        Call
      </a>
    </div>
  );
}
