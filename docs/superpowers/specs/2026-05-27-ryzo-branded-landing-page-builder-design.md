# Design: Ryzo-branded Landing Page Builder

**Date:** 2026-05-27  
**Status:** Approved  
**Scope:** Repurpose existing landing-page-builder to generate Ryzo-branded campaign landing pages with two fixed templates (Sprint, Pitch) and a JSON-driven composable section system.

---

## 1. Problem

The landing-page-builder is a generic SaaS template tool with wrong brand tokens (blue, white, Roboto Slab), all 12 sections hardcoded in fixed order, and no concept of campaign templates. It has never been used for Ryzo campaigns.

---

## 2. Goals

- Pages render in the Ryzo website brand system (cream bg, dark brown, orange accent, Junicode headings, Geist body)
- Two template types — **Sprint** (paid traffic, tight conversion) and **Pitch** (cold outbound, full story)
- Section order is controlled by a `sections` array in each page's JSON config
- Reordering means editing the JSON — no admin UI to build or maintain
- New campaign page = copy template JSON + fill content + deploy

---

## 3. Out of Scope

- Multi-brand / client switching (deferred, structure allows it later)
- Admin drag-and-drop UI (rejected in favour of JSON + Claude)
- Template C "Proof" (warm inbound visits ryzo.nl directly)
- URL parameter override system (`useAdParams`) — not touched
- Airtable integration — not touched

---

## 4. Content Model (`types/content.ts`)

### New fields on `LandingPageContent`

```ts
templateType: 'sprint' | 'pitch'

sections: SectionKey[]
// Ordered list of sections to render.
// Navbar and Footer are always rendered; they are NOT in this array.
// ctaSection should always be last before Footer.
```

### `SectionKey` union type

```ts
type SectionKey =
  | 'hero'
  | 'mediaBlock'
  | 'problemSection'
  | 'valueProposition'
  | 'partnerLogos'
  | 'services'
  | 'process'
  | 'testimonials'
  | 'caseStudies'
  | 'nextSteps'
  | 'ctaSection'
  | 'faq'
```

### All section content fields become optional

Every section field on `LandingPageContent` (`hero?`, `problemSection?`, etc.) becomes optional. If a key is in `sections` but its content is absent, the component returns `null` — no crash, no error.

---

## 5. Template Defaults

### `_template-sprint.json`

```json
{
  "templateType": "sprint",
  "sections": ["hero", "partnerLogos", "testimonials", "ctaSection"]
}
```

Use for: high-intent paid traffic (Google Ads, LinkedIn Ads). Minimum friction. ~30s read.

### `_template-pitch.json`

```json
{
  "templateType": "pitch",
  "sections": [
    "hero",
    "problemSection",
    "valueProposition",
    "services",
    "process",
    "testimonials",
    "ctaSection",
    "faq"
  ]
}
```

Use for: cold outbound email clicks. Full conviction-building story. ~3 min read.

Both templates ship with Ryzo-specific placeholder content (not AcmeCorp).

---

## 6. Composable `LandingPage.tsx`

Replace the hardcoded section list with a `SECTION_MAP` lookup + render loop:

