# GloPros demo landing page — homepage match, book-a-demo focus

**Date:** 2026-09-17 · **Repo:** `ryzo-ai/landing-page-shipper` · **Branch:** `client/glopros`
**Status:** approved 2026-09-17 (Pascal: "go, keep the SAP focus"), implemented locally, not committed or deployed

## Goal

Update the existing GloPros demo landing page so it is visually indistinguishable from glopros.ai
(fonts, colours, radii, section treatments, imagery) and borrows the homepage's strongest proof
elements, while every section drives one action: **Book a demo** →
`https://www.glopros.ai/book-a-demo` (with UTMs).

Consent: GloPros management, marketing and sales approved use of their creative, copy and brand
identity for Ryzo-built landing pages (Pascal, 2026-09-17; earlier asset consent from Nick
2026-08-31). Assets are vendored into `public/brand/glopros/`, never hot-linked.

## Current state (verified 2026-09-17)

| Item | State |
|---|---|
| Pages | `/hire-sap-consultants` (EN, the primary demo) and `/sap-detachering` (NL), both on `glopros-demo.vercel.app`, both HTTP 200 |
| Custom domain | `start.glopros.ai` not resolving (DNS record still not added by Nick) |
| Indexing | `noindex` via meta + `X-Robots-Tag` header; stays as-is |
| Last change | `70c9751`, 2026-09-02; branch in sync with origin |
| Theme | Roboto for **both** headings and body; homepage uses **Montserrat** headings. Colours already close; radii, container width, button shape and section backgrounds differ |
| Sections available | hero, mediaBlock, problemSection, valueProposition, partnerLogos, services, process (fixed 4 steps), testimonials, caseStudies, nextSteps, ctaSection, faq. No stats, comparison or hiring-models section |

## Target page: `/hire-sap-consultants`

It is the page the SAP Client Acquisition search campaign's intent maps to, so the SAP message
stays (ad-to-page match). Homepage elements are layered in as proof and structure. `/sap-detachering`
gets the new theme automatically (shared `theme.config.ts`) but no content changes in this round.

## Design tokens — exact values from glopros.ai

Source: `glopros-stage.webflow.shared.40ee8e612.min.css` and the homepage WebFont loader.

| Token | Homepage value | Change |
|---|---|---|
| Heading font | Montserrat 600/700 | **new** (next/font/google) |
| Body font | Roboto 400/500 | keep |
| Text | `#18233a` | keep |
| Secondary text | `#676e81`; large body text `#414a61`, 1.125rem / 1.55 | update |
| Primary button | `#052d69`, hover `#042454`, white text, radius `3.125rem`, padding `1.22rem 3.72rem`, letter-spacing `.078rem`, 1px same-colour border | update (no outline ring) |
| Secondary colour | `#3ba0c1` (step badge active) | add |
| Accent (not used for CTA) | `#ffe27c` / `#fecb4a` | add token only |
| Card radius | small `.75rem`, card `1rem`, feature card `2.125rem`, medium `1.5rem` | update |
| Container | max `86rem`, side padding `2rem` (1rem mobile) | update from 72rem / 1.5rem |
| Section padding | `5.625rem` default, `7.5rem` large, `3.25rem` mobile | update |
| H1 | 3.5rem / 700 / 1.2 (3.25rem tablet) | update from 92px clamp |
| H2 | 3rem / 700 / 1.2 (2.75rem tablet) | update |
| H3 | 2.25rem / 600 / 1.3, letter-spacing .045rem | update |
| H5 / stat label | 1.375rem / 600 | add |
| Stats band | background `#ecf5ff`, number 4.19rem, letter-spacing .084rem | new section |
| Services band | `linear-gradient(167deg, #e3f7fcb3 9%, #ddf5fbb3 65%, #beecf7b3 91%)`; cards `#fdfeffcc`, radius 1rem, shadow `0 21px 42px #c7d9df9c` | update |
| Feature card | `linear-gradient(#f4faff70, #c9e8f070 83%, #92d0e470)`, radius 2.125rem | new treatment |
| Step badge | 1px `#f2f2f2` border, radius .75rem, 1.125rem; active `#3ba0c1` with `#f5f8fa` text | update Process |
| Borders | default `#f2f2f2`, hover `#90a1b9` | update |

## Section order and content

Order follows the paid-traffic demo pattern from the Mobbin research (Deel, Remote, Pin, incident.io,
Front, Railway). Copy marked **(homepage)** is taken verbatim or near-verbatim from glopros.ai or
/book-a-demo; everything else is existing SAP page copy.

| # | Section | Content | Component |
|---|---|---|---|
| 1 | Header | Logo + one "Book a demo" pill. No nav links (paid traffic must not leak) | Navbar (restyle) |
| 2 | Hero | Existing SAP headline; subheadline adds "Faster, more efficient and more affordable than traditional agencies" **(homepage)**; "Book a demo" button; microcopy "20-minute demo · no commitment · you only pay when you hire" (20 min and pay-on-hire both from homepage); illustration in a homepage feature card on the right, stacked on mobile | Hero (split layout + microcopy) |
| 3 | Logo strip | "Trusted by market-leading companies" **(book-a-demo)**, 12 client logos from the homepage | PartnerLogos (restyle, full colour like homepage) |
| 4 | Stats | 24 countries · 400+ professionals placed annually · 250 active placements **(homepage)** | **new** Stats |
| 5 | Agency vs GloPros | Two cards, "Traditional agency" / "GloPros", 5 rows: fee on success only; shortlist in days; active headhunting across 24 countries; recruiter screening plus AI matching; skills-based, anonymised screening. Every GloPros claim is a homepage claim; no competitor named | **new** Comparison (replaces problemSection on this page) |
| 6 | Services | "Our recruitment services: we do the work for you" + 3 cards **(homepage)** + "Book a demo" button | Services (restyle + optional CTA) |
| 7 | SAP module coverage | Existing 3 cards (FI/CO, tech, HR/procurement/SCM) | Services (second instance) |
| 8 | How it works | Existing 4 steps with homepage "Step 01" badges | Process (restyle) |
| 9 | Hiring models | Freelance · Payroll contract · Direct employment, with "What's included" line and homepage images **(homepage)** | **new** HiringModels |
| 10 | FAQ | Existing 5 + "What happens in the demo?" (answer from book-a-demo bullets) | FAQ (restyle) |
| 11 | Final CTA | "Ready for your next hire?" **(homepage)**, 4 demo bullets **(book-a-demo)**, "Book a demo" button, ISO 27001 badge | CTASection (checklist + badge) |
| 12 | Footer | Logo, Book a demo, Privacy policy, Security & compliance; demo disclaimer stays while noindexed | Footer (restyle) |

