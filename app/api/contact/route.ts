import { getCloudflareContext } from "@opennextjs/cloudflare";
import { handleContact } from "@/lib/contact";
import { sendWithResend, verifyTurnstile } from "@/lib/contact-delivery";

type ContactEnv = { RESEND_API_KEY?: string; TURNSTILE_SECRET_KEY?: string };

/** The form sends a few KB at most; anything bigger is not a real enquiry. */
const MAX_BODY_BYTES = 16_000;

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, reason: "failed" }, 415);
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ ok: false, reason: "failed" }, 413);

  let raw: unknown = null;
  try {
    raw = JSON.parse(text);
  } catch {
    raw = null;
  }

  const env = getCloudflareContext().env as unknown as ContactEnv;
  const ip = request.headers.get("cf-connecting-ip") ?? undefined;

  const { status, body } = await handleContact(raw, {
    verifyToken: (token) => verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip),
    send: (email) => sendWithResend(email, env.RESEND_API_KEY),
  });
  return json(body, status);
}
