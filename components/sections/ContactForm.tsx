"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import {
  CONTACT_FIELDS,
  FIELD_LIMITS,
  HONEYPOT_FIELD,
  LANE_OPTIONS,
  TURNSTILE_SITE_KEY,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact";
import { replyPromise, site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "failed" | "verification";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    const script = existing ?? Object.assign(document.createElement("script"), { src: TURNSTILE_SRC, async: true });
    script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"))));
    script.addEventListener("error", () => reject(new Error("Turnstile failed to load")));
    if (!existing) document.head.appendChild(script);
  });
}

type TextField = Exclude<ContactField, "lane">;

const fields: { name: TextField; label: string; type?: string; autoComplete?: string; placeholder?: string; multiline?: boolean }[] = [
  { name: "name", label: "Your name", autoComplete: "name" },
  { name: "business", label: "Business name", autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@business.com" },
  { name: "whatTheyDo", label: "What does your business do?", placeholder: "We run a hardware store in Belmopan" },
  {
    name: "slowingDown",
    label: "What's slowing you down?",
    multiline: true,
    placeholder: "We take orders on WhatsApp and copy them into a spreadsheet every night.",
  },
];

const failureText = {
  failed: "Your message didn't send. Try again, or email ",
  verification: "We couldn't confirm the message came from a person. Try again, or email ",
} as const;

const inputClass =
  "mt-2 block w-full rounded-md border border-line bg-paper px-4 text-[17px] text-ink placeholder:text-muted/70 focus-visible:border-ink aria-[invalid=true]:border-danger";

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !widgetRef.current || widgetId.current) return;
        widgetId.current = api.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "light",
          appearance: "interaction-only",
          callback: (value: string) => setToken(value),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      })
      .catch(() => {
        if (!cancelled) setToken("");
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  const resetTurnstile = () => {
    setToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const focusFirstError = (found: ContactErrors) => {
    const first = CONTACT_FIELDS.find((field) => found[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const clearError = (event: FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name as ContactField;
    if (!errors[name]) return;
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    const check = validateContact(values);
    if (!check.ok) {
      setErrors(check.errors);
      focusFirstError(check.errors);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      });
      const body = (await response.json().catch(() => null)) as ContactResponse | null;
      if (body?.ok) {
        setStatus("sent");
        return;
      }
      if (body && !body.ok && body.reason === "invalid") {
        setErrors(body.errors);
        focusFirstError(body.errors);
        setStatus("idle");
        resetTurnstile();
        return;
      }
      setStatus(body && !body.ok && body.reason === "verification" ? "verification" : "failed");
      resetTurnstile();
    } catch {
      setStatus("failed");
      resetTurnstile();
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-4">
        <h3 className="font-display text-[1.5rem] font-bold text-ink">Message sent</h3>
        <p className="mt-3 text-body">{"We'll be in touch within one business day."}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onInput={clearError} className="relative grid gap-6">
      {fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const error = errors[field.name];
        const shared = {
          id: fieldId,
          name: field.name,
          autoComplete: field.autoComplete,
          placeholder: field.placeholder,
          maxLength: FIELD_LIMITS[field.name],
          required: true,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${fieldId}-error` : undefined,
        };
        return (
          <div key={field.name}>
            <label htmlFor={fieldId} className="block text-[16px] font-medium text-ink">
              {field.label}
            </label>
            {field.multiline ? (
              <textarea {...shared} rows={5} className={`${inputClass} min-h-36 py-3`} />
            ) : (
              <input {...shared} type={field.type ?? "text"} className={`${inputClass} min-h-12`} />
            )}
            {error ? (
              <p id={`${fieldId}-error`} className="mt-2 text-[15px] text-danger">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <fieldset aria-describedby={errors.lane ? `${id}-lane-error` : undefined}>
        <legend className="text-[16px] font-medium text-ink">Which fits you best?</legend>
        <div className="mt-3 grid gap-2">
          {LANE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line px-4 text-ink has-[:checked]:border-ink has-[:checked]:bg-mist"
            >
              <input type="radio" name="lane" value={option.id} className="h-4 w-4 accent-[var(--ink)]" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.lane ? (
          <p id={`${id}-lane-error`} className="mt-2 text-[15px] text-danger">
            {errors.lane}
          </p>
        ) : null}
      </fieldset>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-${HONEYPOT_FIELD}`}>Leave this empty</label>
        <input id={`${id}-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div ref={widgetRef} />

      {status === "failed" || status === "verification" ? (
        <p role="alert" className="text-[16px] text-danger">
          {failureText[status]}
          <a href={site.sales.href} className="underline underline-offset-4">
            {site.sales.display}
          </a>
          .
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <button type="submit" disabled={status === "sending"} className={ctaClassName("primary", "w-full sm:w-auto sm:self-start disabled:cursor-wait disabled:opacity-80")}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[15px] text-muted">{replyPromise}</p>
      </div>
    </form>
  );
}
