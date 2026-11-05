import { Check, Clock, FileText, MessageCircle, RefreshCw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { HUB_TOOLS } from "@/lib/hub";
import { flowPairs, processScene, type SceneTile } from "@/lib/process";

/** App colours, matched to the hero's HubPanel. */
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

const MOVE = "transition-[left,top,transform,opacity,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const FADE = "transition-opacity duration-500 motion-reduce:transition-none";

type Size = "panel" | "card";

function Tile({ tile, index, blueprint, size }: { tile: SceneTile; index: number; blueprint: boolean; size: Size }) {
  const small = size === "card";
  return (
    <div
      className={`absolute ${MOVE}`}
      style={{ left: `${tile.x}%`, top: `${tile.y}%`, transform: `translate(-50%, -50%) rotate(${tile.rotate}deg)` }}
    >
      <div
        className={`relative flex items-center gap-1.5 rounded-xl border whitespace-nowrap ${MOVE} ${
          small ? "px-2 py-1 text-[10px]" : "px-3 py-2 text-[12px]"
        } font-semibold ${
          blueprint
            ? "border-dashed border-gold/70 bg-transparent text-gold"
            : tile.flagged
              ? "border-[#f59e0b] bg-paper text-ink shadow-[0_0_0_3px_rgba(245,158,11,0.3)]"
              : "border-white/10 bg-paper text-ink shadow-[0_12px_28px_-18px_rgba(0,0,0,0.8)]"
        }`}
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${FADE} ${blueprint ? "opacity-0" : "opacity-100"}`} style={{ background: DOT[tile.id] ?? "#7fb0ff" }} />
        {tile.label}
        {tile.flagged ? (
          <span className={`flex items-center justify-center rounded-full bg-[#f59e0b] text-ink ${small ? "h-4 w-4" : "h-5 w-5"}`}>
            <Clock className={small ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={2.5} />
          </span>
        ) : null}
        <span
          className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-success text-paper ring-2 ring-ink ${FADE} ${
            small ? "h-4 w-4" : "h-5 w-5"
          } ${tile.checked ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: tile.checked ? `${index * 60}ms` : "0ms" }}
        >
          <Check className={small ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

/**
 * One frame of the "How we work" picture: the business's tools at a given step.
 * Decorative; the steps list beside it carries the meaning.
 */
export function ProcessScene({ step, size = "panel", className = "" }: { step: number; size?: Size; className?: string }) {
  const small = size === "card";
  const shape = small ? "narrow" : "wide";
  const scene = processScene(step, HUB_TOOLS, shape);
  const iconClass = small ? "h-5 w-5" : "h-7 w-7";

  return (
    <div aria-hidden className={`relative overflow-hidden rounded-[28px] bg-ink ${small ? "h-[300px]" : "aspect-[4/3]"} ${className}`}>
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,99,243,0.3),transparent_65%)] ${FADE} ${
          scene.hub === "solid" ? "opacity-100" : "opacity-30"
        }`}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g className={`${FADE} ${scene.lines === "flow" ? "opacity-100" : "opacity-0"}`}>
          {flowPairs(shape).map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={scene.tiles[a].x}
              y1={scene.tiles[a].y}
              x2={scene.tiles[b].x}
              y2={scene.tiles[b].y}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g className={`${FADE} ${scene.lines === "connected" ? "opacity-100" : "opacity-0"}`}>
          {scene.tiles.map((t) => (
            <line key={t.id} x1={t.x} y1={t.y} x2={50} y2={50} stroke="#7fb0ff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>

      {/* Hub */}
      <div
        className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[26px] border ${MOVE} ${
          small ? "h-20 w-20" : "h-[26%] w-auto aspect-square min-h-24"
        } ${
          scene.hub === "solid"
            ? "border-white/10 bg-[#0f1830] opacity-100 shadow-[0_0_0_8px_rgba(13,99,243,0.12),0_24px_50px_-20px_rgba(0,0,0,0.8)]"
            : scene.hub === "outline"
              ? "border-dashed border-gold/70 bg-transparent opacity-100"
              : "border-transparent opacity-0"
        }`}
      >
        <Logo decorative sizes="96px" className={`h-[62%] w-auto ${FADE} ${scene.hub === "solid" ? "opacity-100" : "opacity-0"}`} />
        <span
          className={`absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-semibold text-ink ${FADE} ${
            scene.live ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>

      {/* Step icons */}
      <MessageCircle className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold ${iconClass} ${FADE} ${scene.icon === "chat" ? "opacity-100" : "opacity-0"}`} strokeWidth={1.75} />
      <FileText className={`absolute ${small ? "top-[74%]" : "top-[80%]"} left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold ${iconClass} ${FADE} ${scene.icon === "plan" ? "opacity-100" : "opacity-0"}`} strokeWidth={1.75} />
      <RefreshCw className={`absolute ${small ? "top-[24%]" : "top-[18%]"} left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold ${iconClass} ${FADE} ${scene.icon === "loop" ? "opacity-100" : "opacity-0"}`} strokeWidth={1.75} />

      {/* Improve: a small chart beside Reports */}
      <div className={`absolute ${small ? "top-[86%] left-[52%]" : "top-[83%] left-[64%]"} flex -translate-x-1/2 -translate-y-1/2 items-end gap-1 ${FADE} ${scene.chart ? "opacity-100" : "opacity-0"}`}>
        {[35, 55, 70, 100].map((h, i) => (
          <span
            key={h}
            className={`w-2 origin-bottom rounded-sm ${i === 3 ? "bg-gold" : "bg-[#7fb0ff]/70"} transition-transform duration-500 motion-reduce:transition-none`}
            style={{ height: small ? `${h * 0.22}px` : `${h * 0.34}px`, transform: `scaleY(${scene.chart ? 1 : 0})`, transitionDelay: scene.chart ? `${i * 80}ms` : "0ms" }}
          />
        ))}
      </div>

      {scene.tiles.map((tile, i) => (
        <Tile key={tile.id} tile={tile} index={i} blueprint={scene.blueprint} size={size} />
      ))}

    </div>
  );
}
