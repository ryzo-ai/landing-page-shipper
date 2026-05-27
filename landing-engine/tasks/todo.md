# Task Log

## Active: Landing Page Template (14 sections)

Reference: https://www.c17.ai/
Route: `/app/[slug]/page.tsx` driven by `/content/[slug].json`

---

### Phase 1 — Foundation
- [ ] `/types/content.ts` — full TypeScript schema for all 14 sections
- [ ] `/theme.config.ts` — design tokens (colors, typography, spacing, shape, shadows, light + dark)
- [ ] `/lib/theme.ts` — `buildCSSVars()` utility: tokens → CSS custom property string
- [ ] `/content/example.json` — fully populated placeholder content

### Phase 2 — CSS + Layout Infrastructure
- [ ] Modify `/app/globals.css` — add `@layer base { body { font-family: var(--font-body); } }`
- [ ] Modify `/app/layout.tsx` — inject theme `<style>` in `<head>`, add `data-theme` to `<html>`

### Phase 3 — Shared UI Primitives
- [ ] `/components/ui/SectionWrapper.tsx` — Framer Motion `whileInView` fade-up wrapper
- [ ] `/components/ui/Icon.tsx` — SVG renderer accepting path `d` string
- [ ] `/components/ui/Button.tsx` — CTA button with `primary | secondary | ghost` variants

### Phase 4 — Layout Components
- [ ] `/components/layout/Navbar.tsx` — sticky, frosted glass on scroll, mobile hamburger
- [ ] `/components/layout/Footer.tsx` — logo, links, social icons, copyright

### Phase 5 — Section Components
- [ ] `/components/sections/Hero.tsx`
- [ ] `/components/sections/MediaBlock.tsx`
- [ ] `/components/sections/ProblemSection.tsx`
- [ ] `/components/sections/ValueProposition.tsx`
- [ ] `/components/sections/PartnerLogos.tsx`
- [ ] `/components/sections/Services.tsx`
- [ ] `/components/sections/Process.tsx`
- [ ] `/components/sections/Testimonials.tsx`
- [ ] `/components/sections/CaseStudies.tsx`
- [ ] `/components/sections/NextSteps.tsx`
- [ ] `/components/sections/CTASection.tsx`
- [ ] `/components/sections/FAQ.tsx`

### Phase 6 — Page Assembly
- [ ] `/components/LandingPage.tsx` — assembles all sections in order
- [ ] `/app/[slug]/page.tsx` — server component: `generateStaticParams`, `generateMetadata`, JSON read

---

### Verification Checklist
- [ ] `npm run dev` → existing `/` page unaffected
- [ ] DevTools `:root` shows all `--color-*` CSS vars
- [ ] `/example` route renders all 14 sections
- [ ] Scroll animations fire once per section
- [ ] Mobile 375px — no overflow, fully responsive
- [ ] `npm run build` — zero TypeScript or build errors
- [ ] Toggle `defaultMode: 'dark'` → dark palette applies

---

## 2026-04-16 — Carbon Equity webinar page

Sales prospect Carbon Equity (climate-tech investment platform). Second exploratory session today. Ship a webinar landing page for their real April 22 event "The Brains Behind the Grid" as a tangible demo.

- [x] `theme.config.ts` — light palette retuned to CE navy (`#0F1F3D` primary, `#F9F9F9` surface)
- [x] `content/carbon-equity.json` — 13-section webinar page, voice-matched to CE register
- [ ] `npm run dev` → `/carbon-equity` route renders all sections without console errors
- [ ] Screenshot for the meeting brief
- [ ] (post-meeting) decide whether to push to Vercel preview or keep on localhost

**Notes**
- Theme change is global — `content/example.json` will also render in navy. Acceptable until a real second tenant lands; then implement per-page theme overrides.
- `caseStudies` items intentionally use illustrative descriptors ("Portfolio Co. #1") rather than fabricated company names. Gijs swaps in real ones if he wants to share publicly.
- Form submit is a stub (`#cta` anchor). State this on the call.
