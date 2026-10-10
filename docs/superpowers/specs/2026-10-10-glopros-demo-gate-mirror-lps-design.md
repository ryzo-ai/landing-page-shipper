# GloPros paid-traffic LPs — Webflow mirror + recorded-demo gate

**Date:** 2026-10-10 · **Repo:** `ryzo-ai/landing-page-shipper` · **Branch:** `client/glopros`
**Status:** approved 2026-10-10 (Pascal: "go", defaults: 3 pages, live copy, mirror their consent)

## Goal

Three paid-traffic landing pages that are an exact visual match of the live glopros.ai pages
`/scaleup-hiring`, `/enterprises` and `/sap-hiring`, with distractions removed and one action:
**Watch the recorded demo** → qualification form → demo video (placeholder until recorded).
Every step is tracked through GloPros' own GTM container.

## Approach: mirror, not re-implementation

`scripts/mirror-glopros.mjs` fetches each live page and writes a static fragment to
`content/mirror/<slug>.html`, with assets vendored to `public/mirror/glopros/` (never hot-linked).
The page keeps GloPros' compiled Webflow stylesheet and section markup, so typography, spacing,
gradients and radii match by construction. Re-run the script to resync after GloPros changes a page.

Transformations:

| Area | Change |
|---|---|
| Header | Logo (not linked) + one "Watch the recorded demo" button. Nav menu, dropdowns, login, search jobs removed |
| Hero (demo variant) | Embedded HubSpot booking form replaced by a demo card in the same style, CTA opens the gate |
| Every CTA (`a.button`, "Book a demo", "Schedule your demo") | Relabelled "Watch the recorded demo", `href="#watch-demo"`, `data-gp-cta="<section>"` |
| Inline links to other pages ("Learn more…", "See how our pricing works", "Read our customer stories") | Removed |
| "Curious to learn more?" section | Removed |
| Stats count-up | Rendered at final values (24 countries · 400+ professionals · 250 active placements) |
| Footer | Logo, copyright, Privacy policy, Security & compliance. Columns, newsletter form, social removed |
| Webflow / GSAP / Lenis / Intellimize / Clarity / Finsweet scripts | Not loaded. Reveal animations shown in their end state; enterprise tabs get a 20-line replacement |
| Cookie consent + analytics | GTM-5JXNDXF (loads Cookiebot `93f7c004…` in GTM mode, Consent Mode v2) + HubSpot tracking 48282941 after Cookiebot consent |

## Demo gate

Step 1 — qualification form (modal): first name, last name, work email (free-mail domains
rejected, as on glopros.ai), company, job title, company size, what you're hiring for, hiring
timeline, privacy consent. Hidden: page slug, CTA location, UTMs, gclid, li_fat_id, referrer.

Submission goes to the HubSpot Forms API v3 (`api.hsforms.com/submissions/v3/integration/submit/48282941/<guid>`)
with the `hubspotutk` cookie. **The form GUID is a placeholder** (`NEXT_PUBLIC_HUBSPOT_GATE_FORM_GUID`)
until Nick creates the form in HubSpot; without it the gate still works and still fires events,
`hubspot_status: "not_configured"`.

Step 2 — the recorded demo. Placeholder card until `NEXT_PUBLIC_DEMO_VIDEO_SRC` is set (mp4 or HLS
→ native `<video>` with progress events). Below the video: secondary "Book a live demo" →
`glopros.ai/book-a-demo` with UTMs.

## Event contract (dataLayer)

All events carry `page_slug`, `lp_variant` (`demo-gate-v1`).

| Event | When | Extra parameters |
|---|---|---|
| `lp_view` | page load | — |
| `cta_click` | any Watch-demo CTA | `cta_location`, `cta_text` |
| `demo_gate_open` | modal opens | `cta_location` |
| `form_start` | first field interaction | — |
| `form_error` | validation fails on submit | `error_fields` (comma list) |
| `demo_form_submit` | form valid and submitted (**the conversion**) | `lead_fit`, `company_size`, `hiring_for`, `hiring_timeline`, `hubspot_status` |
| `video_unlocked` | step 2 shown | — |
| `video_play` | first play | `video_title` |
| `video_progress` | 25 / 50 / 75 % | `video_percent` |
| `video_complete` | ended | — |
| `book_demo_click` | secondary link after video | — |
| `demo_gate_close` | modal closed | `gate_step` (`form` / `video`) |

`demo_form_submit` deliberately reuses the name from Nick's 1 Oct brief. It is **not** the Google
Ads primary yet: the account allows one biddable primary (`book_appointment` on `/thank-you`), and
changing that is Pascal's decision.

GTM side: `ops/marketing/tools/tag-manager-scripts/glopros-lp-demo-gate-2026-10-10.py` creates one
custom-event trigger per event and GA4 event tags in a **new, unpublished workspace**. Pascal runs it.

## Hosting

Same Vercel project `glopros-demo`, noindex stays. Target domain `start.glopros.ai` once Nick adds
`A start.glopros.ai 76.76.21.21`. Cookiebot only serves its banner on domains registered to the
GloPros Cookiebot account, so on `*.vercel.app` the banner may not appear; test consent on
`start.glopros.ai`.