Demo button appears in 5 places: header, hero, services, (FAQ answer link), final CTA. All link to
`https://www.glopros.ai/book-a-demo?utm_source=ryzo-demo&utm_medium=landing-page&utm_campaign=hire-sap-consultants&utm_content=<position>`.

**Not included, deliberately:** testimonials and case studies (none exist, per Nick's knowledge base;
nothing is fabricated); the 18 % fee (internal pricing, not on the public site); job-seeker content
and "Create account" (wrong audience, second CTA); the 10-step platform tour (too long for a paid page).

## Engineering

- `app/layout.tsx`: add Montserrat via `next/font/google` as `--font-montserrat`; heading token points to it.
- `theme.config.ts`: tokens per the table; add `secondary`, `accent`, `surfaceStats`, `gradientServices`,
  `gradientFeature`, `shadowCard`, radii. `lib/theme.ts` maps new tokens to CSS variables.
- `types/content.ts`: add `stats`, `comparison`, `hiringModels` section keys and content types;
  `hero.microcopy` and `hero.image`; `services.cta`; `ctaSection.checklist` and `ctaSection.badge`;
  allow `services` as a list so the page can render two service blocks (`servicesSecondary`).
- New components: `Stats.tsx`, `Comparison.tsx`, `HiringModels.tsx`. Restyle `Button`, `Hero`,
  `PartnerLogos`, `Services`, `Process`, `CTASection`, `FAQ`, `Navbar`, `Footer` to the tokens. All
  changes additive: existing content JSON without the new fields renders as before.
- Assets: vendor from the Webflow CDN into `public/brand/glopros/img/` — 12 logos, 3 hiring-model
  images, the "Ready for your next hire" card illustration. Check magic bytes after download
  (Webflow serves WebP under `.avif` names) and rename to the true extension.

## Verification

1. `npm run lint` and `npm run build` pass.
2. Local screenshots at 1440 px and 390 px of the new page, side by side with glopros.ai at the same
   widths; check heading font renders as Montserrat (computed style), button shape and colours.
3. Every "Book a demo" link resolves to `/book-a-demo` with the right `utm_content`.
4. `/sap-detachering` still renders with no missing sections.
5. Deploy only after Pascal's go: `vercel deploy --prod` to `glopros-demo`, then `curl` both pages for
   200 and the new H1, per the shipper deploy rule.

## Risks

- Shared theme: `/sap-detachering` changes look too. Same brand, intended, but it is a side effect.
- A Webflow redesign makes vendored assets and tokens stale; re-pull when glopros.ai changes.
- The page stays noindexed on `glopros-demo.vercel.app` until `start.glopros.ai` DNS lands and the
  noindex header is removed; ads cannot point at it before then.

## Implementation notes (2026-09-17)

Deviations from the plan above, each verified against computed styles on www.glopros.ai at 1440 px:

- **Heading weight is 600, not 700**, with letter-spacing (H1 54px/1.44px, H2 36px/0.72px, H3 22px/0.42px).
  H2 renders at 36px on desktop, not the 48px the `.heading-style-h2` class suggests. Stat numbers are
  Roboto 400 at 67px. The type scale lives in `app/globals.css` as `.gp-*` classes.
- **Pre-existing font bug fixed.** `next/font` variables were set on `<body>` while the theme resolves
  `--font-body`/`--font-heading` on `:root`, so every page fell back to the system font (live demo
  included). Font classes now sit on `<html>`. The Dutch page therefore also gains Montserrat headings.
- **Hero is centred, not split.** glopros.ai's hero is centred copy on its blue gradient with 50px rounded
  bottom corners; that was matched instead of the right-hand illustration planned above. The world-map
  illustration moved into the GloPros comparison card.
- **Services band button is yellow** (`#FFE27C`), as on the homepage, not primary blue.
- **Demo CTA placements: 6** (header, hero, comparison, services, final card, footer), each with its own
  `utm_content`. CTAs open in the same tab; `Button` now only opens a new tab with `newTab`.
- **Service icons** are the homepage's inline SVGs, extracted with a regex from raw HTML. An HTML parser
  lowercases SVG attributes (`stdDeviation`, `filterUnits`), which silently hides the whole icon.
- **ISO badge** reuses the existing `img/iso27001.avif` (byte-identical to the fresh download).
- Three client logos (`client-03/09/11.svg`) have no name in the source; alt text is generic.
- Every new section is opt-in via a `variant` in the content JSON; `/sap-detachering` renders unchanged
  apart from the theme tokens and fonts.

Verified: `tsc --noEmit` clean, eslint clean on changed files (only the repo-wide `no-img-element`
warning), `next build` succeeds, both pages 200 locally, all assets served with the right content type,
no horizontal overflow at 390 px, desktop and mobile screenshots reviewed.
