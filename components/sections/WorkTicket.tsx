"use client";

import { Mail, MessageCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import {
  BUDGETS,
  BUSINESSES,
  PROBLEMS,
  canSend,
  emailHref,
  suggestion,
  whatsappHref,
  type StartState,
} from "@/lib/project-builder";
import { isSafeNavigationHref } from "@/lib/safe-href";
import { formatBZ, priceNote, tiers } from "@/lib/site";

const btn = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] px-5 text-[15px] font-semibold transition-colors";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="stamp-in flex justify-between gap-4 border-b border-dashed border-[#bfb29a] py-2.5 text-[15px]">
      <span className="text-paper-ink-2">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </li>
  );
}

/** The paper work ticket that fills in as the visitor picks options. */
export function WorkTicket({ state, onReset }: { state: StartState; onReset(): void }) {
  const s = suggestion(state);
  const ready = canSend(state);
  const wa = whatsappHref(state);
  const mail = emailHref(state);
  const business = BUSINESSES.find((b) => b.id === state.business);
  const budget = BUDGETS.find((b) => b.id === state.budget);
  const touched = ready || state.business !== null || state.budget !== "unsure";

  return (
    <div className="rounded-[2px] bg-paper p-7 text-paper-ink shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:p-8">
      <div className="flex items-center justify-between">
        <p className="label text-paper-ink-2">Work ticket · draft</p>
        <p className="font-mono text-[12px] text-paper-ink-2">No. 1043</p>
      </div>

      <div aria-live="polite" aria-atomic="true">
        <p className="font-wide mt-4 text-[clamp(1.4rem,2.4vw,1.75rem)] leading-[1.12] font-extrabold">{s.headline}</p>
        <ul className="mt-5 border-t border-dashed border-[#bfb29a]">
          {business ? <Row key={`b-${business.id}`} label="Business" value={business.label} /> : null}
          {state.problems.map((p) => (
            <Row key={p} label="Slowing you down" value={PROBLEMS.find((x) => x.id === p)!.label} />
          ))}
          {s.tier ? <Row key={`t-${s.tier}`} label="Typical time" value={tiers[s.tier].weeks} /> : null}
          {budget && state.budget !== "unsure" ? <Row key={`g-${budget.id}`} label="Budget" value={budget.label} /> : null}
        </ul>
        {s.tier ? (
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <span className="text-[15px] text-paper-ink-2">Starting from</span>
            <span className="font-wide text-[2.4rem] leading-none font-extrabold tabular-nums">
              {formatBZ(tiers[s.tier].from)}
              <span aria-hidden>*</span>
            </span>
          </div>
        ) : null}
        {s.budgetLine ? <p className="mt-4 text-[15px]">{s.budgetLine}</p> : null}
        {s.tier ? (
          <p className="mt-4 text-[12px] leading-relaxed text-paper-ink-2">
            <span aria-hidden>* </span>
            {priceNote.text}{" "}
            <Link href={priceNote.href} className="underline underline-offset-2">
              {priceNote.linkLabel}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-2.5">
        {ready && wa && isSafeNavigationHref(wa) ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn} bg-paper-ink text-paper hover:bg-black`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
            Send this ticket on WhatsApp
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed bg-[#d9cfbd] text-paper-ink-2`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
            Send this ticket on WhatsApp
          </span>
        )}
        {ready && mail ? (
          <a href={mail} className={`${btn} border border-paper-ink/40 text-paper-ink hover:border-paper-ink`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
            Email it instead
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed border border-[#cdbfa6] text-paper-ink-2`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
            Email it instead
          </span>
        )}
      </div>

      {touched ? (
        <button type="button" onClick={onReset} className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14px] text-paper-ink-2 hover:text-paper-ink">
          <RotateCcw aria-hidden className="h-4 w-4" />
          Start over
        </button>
      ) : (
        <p className="mt-5 text-[13px] text-paper-ink-2">Your answers stay on this page until you choose to send them.</p>
      )}
    </div>
  );
}