```tsx
const SECTION_MAP: Record<SectionKey, (c: LandingPageContent) => ReactNode> = {
  hero:             (c) => c.hero             ? <Hero content={c.hero} />                         : null,
  mediaBlock:       (c) => c.mediaBlock       ? <MediaBlock content={c.mediaBlock} />             : null,
  problemSection:   (c) => c.problemSection   ? <ProblemSection content={c.problemSection} />     : null,
  valueProposition: (c) => c.valueProposition ? <ValueProposition content={c.valueProposition} /> : null,
  partnerLogos:     (c) => c.partnerLogos     ? <PartnerLogos content={c.partnerLogos} />         : null,
  services:         (c) => c.services         ? <Services content={c.services} />                 : null,
  process:          (c) => c.process          ? <Process content={c.process} />                   : null,
  testimonials:     (c) => c.testimonials     ? <Testimonials content={c.testimonials} />         : null,
  caseStudies:      (c) => c.caseStudies      ? <CaseStudies content={c.caseStudies} />           : null,
  nextSteps:        (c) => c.nextSteps        ? <NextSteps content={c.nextSteps} />               : null,
  ctaSection:       (c) => c.ctaSection       ? <CTASection content={c.ctaSection} />             : null,
  faq:              (c) => c.faq              ? <FAQ content={c.faq} />                           : null,
}

export default function LandingPage({ content }: { content: LandingPageContent }) {
  return (
    <div className="bg-[#F2EDE8] text-[#3B3536]">
      <Navbar content={content.navbar} />
      <main>
        {content.sections.map((key) => (
          <Fragment key={key}>{SECTION_MAP[key]?.(content)}</Fragment>
        ))}
      </main>
      <Footer content={content.footer} />
    </div>
  )
}
```

---

## 7. Brand System

### Font files

Copy from `ryzo-apps/apps/website/app/fonts/` into `app/fonts/`:
- `GeistVF.woff` → body font
- `JunicodeVF-Roman.woff2` → heading font (aliased as "Albra")

Load in `app/layout.tsx` via `next/font/local`:

```ts
const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
})

const junicode = localFont({
  src: './fonts/JunicodeVF-Roman.woff2',
  variable: '--font-albra',
  weight: '300 900',
})
```

Apply both CSS variables on `<body>`: `className={`${geist.variable} ${junicode.variable} antialiased`}`

### `app/globals.css`

Replace current content with the Ryzo brand token layer (modelled on `ryzo-apps/apps/website/app/globals.css`):

```css
@import "tailwindcss";

:root {
  --brand-orange:  #E0621A;
  --bg-primary:    #F2EDE8;
  --bg-dark:       #2D2926;
  --bg-highlight:  #231F1C;
  --text-primary:  #3B3536;
  --text-inverse:  #F2EDE8;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-geist), sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-albra), sans-serif;
  font-weight: 700;
}
```

### Tailwind config

Extend with `font-albra` and `font-geist` utilities (CSS variable pattern matching the website).

### `theme.config.ts`

Replace color tokens with Ryzo values. Keep the `ThemeConfig` structure — it enables multi-brand later. The `buildCSSVars` mechanism in `lib/theme.ts` is unchanged.

Updated light mode tokens:
```ts
primary:      '#E0621A'
background:   '#F2EDE8'
surface:      '#FAF7F4'
textPrimary:  '#3B3536'
textSecondary:'#2D2926'
textMuted:    'rgba(45,41,38,0.55)'
border:       'rgba(45,41,38,0.10)'
```

### Logo

Copy all 4 SVGs from `ryzo-ops/ryzo-brand/SVG/` into `public/brand/`. Inspect to identify light vs dark variants at implementation time. Navbar uses the dark logo (on light bg).

---

## 8. Component Rebrand Rules

Applied to all 12 section components. Rules from `brand.md`:

| Element | Tailwind class |
|---|---|
| Page bg (light section) | `bg-[#F2EDE8]` |
| Card bg | `bg-[#FAF7F4] rounded-xl` |
| Dark section bg | `bg-[#2D2926]` |
| Eyebrow | `font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4` |
| H1 | `font-albra font-bold text-[clamp(42px,7.5vw,92px)] leading-[1.02] tracking-tight text-[#333]` |
| H2 | `font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug` |
| H3 | `font-albra font-bold text-2xl text-[#333] leading-snug` |
| Body | `font-geist text-base text-[#2D2926]/55 leading-relaxed` |
| Primary button | `bg-[#E0621A] text-white font-geist font-medium px-8 py-4 rounded-full outline outline-1 outline-[#d4c8bc] outline-offset-4 hover:brightness-110` |
| Ghost button | `border border-[#2D2926]/20 text-[#2D2926] font-geist font-medium px-8 py-4 rounded-lg hover:border-[#2D2926]/40` |
| Divider | `border-t border-[#2D2926]/10` (light) / `border-[#F2EDE8]/10` (dark) |
| Section padding | `py-24 px-6` |
| Container | `max-w-6xl mx-auto` |

