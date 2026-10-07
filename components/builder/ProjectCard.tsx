"use client";

import { Mail, MessageCircle, RotateCcw } from "lucide-react";
import {
  cardMessage,
  emailHref,
  isComplete,
  projectTier,
  summarize,
  whatsappHref,
  type BuilderState,
} from "@/lib/project-builder";
import { isSafeNavigationHref } from "@/lib/safe-href";
import Link from "next/link";
import { formatBZ, priceNote, tiers } from "@/lib/site";

const btn =
  "inline-flex min-h-12 w-full items-center justify-center gap-2.5 px-5 font-mono text-[12px] tracking-[0.14em] uppercase transition-[background-color,border-color,color,box-shadow] duration-300";

export function ProjectCard({ state, onReset }: { state: BuilderState; onReset(): void }) {
  const complete = isComplete(state);
  const tier = projectTier(state.needs);
  const summary = summarize(state);
  const wa = whatsappHref(state);
  const mail = emailHref(state);
  const filled = (state.business ? 1 : 0) + (state.needs.length ? 1 : 0) + (state.budget !== "unsure" ? 1 : 0) + (state.timing !== "exploring" ? 1 : 0);
  const heat = filled / 4;

  return (
    <div
      className="brushed border p-6 transition-[border-color,box-shadow] duration-500 sm:p-8"
      style={{
        borderColor: `rgb(242 179 61 / ${0.15 + heat * 0.6})`,
        boxShadow: `0 0 ${Math.round(heat * 60)}px rgb(255 90 31 / ${(heat * 0.3).toFixed(2)})`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] tracking-[0.2em] text-molten uppercase">Your project</p>
        <div className="flex gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-6 ${i < filled ? "bg-gradient-to-r from-ember to-molten" : "bg-line"}`} />
          ))}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        <p className="mt-5 font-display text-[1.9rem] leading-[1.02] font-bold uppercase text-chrome sm:text-[2.2rem]">
          {summary ?? "Pick your business and what you need."}
        </p>

        {tier ? (
          <dl className="mt-6 grid grid-cols-3 border-y border-line py-4 text-[11px]">
            <div>
              <dt className="font-mono tracking-[0.14em] text-ash uppercase">Tier</dt>
              <dd className="mt-1 font-display text-2xl font-bold uppercase text-whitehot">{tiers[tier].label}</dd>
            </div>
            <div>
              <dt className="font-mono tracking-[0.14em] text-ash uppercase">From</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-whitehot">{formatBZ(tiers[tier].from)}</dd>
            </div>
            <div>
              <dt className="font-mono tracking-[0.14em] text-ash uppercase">Time</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-whitehot">{tiers[tier].weeks}</dd>
            </div>
          </dl>
        ) : null}

        <p className="mt-5 text-base leading-relaxed text-chrome/85">
          {complete ? cardMessage(state) : "Your answers stay on this page until you choose to send them."}
        </p>

        {tier ? (
          <p className="mt-3 text-[12px] leading-relaxed text-ash">
            {priceNote.text}{" "}
            <Link href={priceNote.href} className="underline underline-offset-2 hover:text-whitehot">
              {priceNote.linkLabel}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-7 grid gap-2.5">
        {complete && wa && isSafeNavigationHref(wa) ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} bg-molten text-on-molten hover:bg-whitehot hover:shadow-[0_0_34px_rgba(255,90,31,0.55)]`}
          >
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            Send this on WhatsApp
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed bg-molten/25 text-chrome/50`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            Send this on WhatsApp
          </span>
        )}
        {complete && mail ? (
          <a href={mail} className={`${btn} border border-chrome/25 text-chrome hover:border-molten hover:text-whitehot`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            Email it instead
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed border border-line text-chrome/40`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            Email it instead
          </span>
        )}
      </div>

      {filled > 0 ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-ash uppercase hover:text-whitehot"
        >
          <RotateCcw aria-hidden className="h-3.5 w-3.5" />
          Start over
        </button>
      ) : null}
    </div>
  );
}
