"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { HeatText } from "@/components/forge/HeatText";
import { useSparks } from "@/components/forge/SparkField";
import { CtaLink } from "@/components/ui/CtaLink";
import { Label } from "@/components/ui/Label";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

export function Furnace() {
  const { emit } = useSparks();
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = (event: PointerEvent<HTMLElement>) => {
    const glow = glowRef.current;
    if (!glow || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    glow.style.setProperty("--gx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    glow.style.setProperty("--gy", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const onDown = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    emit({ x: event.clientX, y: event.clientY, count: 36, power: 1.1 });
  };

  return (
    <section
      id="home"
      onPointerMove={onMove}
      onPointerDown={onDown}
      className="relative isolate -mt-[var(--nav-h)] flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      <div ref={glowRef} className="furnace-glow absolute inset-0 -z-10" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(255,90,31,0.14),transparent_70%)]"
      />

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-4 lg:px-10">
        <div className="order-2 lg:order-1">
          <Label>Vision Forge Studio · Belize</Label>
          <HeatText
            as="h1"
            lines={["We forge", "software", "that works."]}
            hotLines={[1]}
            restWeight={800}
            radius={240}
            className="mt-6 font-display text-[clamp(4.1rem,13.5vw,11.5rem)] leading-[0.8] tracking-[0.005em] uppercase"
          />
          <p className="mt-8 max-w-[34rem] text-base leading-relaxed text-ash sm:text-lg">
            Websites, custom applications, automation, data and cloud systems, hammered into shape around how your
            business actually runs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="#contact">Start a project</CtaLink>
            <CtaLink href="#forge" variant="ghost" icon="down">
              Strike the anvil
            </CtaLink>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="heat-hover inline-flex min-h-11 items-center gap-2 font-mono text-[12px] tracking-[0.12em] text-ash"
            >
              <MessageCircle aria-hidden className="h-4 w-4 text-molten" strokeWidth={1.75} />
              WhatsApp {site.whatsapp.display}
            </a>
            <a
              href={site.phone.href}
              className="heat-hover inline-flex min-h-11 items-center gap-2 font-mono text-[12px] tracking-[0.12em] text-ash"
            >
              <Phone aria-hidden className="h-4 w-4 text-molten" strokeWidth={1.75} />
              Call {site.phone.display}
            </a>
          </div>
        </div>

        <div className="relative order-1 mx-auto lg:order-2">
          <div
            aria-hidden
            className="ember-breathe absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,120,40,0.45),rgba(255,90,31,0.12)_45%,transparent_70%)] blur-2xl"
          />
          <Logo
            priority
            className="h-44 w-44 drop-shadow-[0_10px_40px_rgba(255,90,31,0.35)] sm:h-60 sm:w-60 lg:h-[26rem] lg:w-[26rem]"
            sizes="(min-width: 1024px) 416px, (min-width: 640px) 240px, 176px"
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-t border-line px-4 pt-6 pb-10 font-mono text-[10px] tracking-[0.18em] text-ash uppercase sm:px-6 lg:px-10">
        <span className="flex items-center gap-2">
          <span aria-hidden className="pulse inline-block h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_#ff5a1f]" />
          Forge lit · taking new projects
        </span>
        <span className="hidden sm:inline">Click anywhere to throw sparks</span>
        <span>Scroll ↓</span>
      </div>
    </section>
  );
}
