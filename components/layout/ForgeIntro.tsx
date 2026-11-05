import type { CSSProperties } from "react";

/** Where the hammer meets the anvil, in SVG units. */
const IMPACT = { x: 140, y: 117 } as const;

type Spark = { dx: number; dy: number; r: number };

/** The drawing is shown small, so sparks travel a little further than their listed offsets. */
const SPREAD = 1.5;

/** Small puffs for the two taps, a full burst for the strike. */
const TAP_SPARKS: readonly Spark[] = [
  { dx: -18, dy: -14, r: -35 },
  { dx: 4, dy: -22, r: -80 },
  { dx: 20, dy: -12, r: -150 },
];

const STRIKE_SPARKS: readonly Spark[] = [
  { dx: -70, dy: -20, r: -15 },
  { dx: -58, dy: -48, r: -40 },
  { dx: -34, dy: -66, r: -65 },
  { dx: -10, dy: -74, r: -82 },
  { dx: 14, dy: -72, r: -100 },
  { dx: 38, dy: -62, r: -120 },
  { dx: 60, dy: -44, r: -145 },
  { dx: 74, dy: -18, r: -165 },
  { dx: -46, dy: -6, r: -5 },
  { dx: 50, dy: -4, r: -175 },
];

function Sparks({ sparks, className }: { sparks: readonly Spark[]; className: string }) {
  return (
    <g className={className}>
      {sparks.map((s, i) => (
        <rect
          key={i}
          className="vf-spark"
          x={IMPACT.x - 8}
          y={IMPACT.y - 2.5}
          width={16}
          height={5}
          rx={2.5}
          fill={i % 3 === 0 ? "#c2410c" : "#f59e0b"}
          style={{ "--dx": `${s.dx * SPREAD}px`, "--dy": `${s.dy * SPREAD}px`, "--r": `${s.r}deg` } as CSSProperties}
        />
      ))}
    </g>
  );
}

/**
 * The intro's forge moment (dark silhouettes, sized smaller than the logo, on the white intro): a hammer taps an anvil twice, then strikes.
 * Pure SVG + CSS (keyframes in globals.css), so it plays before hydration.
 */
export function ForgeIntro() {
  return (
    <svg aria-hidden viewBox="0 0 240 200" className="vf-forge absolute top-1/2 left-1/2 w-28 -translate-x-1/2 -translate-y-1/2 overflow-visible">
      <g className="vf-forge-stage">
        {/* Anvil: horn on the left, flat face, waist and foot */}
        <g className="vf-anvil">
          <path
            d="M30 124 Q50 118 70 118 H192 V134 H172 Q160 142 158 160 H180 V180 H80 V160 H102 Q100 142 90 134 H70 Q50 132 30 124 Z"
            fill="#2a3245"
          />
          <rect x={70} y={118} width={122} height={4} fill="#4b5565" />
        </g>

        {/* Hammer: rotates about the end of its handle */}
        <g className="vf-hammer">
          <rect x={156} y={92} width={66} height={9} rx={4.5} fill="#6b7485" />
          <rect x={124} y={78} width={34} height={38} rx={3} fill="#0a0f1c" />
          <rect x={124} y={110} width={34} height={6} rx={2} fill="#2a3245" />
        </g>

        <Sparks sparks={TAP_SPARKS} className="vf-sparks vf-sparks-tap1" />
        <Sparks sparks={TAP_SPARKS} className="vf-sparks vf-sparks-tap2" />
        <Sparks sparks={STRIKE_SPARKS} className="vf-sparks vf-sparks-strike" />
        <circle className="vf-flash" cx={IMPACT.x} cy={IMPACT.y} r={10} fill="#ffd27a" />
      </g>
    </svg>
  );
}
