"use client";

import { useRef, type PointerEvent } from "react";
import { HeatText } from "@/components/forge/HeatText";
import { useSparks } from "@/components/forge/SparkField";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { hero, site } from "@/lib/site";

export function Hero() {
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
    emit({ x: event.clientX, y: event.clientY, count: 30, power: 1 });
  };

  return (
    <section
      id="home"
      onPointerMove={onMove}
      onPointerDown={onDown}
      className="relative isolate -mt-[var(--nav-h)] flex min-h-[92svh] flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      <div ref={glowRef} className="furnace-glow absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-6 lg:px-10">
        <div className="order-2 lg:order-1">
          <HeatText
            as="h1"
            lines={["Websites, apps and", "business systems for", "Belizean businesses."]}
            hotLines={[1]}
            restWeight={800}
            radius={220}
            className="font-display text-[clamp(2.3rem,7.2vw,5.6rem)] leading-[0.88] tracking-[0.005em] uppercase"
          />
          <p className="mt-7 max-w-[38rem] text-base leading-relaxed text-chrome/85 sm:text-lg">{hero.lede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={site.whatsapp.href} external>
              {hero.primary}
            </CtaLink>
            <CtaLink href="#what" variant="ghost" icon="down">
              {hero.secondary}
            </CtaLink>
          </div>
          <p className="mt-7 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-ash uppercase">{hero.trust}</p>
        </div>

        <div className="relative order-1 mx-auto lg:order-2">
          <div
            aria-hidden
            className="ember-breathe absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,120,40,0.4),rgba(255,90,31,0.1)_45%,transparent_70%)] blur-2xl"
          />
          <Logo
            priority
            className="h-36 w-36 drop-shadow-[0_10px_40px_rgba(255,90,31,0.35)] sm:h-52 sm:w-52 lg:h-[22rem] lg:w-[22rem]"
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 208px, 144px"
          />
        </div>
      </div>
    </section>
  );
}
