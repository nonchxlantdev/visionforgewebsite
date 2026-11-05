"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import {
  FLOW_SOURCES,
  FLOW_STORIES,
  FLOW_TARGETS,
  FLOW_TICK_MS,
  flowState,
  targetTick,
  type FlowSourceId,
  type FlowStory,
  type FlowTargetId,
} from "@/lib/hub-flow";

/* ------------------------------------------------------------------ */
/* Small previews of each tool: what the work actually looks like.     */
/* ------------------------------------------------------------------ */

function Window({ app, dot, live, badge, children }: { app: string; dot: string; live: boolean; badge?: string; children: ReactNode }) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl border bg-paper text-left shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] transition-all duration-500 ${
        live ? "border-[#7fb0ff] shadow-[0_0_0_4px_rgba(13,99,243,0.35),0_24px_50px_-20px_rgba(13,99,243,0.55)] lg:-translate-y-0.5" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.02em] text-ink">
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: dot }} />
          {app}
        </span>
        {badge ? (
          <span
            className={`vf-badge rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase ${
              badge === "Updated" ? "bg-[#e4f6ee] text-[#0f7a52]" : "bg-brand-soft text-brand"
            }`}
          >
            {badge === "Updated" ? (
              <>
                <span className="sm:hidden">✓</span>
                <span className="hidden sm:inline">Updated</span>
              </>
            ) : (
              badge
            )}
          </span>
        ) : null}
      </div>
      <div className="px-3 py-2.5 text-[12.5px] leading-snug text-ink sm:text-[13px]">{children}</div>
    </div>
  );
}

function SourcePreview({ id, story }: { id: FlowSourceId; story: FlowStory }) {
  switch (id) {
    case "whatsapp":
      return (
        <div className="space-y-1.5">
          <div className="w-[92%] rounded-xl rounded-tl-sm bg-[#e9f7ef] px-2.5 py-1.5">{story.incoming}</div>
          <div className="text-[10.5px] text-muted">Mr. Ramirez · 8:14 AM</div>
        </div>
      );
    case "website":
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 rounded-md bg-mist px-2 py-1 text-[10px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9ced6]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9ced6]" />
            your-business / checkout
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>{story.incoming}</span>
          </div>
        </div>
      );
    case "forms":
      return (
        <div className="rounded-md bg-[#fbf6e4] px-2.5 py-1.5 [background-image:repeating-linear-gradient(180deg,transparent_0_17px,rgba(176,60,60,0.18)_17px_18px)]">
          <div className="text-[10px] font-bold tracking-[0.08em] text-[#8a3b22] uppercase">Job sheet</div>
          <div className="font-serif text-[14px] italic">{story.incoming.replace("Job sheet: ", "")}</div>
        </div>
      );
    case "bookings":
      return (
        <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-muted">
          {["Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className={`rounded-md py-1 ${d === "Sat" ? "bg-brand text-white" : "bg-mist"}`}>
              <div className="font-semibold">{d}</div>
              <div>{d === "Sat" ? "10:00" : "·"}</div>
            </div>
          ))}
          <div className="col-span-4 mt-0.5 text-left text-[11.5px] font-semibold text-ink">{story.incoming}</div>
        </div>
      );
  }
}

