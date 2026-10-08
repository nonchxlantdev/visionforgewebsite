"use client";

import { Mail, MessageCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { canSend, emailHref, suggestion, whatsappHref, type StartState } from "@/lib/project-builder";
import { isSafeNavigationHref } from "@/lib/safe-href";
import { formatBZ, priceNote, tiers } from "@/lib/site";

const btn =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-[17px] font-medium transition-colors duration-200";

export function StartCard({ state, onReset }: { state: StartState; onReset(): void }) {
  const s = suggestion(state);
  const ready = canSend(state);
  const wa = whatsappHref(state);
  const mail = emailHref(state);
  const touched = ready || state.budget !== "unsure";

  return (
    <div className="rounded-[28px] bg-panel p-7 text-panel-ink sm:p-9">
      <p className="text-[15px] font-semibold text-link-dark">Your starting point</p>

      <div aria-live="polite" aria-atomic="true">
        <p className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] font-semibold tracking-[-0.025em]">{s.headline}</p>
        {s.tier ? (
          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
            <div>
              <dt className="text-[13px] text-panel-ink-2">From</dt>
              <dd className="mt-1 text-[24px] font-semibold tabular-nums">
                {formatBZ(tiers[s.tier].from)}
                <span aria-hidden className="text-panel-ink-2">
                  *
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-panel-ink-2">Usually</dt>
              <dd className="mt-1 text-[24px] font-semibold">{tiers[s.tier].weeks}</dd>
            </div>
          </dl>
        ) : null}
        {s.budgetLine ? <p className="mt-5 text-[17px] leading-relaxed text-panel-ink-2">{s.budgetLine}</p> : null}
        {s.tier ? (
          <p className="mt-4 text-[12px] leading-relaxed text-panel-ink-2">
            <span aria-hidden>* </span>
            {priceNote.text}{" "}
            <Link href={priceNote.href} className="underline underline-offset-2 hover:text-panel-ink">
              {priceNote.linkLabel}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-7 grid gap-2.5">
        {ready && wa && isSafeNavigationHref(wa) ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn} bg-accent text-white hover:bg-accent-hover`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
            Send this on WhatsApp
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed bg-white/10 text-panel-ink-2`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
            Send this on WhatsApp
          </span>
        )}
        {ready && mail ? (
          <a href={mail} className={`${btn} border border-white/25 text-panel-ink hover:border-white/50`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
            Email it instead
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed border border-white/10 text-panel-ink-2`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
            Email it instead
          </span>
        )}
      </div>

      {touched ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] text-panel-ink-2 hover:text-panel-ink"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Start over
        </button>
      ) : (
        <p className="mt-5 text-[13px] text-panel-ink-2">Your answers stay on this page until you choose to send them.</p>
      )}
    </div>
  );
}
