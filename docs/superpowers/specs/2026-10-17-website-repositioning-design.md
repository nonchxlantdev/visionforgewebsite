# Vision Forge Studio website: repositioning and redesign

Date: 2026-10-17
Site: visionforgestudio.app (Next.js, deployed GitHub → Cloudflare)
Status: approved 2026-10-17

## Why

The current site presents Vision Forge as a vendor of automations and websites with a self-serve pricing calculator. That doesn't match what is sold. Vision Forge is a Belizean-owned team that partners with businesses big and small: we review how a business runs, find what's slowing it down, improve and automate its processes, and build what it needs. Staff training and ongoing support are available when a client wants them. "We bring business ideas to life."

The visual design (near-black dark theme) is also hard to read and doesn't feel professional enough for a consultancy.

## Goals

1. Visitors understand within five seconds that Vision Forge is a local tech partner, then see concrete problems we solve.
2. Both small businesses and established companies feel the site is for them.
3. One clear action everywhere: tell us about your business (contact form).
4. Readable and professional on phones first.

## Non-goals

- No client work or case studies (still not shown publicly).
- No changes to legal page content (Terms, Privacy, Disclaimer, Cookies) beyond restyling and these factual fixes: support@ becomes sales@; WhatsApp and phone mentions are removed; the Privacy Policy no longer says the site has no contact forms, and names the form's spam check (Cloudflare Turnstile) and email delivery provider.
- No team headcount, names or roles anywhere.

## Positioning and voice

- Lead: partnership ("your local tech partner"), backed by concrete problem-solving.
- Always "our team" / "we". Never mention how many people.
- Belizean-owned stated plainly, once in the hero trust line and again on About.
- Plain language, sentence case, no jargon ("connect your tools", not "integrations" in headlines).

## Contact rules (site-wide)

- Remove every phone number, `tel:` link, WhatsApp link and the WhatsApp/Call mobile bar.
- Remove support@visionforgestudio.app.
- Only public contact: the contact form + sales@visionforgestudio.app.
- Mobile sticky bar becomes a single "Get started" button linking to /get-started.
- Update metadata (title/description/OG) to drop phone/WhatsApp references and reflect the new positioning.

## Pricing

- Remove the pricing page and calculator entirely.
- Replace with two lanes, no feature lists:
  - Small businesses — from BZ$500
  - Growing teams and established companies — let's talk
- "Projects from BZ$500" also appears in the hero trust line.

## Services model

Six offerings grouped into four stages (used on Home and Services):

| Stage | Offerings |
|---|---|
| Understand | Business review and consultation |
| Improve | Process improvement and automation (incl. connecting existing tools) |
| Build | Websites and online stores; custom systems and apps |
| Support (optional) | Staff training; ongoing support — offered depending on the ask, never presented as included by default |

## Information architecture

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Story-led, see below |
| Services | `/services` | Replaces /automation, /websites, /pricing |
| How we work | `/how-we-work` | Rewritten |
| About | `/about` | New |
| Get started | `/get-started` | Lanes + contact form; replaces /contact |
| Legal | `/terms`, `/privacy`, `/disclaimer`, `/cookies` | Content unchanged |

Nav: Services, How we work, About, plus a "Get started" button.

Permanent (301) redirects:
- `/pricing` → `/get-started`
- `/contact` → `/get-started`
- `/automation` → `/services#improve`
- `/websites` → `/services#build`

## Page content

### Home (in order)

1. Hero
   - Headline: "Your local tech partner. We bring business ideas to life."
   - Subline: "A Belizean-owned team that learns how your business really runs, fixes what's slowing it down, and builds the technology to keep it moving."
   - Buttons: "Tell us about your business" (primary → /get-started), "See how we work" (secondary → /how-we-work)
   - Trust line: Belizean-owned · Projects from BZ$500 · Free first conversation
   - Vision Forge logo retained.
2. Sound familiar? Four short customer-voice quotes, including one non-technical (e.g. "Things keep falling through the cracks and I can't see where."), drawn from the existing six.
3. How we work with you: the four stages, one or two lines each, link to /services.
4. Proof: the existing "by hand vs. handled for you" order example, kept and restyled.
5. Who we work with: trimmed industries list (6 featured + short "also" line) and "From the corner shop to the established company."
6. Why work with us: three points — local and Belizean-owned; we learn your business before we suggest anything; training and ongoing support are there if you want them.
7. Two ways to start: the two pricing lanes.
8. Closing: "Tell us what's slowing you down." with the contact form (same component as /get-started) and sales@ shown.

