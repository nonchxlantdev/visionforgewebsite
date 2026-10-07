"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

export type SparkPalette = "hot" | "dust";

export type EmitOptions = {
  x: number;
  y: number;
  count?: number;
  power?: number;
  palette?: SparkPalette;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
  dust: boolean;
};

type SparksApi = { emit: (options: EmitOptions) => void };

const SparksContext = createContext<SparksApi>({ emit: () => {} });

export function useSparks(): SparksApi {
  return useContext(SparksContext);
}

const HOT = ["255 244 214", "242 179 61", "255 140 50", "255 90 31"];

export function SparksProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const frame = useRef(0);
  const running = useRef(false);
  const settings = useRef({ reduce: false, cap: 400, dpr: 1 });
  const loopRef = useRef<(time: number) => void>(() => {});
  const last = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const weak = coarse && (navigator.hardwareConcurrency || 4) <= 4;
    settings.current.reduce = motion.matches;
    settings.current.cap = weak ? 150 : 400;

    const onMotion = () => {
      settings.current.reduce = motion.matches;
    };
    motion.addEventListener("change", onMotion);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.75);
      settings.current.dpr = dpr;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    loopRef.current = (time: number) => {
      const dt = Math.min(48, last.current ? time - last.current : 16);
      last.current = time;
      const { dpr } = settings.current;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = "lighter";

      const list = sparks.current;
      for (let i = list.length - 1; i >= 0; i -= 1) {
        const s = list[i];
        s.life += dt;
        if (s.life >= s.max) {
          list.splice(i, 1);
          continue;
        }
        const k = dt / 16;
        s.vy += (s.dust ? 0.05 : 0.22) * k;
        s.vx *= Math.pow(s.dust ? 0.94 : 0.985, k);
        s.vy *= Math.pow(s.dust ? 0.94 : 0.985, k);
        const px = s.x;
        const py = s.y;
        s.x += s.vx * k;
        s.y += s.vy * k;
        const fade = 1 - s.life / s.max;
        if (s.dust) {
          context.fillStyle = `rgb(140 134 126 / ${fade * 0.5})`;
          context.beginPath();
          context.arc(s.x, s.y, s.size * (1.5 + (1 - fade) * 2), 0, Math.PI * 2);
          context.fill();
        } else {
          context.strokeStyle = `rgb(${HOT[s.hue]} / ${fade})`;
          context.lineWidth = s.size;
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(s.x, s.y);
          context.stroke();
        }
      }
      context.globalCompositeOperation = "source-over";

      if (list.length > 0 && document.visibilityState === "visible") {
        frame.current = requestAnimationFrame(loopRef.current);
      } else {
        running.current = false;
        last.current = 0;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    return () => {
      cancelAnimationFrame(frame.current);
      running.current = false;
      motion.removeEventListener("change", onMotion);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const emit = useCallback((options: EmitOptions) => {
    if (settings.current.reduce) return;
    const { x, y, count = 24, power = 1, palette = "hot" } = options;
    const list = sparks.current;
    const dust = palette === "dust";
    for (let i = 0; i < count && list.length < settings.current.cap; i += 1) {
      const angle = dust ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
      const speed = (dust ? 0.6 + Math.random() * 1.4 : 2.5 + Math.random() * 6.5) * power;
      list.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: dust ? 500 + Math.random() * 400 : 380 + Math.random() * 520,
        size: dust ? 1.5 + Math.random() * 2 : 1 + Math.random() * 1.6,
        hue: Math.floor(Math.random() * HOT.length),
        dust,
      });
    }
    if (!running.current) {
      running.current = true;
      frame.current = requestAnimationFrame(loopRef.current);
    }
  }, []);

  const api = useMemo(() => ({ emit }), [emit]);

  return (
    <SparksContext.Provider value={api}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      />
    </SparksContext.Provider>
  );
}
