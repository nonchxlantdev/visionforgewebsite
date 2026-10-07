"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilities } from "@/lib/site";
import { useReducedMotionPref } from "@/components/forge/useHeat";

type Capability = (typeof capabilities)[number];

function Ingot({ item, hot }: { item: Capability; hot: boolean }) {
  return (
    <article
      data-hot={hot}
      className="group relative flex h-full w-[min(82vw,22rem)] shrink-0 snap-center flex-col border border-line bg-soot/60 p-5 transition-[border-color,box-shadow] duration-500 data-[hot=true]:border-molten/70 data-[hot=true]:shadow-[0_0_60px_rgba(255,90,31,0.18)] lg:w-[24rem] lg:p-7"
    >
      <div className="relative h-36 lg:h-44">
        <div
          className={`ingot absolute inset-x-2 bottom-0 h-24 transition-[filter] duration-700 lg:h-28 ${
            hot ? "brightness-110" : ""
          }`}
          aria-hidden
        />
        <div
          aria-hidden
          className="ingot-shape absolute inset-x-2 bottom-0 h-24 bg-[linear-gradient(180deg,#fff4d6_0%,#f2b33d_35%,#ff5a1f_75%,#7a2a0c_100%)] opacity-0 transition-opacity duration-700 data-[hot=true]:opacity-100 lg:h-28"
          data-hot={hot}
          style={{ boxShadow: "0 0 50px rgba(255,90,31,0.6)" }}
        />
        <span
          aria-hidden
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-5xl font-black tracking-[0.04em] transition-colors duration-700 lg:bottom-7 lg:text-6xl ${
            hot ? "text-[#5a1f08]/80" : "text-chrome/25"
          }`}
        >
          {item.metal}
        </span>
        <span className="absolute top-0 left-0 font-mono text-[11px] tracking-[0.18em] text-ash">{item.index}</span>
        <span className="absolute top-0 right-0 font-mono text-[10px] tracking-[0.16em] text-molten uppercase">
          {item.meta}
        </span>
      </div>
      <h3 className="mt-6 font-display text-[2.1rem] leading-[0.95] font-bold tracking-[0.02em] text-chrome uppercase">
        {item.title}
      </h3>
      <p
        className={`mt-3 text-base leading-relaxed transition-colors duration-500 ${hot ? "text-chrome" : "text-ash"}`}
      >
        {item.copy}
      </p>
    </article>
  );
}

function SnapRow() {
  const [active, setActive] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const cards = Array.from(row.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(cards.indexOf(entry.target as HTMLElement));
        });
      },
      { root: row, threshold: 0.6 },
    );
    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:-mx-6 sm:px-6"
      tabIndex={0}
      aria-label="Services, scroll sideways"
    >
      {capabilities.map((item, index) => (
        <Ingot key={item.index} item={item} hot={index === active} />
      ))}
    </div>
  );
}

function PinnedTrack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 80));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(capabilities.length - 1, Math.round(v * (capabilities.length - 1))));
  });

  return (
    <div ref={sectionRef} className="relative h-[300vh]">
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100vh-var(--nav-h))] flex-col overflow-hidden pt-16 pb-8 [justify-content:safe_center]">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          <SectionHeading kicker="Services · raw materials" lines={["Six metals.", "One forge."]} hotLines={[1]}>
            Every business is built from different stock. These are the six materials we work, and we work them
            together.
          </SectionHeading>
        </div>
        <motion.div ref={trackRef} style={{ x }} className="mt-10 flex h-[27rem] gap-6 pl-10 will-change-transform">
          {capabilities.map((item, index) => (
            <Ingot key={item.index} item={item} hot={index === active} />
          ))}
        </motion.div>
        <div className="mx-auto mt-6 flex w-full max-w-[1400px] gap-2 px-10" aria-hidden>
          {capabilities.map((item, index) => (
            <span
              key={item.index}
              className={`h-[3px] flex-1 transition-colors duration-500 ${
                index <= active ? "bg-gradient-to-r from-ember to-molten" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RawMaterials() {
  const reduce = useReducedMotionPref();
  return (
    <section id="services" className="relative scroll-mt-20 border-t border-line">
      <div className={reduce ? "hidden" : "hidden lg:block"}>
        <PinnedTrack />
      </div>
      <div className={`px-4 pt-28 pb-24 sm:px-6 ${reduce ? "lg:px-10" : "lg:hidden"}`}>
        <div className="mx-auto max-w-[1400px]">
          <SectionHeading kicker="Services · raw materials" lines={["Six metals.", "One forge."]} hotLines={[1]}>
            Every business is built from different stock. These are the six materials we work, and we work them
            together.
          </SectionHeading>
          <SnapRow />
        </div>
      </div>
    </section>
  );
}
