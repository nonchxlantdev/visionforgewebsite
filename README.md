# visionforgestudio.app

The Vision Forge Studio website: Next.js 16 + React 19 + Motion + Tailwind 4, deployed to Cloudflare Workers with OpenNext.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run lint
```

## Preview exactly as Cloudflare will run it

```bash
npm run preview    # builds with OpenNext and serves on http://localhost:8787
```

## Deploy (GitHub → Cloudflare, automatic)

1. Push this repo to GitHub (commit `package-lock.json` too).
2. In the Cloudflare dashboard go to **Workers & Pages → Create → Import a repository**, pick the repo.
3. Build settings:
   - Project / Worker name: `visionforgestudio` (must match `name` in `wrangler.jsonc`)
   - Build command: `npx @opennextjs/cloudflare build`
   - Deploy command: `npx @opennextjs/cloudflare deploy`
   - Root directory: `/`
4. Save and deploy. Every push to `main` now deploys, and other branches get preview URLs.
5. **Custom domain:** in the Worker, open **Settings → Domains & Routes → Add → Custom domain** and enter `visionforgestudio.app` (add `www.visionforgestudio.app` too if you want it).
   If the domain isn't on Cloudflare yet, first add it under **Websites → Add a domain** and switch the nameservers at your registrar to the two Cloudflare gives you. HTTPS is issued automatically (`.app` requires it).

Manual deploy from your machine instead: `npx wrangler login` once, then `npm run deploy`.

## Notes

- **Next.js is pinned to 16.3.8** on purpose: `@opennextjs/cloudflare` 1.20.9 does not yet support 16.4.0 (pages crash with `Unexpected loadManifest(preview-props.json)`). `tests/deploy.test.ts` guards this. Before upgrading, check the adapter's release notes and run `npm run preview`.
- **Cache Components is off.** Every page is static, and the Workers runtime can't run Cache Components reliably yet.
- **Images:** `next/image` uses `lib/image-loader.ts`, which serves pre-sized WebP logos from `public/brand/` (96–819px). No paid Cloudflare Images needed. If you replace the logo, regenerate those files at the same widths.
- Worker bundle is ~2.6 MiB gzipped, under the free plan's 3 MiB limit.
