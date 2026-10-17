/**
 * Static response headers for this marketing site.
 *
 * Nonce-based CSP is not used. Nonces require dynamic rendering, and every page
 * here is prerendered static HTML served from Cloudflare. A per-request nonce
 * would also prevent caching the HTML.
 *
 * Relaxed directives, and why they stay:
 * - script-src 'unsafe-inline': Next.js injects framework bootstrap scripts,
 *   and the root layout and homepage include
 *   JSON-LD. No hash or nonce is attached to those scripts. 'unsafe-eval' is
 *   added only in development, where React uses eval for debugging.
 * - style-src 'unsafe-inline': the Motion library sets style attributes and
 *   injects animation rules. Attribute styles cannot be nonced.
 * - img-src data: blob:: Next.js image placeholders and in-memory graphics.
 *   No remote image hosts are allowed.
 * - https://challenges.cloudflare.com in script-src and frame-src: Cloudflare
 *   Turnstile, the spam check on the contact form, loads its script from there
 *   and runs its check in an iframe from the same origin.
 */

export type SecurityHeader = { key: string; value: string };

const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

export function contentSecurityPolicy(isProduction: boolean): string {
  const scriptSrc = ["'self'", "'unsafe-inline'", TURNSTILE_ORIGIN];
  if (!isProduction) scriptSrc.push("'unsafe-eval'");

  const connectSrc = ["'self'"];
  if (!isProduction) {
    connectSrc.push("ws://localhost:*", "ws://127.0.0.1:*");
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSrc.join(" ")}`,
    "media-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    `frame-src ${TURNSTILE_ORIGIN}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (isProduction) directives.push("upgrade-insecure-requests");

  return directives.join("; ");
}

export function securityHeaders(isProduction: boolean): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(isProduction) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
    {
      key: "Permissions-Policy",
      value: [
        "accelerometer=()",
        "camera=()",
        "display-capture=()",
        "geolocation=()",
        "gyroscope=()",
        "magnetometer=()",
        "microphone=()",
        "payment=()",
        "usb=()",
        "browsing-topics=()",
        "interest-cohort=()",
      ].join(", "),
    },
  ];

  if (isProduction) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
  }

  return headers;
}