### Services

One section per stage (anchors `#understand`, `#improve`, `#build`, `#support`). Each: short intro, a "You might need this if…" list (2–4 items), what we do. The Support section is framed as an add-on: "Want your team trained or someone on call after launch? We can stay on." No wording implies it's part of every project. Improve includes the pain-point → solution pairs from the current home page. Ends with the closing call to action.

### How we work

Four numbered steps (real sequence), plus an optional follow-on:
1. Free first conversation
2. We learn how your business runs
3. A written plan and fixed quote
4. We build and test it with you, then hand it over

Optional, if you want it: staff training and ongoing support (shown visually separate from the numbered steps, labelled as optional).

Then FAQs: "Do I need to be tech-savvy?", "We're a small business — is this for us?", "Who owns what you build?", "What happens after launch?" (answer: it's yours; training and ongoing support are available if you'd like them), "How long does a project take?" Answers written in plain language; final wording reviewed by Vision Forge before launch.

### About

- Why Vision Forge exists: technology that fits how Belizean businesses actually run.
- What we believe: learn first, explain plainly, build things your team can actually use.
- Belizean-owned; registered in Belize (Vision Forge, Business Names Act, Reg. No. 000058528, trading as Vision Forge Studio). No statute citation beyond what's already in the footer.
- "Our team" only. No headcount, names or roles.

### Get started

1. Two lanes (cards) at the top.
2. Contact form:
   - Name (required)
   - Business name (required)
   - Email (required, validated)
   - What does your business do? (required, short text)
   - What's slowing you down? (required, textarea)
   - Which fits you best? (radio: Small business / Growing team or established company / Not sure yet)
   - Button: "Send message"
3. Below the form: "We'll reply within one business day to set up a free conversation." and "Prefer email? sales@visionforgestudio.app"
4. States:
   - Inline field errors on submit ("Enter your email so we can reply.").
   - Sending state on the button.
   - Success: replace form with "Message sent. We'll be in touch within one business day."
   - Failure: "Your message didn't send. Try again, or email sales@visionforgestudio.app." Form contents are kept.
5. Delivery: submissions POST to `/api/contact`, a Next.js route handler running on the Cloudflare Worker. It verifies a Cloudflare Turnstile token, then emails sales@visionforgestudio.app through the Resend API (from `website@visionforgestudio.app`, reply-to set to the visitor's email). Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) are Worker secrets read via `getCloudflareContext()`. Spam protection: honeypot field plus Turnstile.

## Visual system: "Mahogany"

Light, high-contrast, established-but-warm. Replaces the dark theme entirely (no dark mode for launch).

Color tokens:

| Token | Hex | Use |
|---|---|---|
| `--ink` | #1F3B2D | Headings, primary buttons, footer background |
| `--mahogany` | #8A3B22 | Links, small accents, stage markers (sparingly) |
| `--text` | #46524B | Body text |
| `--slate` | #4A5560 | Secondary text, captions |
| `--mist` | #EEF1EC | Alternate section backgrounds, cards |
| `--paper` | #FFFFFF | Page background |

All text/background pairs must meet WCAG AA (body text ≥ 4.5:1).

Typography:
- Headings: Literata (serif), weights 500–600, via next/font.
- Body and UI: Public Sans, weights 400–500, via next/font.
- Body 17px mobile / 18px desktop, line-height ~1.65, max line length ~68 characters.
- Type scale roughly 1.25 ratio; H1 ~36px mobile / ~52px desktop.
- Sentence case throughout; no all-caps eyebrow labels; no single-word headline accents.

Layout and components:
- Left-aligned content, generous vertical spacing, single-column on mobile.
- Numbered markers only where content is a real sequence (the four stages, How we work steps).
- Cards: subtle border, modest radius; no heavy shadows or gradients.
- One primary button style (ink fill, white text) and one secondary (outline).
- Motion: none beyond hover/focus feedback and form state changes; respect reduced motion.
- Visible keyboard focus on all interactive elements.

## Testing and acceptance

- No phone numbers, `tel:` links, `wa.me` links or support@ remain anywhere in the built output (grep the build).
- All four redirects return 301 to the right destination.
- Contact form: required-field validation, success path delivers an email to sales@, failure path shows the error and keeps input, honeypot/Turnstile blocks bots.
- Lighthouse (mobile) accessibility ≥ 95; colour contrast passes.
- Pages checked at 360px, 768px and 1280px widths.
- Metadata and OG text updated; no references to pricing calculator remain.
