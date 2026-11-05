import type { OutgoingEmail } from "./contact.ts";

export const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const RESEND_URL = "https://api.resend.com/emails";
export const FROM_ADDRESS = "Vision Forge Studio website <website@visionforgestudio.app>";

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

/** Cloudflare's published Turnstile test secrets start like this (always pass / always fail / token spent). */
export function isTurnstileTestSecret(secret: string): boolean {
  return /^[123]x0{20,}/.test(secret);
}

/**
 * Asks Cloudflare whether the Turnstile token is genuine. Anything other than an explicit success is a fail.
 * With allowedHostnames, the token must also have been solved on one of those hostnames, so a token from
 * another site using the same widget can't be replayed here. Test secrets skip that check (they report a
 * dummy hostname) so local previews still work.
 */
export async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  ip: string | undefined,
  fetchImpl: FetchLike = fetch,
  allowedHostnames?: readonly string[],
): Promise<boolean> {
  if (!secret) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const response = await fetchImpl(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: unknown; hostname?: unknown };
  if (data.success !== true) return false;
  if (allowedHostnames && !isTurnstileTestSecret(secret)) {
    return typeof data.hostname === "string" && allowedHostnames.includes(data.hostname);
  }
  return true;
}

/** Sends the inquiry to the sales inbox through Resend. Returns false instead of throwing on an API error. */
export async function sendWithResend(email: OutgoingEmail, apiKey: string | undefined, fetchImpl: FetchLike = fetch): Promise<boolean> {
  if (!apiKey) return false;
  const response = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [email.to],
      reply_to: email.replyTo,
      subject: email.subject,
      text: email.text,
    }),
  });
  return response.ok;
}
