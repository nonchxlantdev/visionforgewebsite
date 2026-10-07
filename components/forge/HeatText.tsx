"use client";

import { useEffect, useRef } from "react";
import { coolDown, heatColor } from "@/lib/heat";
import { getPointer, subscribePointer, useFineMotion } from "./useHeat";

type HeatTextProps = {
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
  /** Lines (by index) that render permanently hot. */
  hotLines?: number[];
  /** Resting font weight; heat swells it toward 900. */
  restWeight?: number;
  radius?: number;
};

export function HeatText({
  lines,
  as = "h2",
  className = "",
  hotLines = [],
  restWeight = 700,
  radius = 200,
}: HeatTextProps) {
  const Tag = as;
  const rootRef = useRef<HTMLElement>(null);
  const live = useFineMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !live) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-l]"));
    const heat = new Float32Array(letters.length);
    let frame = 0;
    let last = 0;
    let running = false;
    let visible = true;

    const step = (time: number) => {
      const dt = last ? Math.min(48, time - last) : 16;
      last = time;
      const p = getPointer();
      let any = false;
      for (let i = 0; i < letters.length; i += 1) {
        const el = letters[i];
        let h = coolDown(heat[i], dt);
        if (p.active) {
          const r = el.getBoundingClientRect();
          const dx = p.x - (r.left + r.width / 2);
          const dy = p.y - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy);
          if (d < radius) h = Math.max(h, 1 - d / radius);
        }
        if (Math.abs(h - heat[i]) > 0.004 || h === 0) {
          heat[i] = h;
          if (h > 0.02) {
            el.style.backgroundImage = "none";
            el.style.color = heatColor(h);
            el.style.fontVariationSettings = `"wght" ${Math.round(restWeight + h * (900 - restWeight))}`;
            el.style.textShadow =
              h > 0.45 ? `0 0 ${Math.round(h * 26)}px rgb(255 120 40 / ${(h * 0.6).toFixed(2)})` : "";
          } else if (el.style.color) {
            el.style.backgroundImage = "";
            el.style.color = "";
            el.style.fontVariationSettings = `"wght" ${restWeight}`;
            el.style.textShadow = "";
          }
        }
        if (heat[i] > 0) any = true;
      }
      if ((any || p.active) && visible) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
        last = 0;
      }
    };

    const kick = () => {
      if (running || !visible) return;
      running = true;
      frame = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(root);
    const off = subscribePointer(kick);

    return () => {
      off();
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [live, radius, restWeight]);

  return (
    <Tag ref={rootRef as never} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, lineIndex) => {
          const hot = hotLines.includes(lineIndex);
          return (
            <span key={lineIndex} className="block whitespace-nowrap">
              {Array.from(line).map((char, i) =>
                char === " " ? (
                  <span key={i}> </span>
                ) : (
                  <span
                    key={i}
                    data-l={hot ? undefined : ""}
                    className={hot ? "hot-text" : "chrome-text"}
                    style={{ fontVariationSettings: `"wght" ${restWeight}` }}
                  >
                    {char}
                  </span>
                ),
              )}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
