"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/** Phone-only bottom bar so WhatsApp is always one tap away. Hides while the contact section is on screen. */
export function MobileContactBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-black/5 bg-white/85 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href={site.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent text-[16px] font-medium text-white"
      >
        <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
        WhatsApp us
      </a>
      <a
        href={site.phone.href}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-[16px] font-medium text-ink"
      >
        <Phone aria-hidden className="h-4 w-4" strokeWidth={2} />
        Call
      </a>
    </div>
  );
}