function TargetPreview({ id, story, fresh }: { id: FlowTargetId; story: FlowStory; fresh: boolean }) {
  switch (id) {
    case "sheets":
      return (
        <div className="overflow-hidden rounded-md border border-line text-[11px]">
          {[["Customer", "Item", "Day"], story.row].map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1.2fr_1fr] sm:grid-cols-[1.3fr_1fr_0.6fr] ${i === 0 ? "bg-mist font-semibold text-muted" : fresh ? "bg-[#e4f6ee]" : ""} transition-colors duration-500`}
            >
              {r.map((c, j) => (
                <span key={j} className={`truncate border-r border-line px-1.5 py-1 last:border-r-0 ${j === 2 ? "hidden sm:block" : ""}`}>
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    case "accounting":
      return (
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] text-muted">{story.invoice}</div>
            <div className="text-[15px] font-bold">{story.amount}</div>
          </div>
          <span className="rounded-md bg-mist px-2 py-0.5 text-[10.5px] font-semibold text-body">Invoice sent</span>
        </div>
      );
    case "payments":
      return (
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] text-muted">{story.method}</div>
            <div className="text-[15px] font-bold">{story.amount}</div>
          </div>
          <span className="rounded-md bg-[#e4f6ee] px-2 py-0.5 text-[10.5px] font-semibold text-[#0f7a52]">Received ✓</span>
        </div>
      );
    case "reports":
      return (
        <div className="flex items-end justify-between gap-3">
          <div className="text-[12px] font-semibold leading-tight">{story.report}</div>
          <div aria-hidden className="flex h-9 items-end gap-[3px]">
            {[38, 52, 44, 63, 58, 72].map((h, i) => (
              <span key={i} className="w-[6px] rounded-sm bg-[#c9d6ea]" style={{ height: `${h}%` }} />
            ))}
            <span className={`w-[6px] rounded-sm bg-brand transition-all duration-700 ${fresh ? "h-full" : "h-[60%]"}`} />
          </div>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Connection lines, measured from the real layout.                    */
/* ------------------------------------------------------------------ */

type Line = { id: string; d: string };

function curve(from: DOMRect, to: DOMRect, box: DOMRect, inbound: boolean): string {
  const fc = { x: from.left + from.width / 2 - box.left, y: from.top + from.height / 2 - box.top };
  const tc = { x: to.left + to.width / 2 - box.left, y: to.top + to.height / 2 - box.top };
  const horizontal = Math.abs(fc.x - tc.x) > Math.abs(fc.y - tc.y) * 0.6;
  let a: { x: number; y: number };
  let b: { x: number; y: number };
  if (horizontal) {
    const dir = tc.x > fc.x ? 1 : -1;
    a = { x: fc.x + (dir * from.width) / 2, y: fc.y };
    b = { x: tc.x - (dir * to.width) / 2, y: tc.y + (fc.y - tc.y) * 0.18 };
    const k = Math.abs(b.x - a.x) * 0.55;
    const d = `M${a.x} ${a.y} C${a.x + dir * k} ${a.y} ${b.x - dir * k} ${b.y} ${b.x} ${b.y}`;
    return inbound ? d : reverse(a, b, dir * k, 0);
  }
  const dir = tc.y > fc.y ? 1 : -1;
  a = { x: fc.x, y: fc.y + (dir * from.height) / 2 };
  b = { x: tc.x + (fc.x - tc.x) * 0.18, y: tc.y - (dir * to.height) / 2 };
  const k = Math.abs(b.y - a.y) * 0.55;
  const d = `M${a.x} ${a.y} C${a.x} ${a.y + dir * k} ${b.x} ${b.y - dir * k} ${b.x} ${b.y}`;
  return inbound ? d : reverse(a, b, 0, dir * k);
}

/** The same curve drawn from the hub out to the card, so outbound pulses travel the right way. */
function reverse(a: { x: number; y: number }, b: { x: number; y: number }, kx: number, ky: number): string {
  return `M${b.x} ${b.y} C${b.x - kx} ${b.y - ky} ${a.x + kx} ${a.y + ky} ${a.x} ${a.y}`;
}

/* ------------------------------------------------------------------ */

const DOT: Record<string, string> = {
  whatsapp: "#25b36a",
  website: "#0d63f3",
  forms: "#c2410c",
  bookings: "#7c3aed",
  sheets: "#16a37a",
  accounting: "#0d63f3",
  payments: "#16a37a",
  reports: "#e7b54a",
};

/**
 * The homepage's hub: real examples of a business's tools, all connected through
 * Vision Forge. One job comes in on the left and updates everything on the right.
 * Plays only while on screen; still for reduced motion; pausable.
 */
export function HubPanel() {
  const boxRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);

  // Measure card and hub positions; redraw the lines whenever the layout changes.
  const measure = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect();
    const hub = hubRef.current?.getBoundingClientRect();
    if (!box || !hub) return;
    const next: Line[] = [];
    for (const s of FLOW_SOURCES) {
      const el = cardRefs.current[s.id];
      if (el) next.push({ id: s.id, d: curve(el.getBoundingClientRect(), hub, box, true) });
    }
    for (const t of FLOW_TARGETS) {
      const el = cardRefs.current[t.id];
      if (el) next.push({ id: t.id, d: curve(el.getBoundingClientRect(), hub, box, false) });
    }
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (boxRef.current) io.observe(boxRef.current);
    return () => {
      mq.removeEventListener("change", update);
      io.disconnect();
    };
  }, []);

  const running = visible && !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), FLOW_TICK_MS);
    return () => window.clearInterval(id);
  }, [running]);

  // Reduced motion: one finished example, everything connected.
  const state = reduced ? { ...flowState(0), local: 99, sending: true, hubActive: true, delivered: FLOW_TARGETS.length } : flowState(tick);
  const story = FLOW_STORIES[state.story];
  const previous = FLOW_STORIES[(state.story + FLOW_STORIES.length - 1) % FLOW_STORIES.length];
  const storyFor = (id: FlowSourceId) => FLOW_STORIES.find((s) => s.source === id) ?? story;

  const lineActive = (id: string) => {
    if (reduced) return true;
    if (id === story.source) return state.sending;
    const k = FLOW_TARGETS.findIndex((t) => t.id === id);
    return k >= 0 && state.local >= targetTick(k) - 1 && state.local < targetTick(k) + 2;
  };

  return (
    <figure className="on-dark mx-auto mt-16 max-w-[1180px] md:mt-20">
      <div className="relative overflow-hidden rounded-[32px] bg-ink px-4 pt-7 pb-6 sm:px-8 md:px-10 md:pt-10 md:pb-8">
        {/* Backdrop: faint grid and a glow behind the hub. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,99,243,0.28),transparent_65%)]" />

        <div ref={boxRef} className="relative">
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            {lines.map((l) => (
              <g key={l.id}>
                <path d={l.d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeDasharray="4 6" />
                <path
                  d={l.d}
                  fill="none"
                  stroke="#7fb0ff"
                  strokeWidth={2.5}
                  className={`transition-opacity duration-500 ${lineActive(l.id) ? "opacity-100" : "opacity-0"}`}
                />
                {lineActive(l.id) && !reduced ? (
                  <path
                    key={`${l.id}-${state.story}`}
                    d={l.d}
                    pathLength={100}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={5}
                    strokeLinecap="round"
                    className="vf-pulse"
                    style={{ filter: "drop-shadow(0 0 6px #7fb0ff)" }}
                  />
                ) : null}
              </g>
            ))}
          </svg>

          <div className="relative grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-[minmax(0,1fr)_200px_minmax(0,1fr)] lg:gap-x-20 lg:gap-y-0">
            {/* Left: where work comes in */}
            <div className="col-span-2 lg:col-span-1">
              <p className="mb-3 text-center font-mono text-[11px] tracking-[0.14em] text-on-ink-2 uppercase lg:text-left">Where work comes in</p>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-3.5">
                {FLOW_SOURCES.map((s) => {
                  const live = !reduced && s.id === story.source && state.local < 10;
                  return (
                    <li key={s.id} ref={(el) => { cardRefs.current[s.id] = el; }}>
                      <Window app={s.label} dot={DOT[s.id]} live={live || (reduced && s.id === story.source)} badge={live ? "New" : undefined}>
                        <SourcePreview id={s.id} story={storyFor(s.id)} />
                      </Window>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Centre: Vision Forge */}
            <div className="col-span-2 flex items-center justify-center lg:col-span-1">
              <div ref={hubRef} className="relative flex h-36 w-36 items-center justify-center lg:h-44 lg:w-44">
                <span aria-hidden className={`absolute inset-0 rounded-[36px] border border-[#7fb0ff]/40 transition-transform duration-700 ${state.hubActive ? "scale-125 opacity-0" : "scale-100 opacity-100"}`} />
                <span aria-hidden className={`absolute -inset-3 rounded-[44px] bg-[#0d63f3]/25 blur-xl transition-opacity duration-500 ${state.hubActive ? "opacity-100" : "opacity-40"}`} />
                <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[32px] border border-white/10 bg-[#0f1830] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-20px_rgba(0,0,0,0.7)]">
                  <Logo decorative className="h-16 w-auto lg:h-20" sizes="110px" />
                  <span className="mt-2 font-mono text-[10px] tracking-[0.16em] text-gold uppercase">Vision Forge</span>
                </div>
              </div>
            </div>

            {/* Right: where it ends up */}
            <div className="col-span-2 lg:col-span-1">
              <p className="mb-3 text-center font-mono text-[11px] tracking-[0.14em] text-on-ink-2 uppercase lg:text-right">Where it ends up</p>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-3.5">
                {FLOW_TARGETS.map((t, k) => {
                  const got = state.delivered > k;
                  const fresh = !reduced && got && state.local < targetTick(k) + 4;
                  return (
                    <li key={t.id} ref={(el) => { cardRefs.current[t.id] = el; }}>
                      <Window app={t.label} dot={DOT[t.id]} live={fresh} badge={fresh ? "Updated" : undefined}>
                        <TargetPreview id={t.id} story={got ? story : previous} fresh={fresh} />
                      </Window>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative mt-7 flex flex-col items-center gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
          <p className="min-h-[2.6em] max-w-[60ch] text-center text-[14px] leading-snug text-on-ink-2 sm:text-left">{story.caption}</p>
          {reduced ? null : (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="shrink-0 rounded-full border border-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              {paused ? "Play animation" : "Pause animation"}
            </button>
          )}
        </div>
      </div>
      <figcaption className="sr-only">
        Your tools working together through Vision Forge: WhatsApp, your website, paper forms and bookings feed into one system that updates
        your spreadsheets, accounting, payments and reports automatically.
      </figcaption>
    </figure>
  );
}
