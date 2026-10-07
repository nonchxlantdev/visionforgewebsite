# Deployment and security checklist

This application is Next.js 16.3.8 with the App Router. Every page is prerendered static HTML. It is a public marketing site: no accounts, no API routes, no server actions, and no contact form. Contact actions are WhatsApp, `tel:`, and `mailto:` links.

Nothing in this file has been turned on in a Cloudflare or GitHub dashboard. These are manual steps.

## Deployment (decided): Cloudflare Workers via OpenNext

The site deploys to Cloudflare Workers with `@opennextjs/cloudflare` (see `README.md` for the GitHub → Cloudflare steps). This was tested locally in the Workers runtime (`npm run preview`): every route returns 200, unknown routes return 404, and the worker bundle is about 2.6 MiB gzipped, within the free plan's 3 MiB limit.

Constraints that keep this working:

- **Next.js is pinned to exactly 16.3.8.** `@opennextjs/cloudflare` 1.20.9 crashes on Next 16.4.0 (`Unexpected loadManifest(/.next/server/preview-props.json)`). `tests/deploy.test.ts` fails if the pin drifts. Upgrade only after the adapter supports the new version and `npm run preview` serves pages.
- **Cache Components and Partial Prefetching are off.** The Workers runtime can't run Cache Components reliably yet (requests hung in testing). Every page is static, so nothing depends on them.
- **Do not switch to `output: "export"` / static-only Cloudflare Pages.** The security headers in `next.config.ts` are sent by the Next.js server inside the Worker; a static export would drop them.
- **Images** use `lib/image-loader.ts` with pre-sized WebP files in `public/brand/`, so the paid Cloudflare Images binding is not needed.
- Do not commit API tokens, `.dev.vars`, or Wrangler state (all git-ignored). After each deploy, confirm the HTML response still includes the `Content-Security-Policy` header.

The application does not require environment variables today. Do not create a `.env` file unless a later feature needs one. If that happens, commit only `.env.example` with empty placeholders.

## Cloudflare dashboard

Configure these on the zone for `visionforgestudio.app`. They are not applied by this repository.

- **SSL/TLS mode:** Full (strict). Workers serve their own valid certificate. Do not use Flexible.
- **Always Use HTTPS:** On.
- **Automatic HTTPS Rewrites:** On, so leftover `http://` subresources are rewritten.
- **Minimum TLS version:** 1.2.
- **TLS 1.3:** On.
- **HSTS:** The production app sends `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Confirm every hostname under `visionforgestudio.app` serves HTTPS before this is exposed publicly. Do not enable HSTS preload until that is true and you intend to keep HTTPS permanently. Preload is hard to undo.
- **WAF:** Enable the Cloudflare managed ruleset. Add a custom rule only if traffic shows abuse.
- **Bot protection:** Enable Bot Fight Mode or a Super Bot Fight / Bot Management plan if the zone has it. This site has no login or form, so start with the managed bot feature rather than a challenge on every visitor.
- **Rate limiting:** Not required for the current site. There is no form and no API. Add a rate-limit rule if a form or API route is introduced later.
- **DNS:** Proxy the canonical hostname through Cloudflare (orange cloud). Attach the domain to the Worker as a Custom Domain; Cloudflare creates the proxied record.
- **Canonical host:** Pick one host, `https://visionforgestudio.app`, and redirect the other (`www` or the apex) with a single 301. The site metadata, sitemap, and robots file use the apex.
- **Caching:** Cache static assets (`/_next/static/*`, files in `/public`). Do not cache HTML in a way that strips security headers. If you cache HTML, the cached response must still include the headers from `next.config.ts`.
- **Environment variables:** None are required. Do not place Cloudflare API tokens, tunnel credentials, or origin certificates in the Git repository or in `NEXT_PUBLIC_*` variables.
- **CSP verification:** After go-live, open the site and confirm the document response has `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and `Cross-Origin-Opener-Policy`. In the browser console, confirm there are no CSP violations for scripts, styles, fonts, or images. The policy intentionally allows inline scripts and styles; see `SECURITY-AUDIT.md`.

## GitHub

Do this in the GitHub settings for the public repository. It is not configured from this codebase.

- Enable secret scanning.
- Enable push protection if the plan includes it.
- Enable Dependabot security updates.
- Protect `main`: require a pull request before merging, and require review when more than one person can push.
- Require two-factor authentication or a passkey on every GitHub account with access.
- Grant the least repository role that each person needs. Do not store deployment tokens in source files. Prefer GitHub Actions secrets or Cloudflare's own deploy credentials, outside the repository.