**Dark/light alternation rule:**  
`CTASection` is always dark (`bg-[#2D2926]`). Don't stack two dark sections. Ideal rhythm per `brand.md`: light → dark → light.

**Remove `var(--color-background)` indirection** from existing components — replace with direct Tailwind classes. Keeps components readable without theme lookup.

### Navbar changes

- Replace current multi-link nav with: **Ryzo logo SVG** (dark variant, left) + **single CTA button** (right, orange, `rounded-full`)
- No navigation links — landing pages keep visitors focused on the single conversion action
- Logo links to `https://ryzo.nl` in a new tab
- Navbar content type: logo only + cta. The `links` field on `NavbarContent` becomes optional (`links?`) in the TypeScript type; landing page templates leave it empty and the Navbar component renders no nav links when the array is absent or empty

---

## 9. Section Alternation (reference)

| Section | Background | Notes |
|---|---|---|
| Hero | Light (`#F2EDE8`) | Matches website homepage hero; warm cream with dark heading text |
| MediaBlock | Light | Neutral showcase |
| ProblemSection | Light | 3-card grid |
| ValueProposition | Dark | Contrast break |
| PartnerLogos | Light | Low-key social proof |
| Services | Light | Cards on cream |
| Process | Dark | Numbered steps, dark bg per website pattern |
| Testimonials | Light | Quote grid |
| CaseStudies | Light | Result cards |
| NextSteps | Dark | Pre-CTA warmup |
| CTASection | Dark (always) | Per brand.md rule |
| FAQ | Light | Clean accordion |

---

## 10. File Change Summary

| File | Action |
|---|---|
| `types/content.ts` | Add `templateType`, `SectionKey`, `sections[]`; make section fields optional |
| `components/LandingPage.tsx` | Rewrite with `SECTION_MAP` + render loop |
| `app/layout.tsx` | Swap Roboto Slab for Junicode + Geist via `next/font/local` |
| `app/globals.css` | Replace with Ryzo brand token layer |
| `next.config.ts` | Add Tailwind font extensions (`font-albra`, `font-geist`) if not already wired |
| `theme.config.ts` | Replace color tokens with Ryzo values |
| `lib/theme.ts` | No change |
| `components/layout/Navbar.tsx` | Simplify to logo + CTA only |
| `components/layout/Footer.tsx` | Rebrand to Ryzo tokens |
| `components/sections/*.tsx` (×10) | Rebrand all with Ryzo classes per Section 8 |
| `app/fonts/` | Add `GeistVF.woff` + `JunicodeVF-Roman.woff2` (copied from ryzo-apps) |
| `public/brand/` | Add 4 SVG logo files (copied from ryzo-brand) |
| `content/_template-sprint.json` | New — Sprint starter template with Ryzo placeholder content |
| `content/_template-pitch.json` | New — Pitch starter template with Ryzo placeholder content |
| `content/example.json` | Update — replace AcmeCorp placeholder with Ryzo content |
| `.gitignore` | Add `.superpowers/` |

---

## 11. Workflow After Build

```
1. cp content/_template-sprint.json content/my-campaign.json
2. Fill in content fields in my-campaign.json
3. Adjust sections[] array order if needed (or ask Claude)
4. npm run dev → preview at localhost:3000/my-campaign
5. vercel --prod → live at /<slug>
```

---

## 12. Non-Goals / Deferred

- Stats row section (not currently in component library — add later if needed)
- URL parameter override hook (`useAdParams`) — stays as-is, not wired by default
- Multi-brand theming — `theme.config.ts` structure supports it, not activated
- Image optimisation / og:image generation — out of scope
