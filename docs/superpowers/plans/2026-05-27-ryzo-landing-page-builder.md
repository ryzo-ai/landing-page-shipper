# Ryzo Landing Page Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the landing-page-builder from a generic SaaS template to a Ryzo-branded campaign page generator with two composable templates (Sprint + Pitch) driven by a `sections[]` array in each page's JSON config.

**Architecture:** The content type gains a `sections: SectionKey[]` array. `LandingPage.tsx` iterates that array through a `SECTION_MAP` record instead of rendering all 12 sections in fixed order. All section components are rebranded to use Ryzo's design system (cream bg, orange accent, Junicode headings, Geist body). Two starter template JSONs (`_template-sprint.json`, `_template-pitch.json`) set the default section stacks.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, `next/font/local` for Junicode + Geist.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `app/fonts/GeistVF.woff` | Create (copy) | Geist body font |
| `app/fonts/JunicodeVF-Roman.woff2` | Create (copy) | Junicode heading font (aliased as Albra) |
| `public/brand/asset-77.svg` | Create (copy) | Ryzo logo — dark variant (white icon on orange sq) |
| `public/brand/asset-78.svg` | Create (copy) | Ryzo logo — light variant (orange icon on cream sq) |
| `app/globals.css` | Modify | Replace with Ryzo brand token layer + font utilities |
| `app/layout.tsx` | Modify | Swap Roboto Slab for Junicode+Geist via `next/font/local` |
| `theme.config.ts` | Modify | Replace generic blue tokens with Ryzo values |
| `components/ui/Button.tsx` | Modify | Rebrand primary/secondary variants to Ryzo styles |
| `types/content.ts` | Modify | Add `SectionKey`, `templateType`, `sections[]`; make sections optional |
| `components/LandingPage.tsx` | Modify | Rewrite with `SECTION_MAP` + render loop |
| `components/layout/Navbar.tsx` | Modify | Ryzo logo + single CTA; remove nav links |
| `components/layout/Footer.tsx` | Modify | Ryzo brand tokens |
| `components/sections/Hero.tsx` | Modify | Ryzo brand tokens + Junicode heading |
| `components/sections/ProblemSection.tsx` | Modify | Ryzo brand tokens |
| `components/sections/ValueProposition.tsx` | Modify | Ryzo brand tokens, dark bg |
| `components/sections/Services.tsx` | Modify | Ryzo brand tokens |
| `components/sections/Process.tsx` | Modify | Ryzo brand tokens, dark bg |
| `components/sections/Testimonials.tsx` | Modify | Ryzo brand tokens |
| `components/sections/PartnerLogos.tsx` | Modify | Ryzo brand tokens |
| `components/sections/CaseStudies.tsx` | Modify | Ryzo brand tokens |
| `components/sections/NextSteps.tsx` | Modify | Ryzo brand tokens |
| `components/sections/MediaBlock.tsx` | Modify | Ryzo brand tokens |
| `components/sections/CTASection.tsx` | Modify | Always dark `#2D2926` bg |
| `components/sections/FAQ.tsx` | Modify | Ryzo brand tokens |
| `content/_template-sprint.json` | Create | Sprint template with Ryzo placeholder content |
| `content/_template-pitch.json` | Create | Pitch template with Ryzo placeholder content |
| `content/example.json` | Modify | Add `sections[]` + `templateType`; keep as a pitch demo |

---

## Task 1: Copy font and logo assets

**Files:**
- Create: `app/fonts/GeistVF.woff`
- Create: `app/fonts/JunicodeVF-Roman.woff2`
- Create: `public/brand/asset-77.svg`
- Create: `public/brand/asset-78.svg`

- [ ] **Step 1: Create directories and copy font files**

```bash
mkdir -p app/fonts public/brand
cp /Users/pascal/claude-code/projects/ryzo-apps/apps/website/app/fonts/GeistVF.woff app/fonts/
cp /Users/pascal/claude-code/projects/ryzo-apps/apps/website/app/fonts/JunicodeVF-Roman.woff2 app/fonts/
```

- [ ] **Step 2: Copy SVG logo files**

```bash
cp "/Users/pascal/claude-code/projects/ryzo-ops/ryzo-brand/SVG/Asset 77.svg" public/brand/asset-77.svg
cp "/Users/pascal/claude-code/projects/ryzo-ops/ryzo-brand/SVG/Asset 78.svg" public/brand/asset-78.svg
```

- [ ] **Step 3: Verify files exist**

```bash
ls -lh app/fonts/ public/brand/
```

Expected output: 4 files listed — `GeistVF.woff`, `JunicodeVF-Roman.woff2`, `asset-77.svg`, `asset-78.svg`.

- [ ] **Step 4: Commit**

```bash
git add app/fonts/ public/brand/
git commit -m "chore: add Ryzo brand fonts and logo SVGs"
```

---

## Task 2: Brand foundation — globals.css and layout.tsx

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace globals.css with Ryzo brand token layer**

Replace the entire contents of `app/globals.css`:

```css
@import "tailwindcss";

/* ── Ryzo brand tokens ─────────────────────────── */
:root {
  --brand-orange:  #E0621A;
  --bg-primary:    #F2EDE8;
  --bg-dark:       #2D2926;
  --bg-highlight:  #231F1C;
  --text-primary:  #3B3536;
  --text-inverse:  #F2EDE8;
}

/* ── Tailwind font utilities (Tailwind v4 @theme inline) ── */
@theme inline {
  --font-albra: var(--font-albra);
  --font-geist: var(--font-geist);
}

/* ── Base element styles ─────────────────────────── */
@layer base {
  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-geist), system-ui, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-albra), Georgia, serif;
    font-weight: 700;
  }

  a, button, [role="button"], summary {
    cursor: pointer;
  }
}
```

- [ ] **Step 2: Replace layout.tsx with Ryzo font loading**

Replace the entire contents of `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
})

const junicode = localFont({
  src: './fonts/JunicodeVF-Roman.woff2',
  variable: '--font-albra',
  weight: '300 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ryzo — Campaign Landing Pages',
  description: 'Ryzo campaign landing pages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${junicode.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify the dev server starts without errors**

```bash
npm run dev
```

Expected: server starts on port 3000, no font-loading errors in terminal. Open `http://localhost:3000` in a browser. Body text should already use a sans font. Stop server after confirming (`Ctrl+C`).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: Ryzo brand foundation — CSS tokens + font loading (Geist + Junicode)"
```

---

## Task 3: Update theme.config.ts and Button.tsx

**Files:**
- Modify: `theme.config.ts`
- Modify: `components/ui/Button.tsx`

The theme system injects CSS variables via `lib/theme.ts → layout.tsx`. Since we now load brand tokens directly in `globals.css`, `theme.config.ts` is used only for structural components that still reference `var(--color-*)` vars. Update the tokens to Ryzo values so those vars resolve correctly.

- [ ] **Step 1: Replace theme.config.ts tokens with Ryzo values**

Replace the entire contents of `theme.config.ts`:

```ts
export type DesignStyle = 'flat' | 'gradient' | 'skeuomorphic'
export type ThemeMode = 'light' | 'dark'

export interface ThemeTokens {
  colors: {
    primary: string
    primaryHover: string
    primaryFg: string
    background: string
    surface: string
    surfaceHover: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    border: string
    borderHover: string
  }
  typography: {
    fontBody: string
    fontHeading: string
  }
  spacing: {
    sectionPaddingY: string
    containerMaxWidth: string
    containerPaddingX: string
  }
  shape: {
    radiusSm: string
    radiusMd: string
    radiusLg: string
    radiusXl: string
    radiusFull: string
  }
  shadows: {
    shadowSm: string
    shadowMd: string
    shadowLg: string
  }
}

export interface ThemeConfig {
  designStyle: DesignStyle
  defaultMode: ThemeMode
  light: ThemeTokens
  dark: ThemeTokens
}

const themeConfig: ThemeConfig = {
  designStyle: 'flat',
  defaultMode: 'light',
  light: {
    colors: {
      primary:      '#E0621A',
      primaryHover: '#c9571a',
      primaryFg:    '#FFFFFF',
      background:   '#F2EDE8',
      surface:      '#FAF7F4',
      surfaceHover: '#F5EEE7',
      textPrimary:  '#2D2926',
      textSecondary:'rgba(45,41,38,0.55)',
      textMuted:    'rgba(45,41,38,0.30)',
      border:       'rgba(45,41,38,0.10)',
      borderHover:  'rgba(45,41,38,0.20)',
    },
    typography: {
      fontBody:    'var(--font-geist), system-ui, sans-serif',
      fontHeading: 'var(--font-albra), Georgia, serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.25rem',
      radiusMd:   '0.5rem',
      radiusLg:   '0.75rem',
      radiusXl:   '1rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.05)',
      shadowMd: '0 4px 6px -1px rgba(0,0,0,0.08)',
      shadowLg: '0 10px 15px -3px rgba(0,0,0,0.08)',
    },
  },
  // Dark mode mirrors light for landing pages (sections handle dark bg themselves)
  dark: {
    colors: {
      primary:      '#E0621A',
      primaryHover: '#c9571a',
      primaryFg:    '#FFFFFF',
      background:   '#2D2926',
      surface:      '#231F1C',
      surfaceHover: '#3a3330',
      textPrimary:  '#F2EDE8',
      textSecondary:'rgba(242,237,232,0.70)',
      textMuted:    'rgba(242,237,232,0.40)',
      border:       'rgba(242,237,232,0.10)',
      borderHover:  'rgba(242,237,232,0.20)',
    },
    typography: {
      fontBody:    'var(--font-geist), system-ui, sans-serif',
      fontHeading: 'var(--font-albra), Georgia, serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.25rem',
      radiusMd:   '0.5rem',
      radiusLg:   '0.75rem',
      radiusXl:   '1rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.3)',
      shadowMd: '0 4px 6px -1px rgba(0,0,0,0.4)',
      shadowLg: '0 10px 15px -3px rgba(0,0,0,0.5)',
    },
  },
}

export default themeConfig
```

- [ ] **Step 2: Rebrand Button.tsx to Ryzo styles**

Replace the entire contents of `components/ui/Button.tsx`:

```tsx
'use client'

import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#E0621A] text-white hover:brightness-110 outline outline-1 outline-[#d4c8bc] outline-offset-4 rounded-full',
  secondary:
    'border border-[#2D2926]/20 text-[#2D2926] hover:border-[#2D2926]/40 rounded-lg',
  ghost:
    'bg-transparent text-[#2D2926] hover:bg-[#2D2926]/05 rounded-lg',
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-8 py-4 font-geist font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0621A] focus-visible:ring-offset-2'

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add theme.config.ts components/ui/Button.tsx
git commit -m "feat: Ryzo color tokens in theme.config + rebrand Button component"
```

---

## Task 4: Update types/content.ts — composable sections model

**Files:**
- Modify: `types/content.ts`

- [ ] **Step 1: Replace types/content.ts with composable model**

Replace the entire file contents:

```ts
export interface NavLink { label: string; href: string }
export interface NavbarContent {
  logo: { text: string; imageSrc?: string; imageAlt?: string }
  links?: NavLink[]
  cta: { label: string; href: string }
}
export interface HeroContent {
  headline: string
  subheadline: string
  cta: { label: string; href: string }
  socialProof?: string
  backgroundImage?: {
    src: string
    alt: string
    overlayOpacity?: number
  }
  backgroundVideo?: {
    src: string
    poster?: string
    overlayOpacity?: number
  }
}
export interface MediaBlockContent {
  type: 'image' | 'video' | 'placeholder'
  src?: string
  alt?: string
  posterSrc?: string
  aspectRatio?: '16/9' | '4/3' | '1/1'
}
export interface ProblemCard { icon: string; title: string; description: string }
export interface ProblemSectionContent {
  eyebrow?: string
  headline: string
  cards: [ProblemCard, ProblemCard, ProblemCard]
}
export interface ValuePropositionContent {
  eyebrow?: string
  headline: string
  body: string
  graphic?: { src: string; alt: string }
}
export interface PartnerLogo { src: string; alt: string; href?: string }
export interface PartnerLogosContent { eyebrow?: string; logos: PartnerLogo[] }
export interface ServiceCard {
  icon: string
  title: string
  description: string
  link?: { label: string; href: string }
}
export interface ServicesContent {
  eyebrow?: string
  headline: string
  cards: [ServiceCard, ServiceCard, ServiceCard]
}
export interface ProcessStep { title: string; description: string }
export interface ProcessContent {
  eyebrow?: string
  headline: string
  steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep]
}
export interface Testimonial {
  quote: string
  name: string
  title: string
  company?: string
  avatarSrc?: string
  avatarAlt?: string
}
export interface TestimonialsContent {
  eyebrow?: string
  headline: string
  items: Testimonial[]
}
export interface CaseStudy {
  imageSrc?: string
  imageAlt?: string
  title: string
  resultStat: string
  description: string
  link?: { label: string; href: string }
}
export interface CaseStudiesContent {
  eyebrow?: string
  headline: string
  items: CaseStudy[]
}
export interface NextStepCard { title: string; description: string }
export interface NextStepsContent {
  eyebrow?: string
  headline: string
  cards: [NextStepCard, NextStepCard, NextStepCard]
}
export interface CTASectionContent {
  headline: string
  subheadline: string
  cta: { label: string; href: string }
}
export interface FAQItem { question: string; answer: string }
export interface FAQContent {
  eyebrow?: string
  headline: string
  items: FAQItem[]
}
export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'youtube' | 'instagram'
  href: string
}
export interface FooterContent {
  logo: { text: string; imageSrc?: string; imageAlt?: string }
  links?: NavLink[]
  socialLinks?: SocialLink[]
  copyright: string
}
export interface PageMeta { title: string; description: string; ogImage?: string }

export type SectionKey =
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

export interface LandingPageContent {
  slug: string
  templateType: 'sprint' | 'pitch'
  /** Ordered list of sections to render. Navbar and Footer are always rendered. */
  sections: SectionKey[]
  meta: PageMeta
  navbar: NavbarContent
  footer: FooterContent
  hero?: HeroContent
  mediaBlock?: MediaBlockContent
  problemSection?: ProblemSectionContent
  valueProposition?: ValuePropositionContent
  partnerLogos?: PartnerLogosContent
  services?: ServicesContent
  process?: ProcessContent
  testimonials?: TestimonialsContent
  caseStudies?: CaseStudiesContent
  nextSteps?: NextStepsContent
  ctaSection?: CTASectionContent
  faq?: FAQContent
}
```

- [ ] **Step 2: Commit**

```bash
git add types/content.ts
git commit -m "feat: composable sections model — SectionKey type + sections[] array + optional section fields"
```

---

## Task 5: Rewrite LandingPage.tsx with SECTION_MAP

**Files:**
- Modify: `components/LandingPage.tsx`

- [ ] **Step 1: Replace LandingPage.tsx**

```tsx
'use client'

import { Fragment, ReactNode } from 'react'
import { LandingPageContent, SectionKey } from '../types/content'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import Hero from './sections/Hero'
import MediaBlock from './sections/MediaBlock'
import ProblemSection from './sections/ProblemSection'
import ValueProposition from './sections/ValueProposition'
import PartnerLogos from './sections/PartnerLogos'
import Services from './sections/Services'
import Process from './sections/Process'
import Testimonials from './sections/Testimonials'
import CaseStudies from './sections/CaseStudies'
import NextSteps from './sections/NextSteps'
import CTASection from './sections/CTASection'
import FAQ from './sections/FAQ'

type SectionRenderer = (c: LandingPageContent) => ReactNode

const SECTION_MAP: Record<SectionKey, SectionRenderer> = {
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

interface LandingPageProps {
  content: LandingPageContent
}

export default function LandingPage({ content }: LandingPageProps) {
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

- [ ] **Step 2: Commit**

```bash
git add components/LandingPage.tsx
git commit -m "feat: composable LandingPage — SECTION_MAP render loop driven by sections[] array"
```

---

## Task 6: Rebrand Navbar

**Files:**
- Modify: `components/layout/Navbar.tsx`

Logo: use `public/brand/asset-77.svg` (white icon on orange square). Links to `https://ryzo.nl` in a new tab. Nav links are hidden — landing pages keep visitors focused on the CTA.

- [ ] **Step 1: Replace Navbar.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { NavbarContent } from '../../types/content'
import Button from '../ui/Button'

interface NavbarProps {
  content: NavbarContent
}

export default function Navbar({ content }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F2EDE8]/80 backdrop-blur-md border-b border-[#2D2926]/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo — links back to ryzo.nl */}
        <a
          href="https://ryzo.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
          aria-label="Ryzo"
        >
          {content.logo.imageSrc ? (
            <img
              src={content.logo.imageSrc}
              alt={content.logo.imageAlt ?? content.logo.text}
              className="h-8 w-auto"
            />
          ) : (
            <img
              src="/brand/asset-77.svg"
              alt="Ryzo"
              className="h-8 w-auto"
            />
          )}
        </a>

        {/* Single CTA — no nav links on landing pages */}
        <Button href={content.cta.href} variant="primary" className="px-6 py-2.5 text-sm">
          {content.cta.label}
        </Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: Navbar — Ryzo logo + single CTA, no nav links"
```

---

## Task 7: Rebrand Footer

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Replace Footer.tsx**

```tsx
'use client'

import { FooterContent } from '../../types/content'

const socialPaths: Record<string, string> = {
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.634L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin:
    'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  github:
    'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  youtube:
    'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  instagram:
    'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.55 3h8.9A4.55 4.55 0 0121 7.55v8.9A4.55 4.55 0 0116.45 21H7.55A4.55 4.55 0 013 16.45V7.55A4.55 4.55 0 017.55 3z',
}

export default function Footer({ content }: { content: FooterContent }) {
  return (
    <footer className="bg-[#FAF7F4] border-t border-[#2D2926]/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <a href="https://ryzo.nl" target="_blank" rel="noopener noreferrer" aria-label="Ryzo">
            {content.logo.imageSrc ? (
              <img src={content.logo.imageSrc} alt={content.logo.imageAlt ?? content.logo.text} className="h-7 w-auto" />
            ) : (
              <img src="/brand/asset-77.svg" alt="Ryzo" className="h-7 w-auto" />
            )}
          </a>

          {/* Optional nav links */}
          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {content.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-geist text-sm text-[#2D2926]/55 hover:text-[#2D2926] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Optional social links */}
          {content.socialLinks && content.socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {content.socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="text-[#2D2926]/40 hover:text-[#2D2926] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={socialPaths[s.platform]} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-[#2D2926]/10">
          <p className="font-geist text-xs text-[#2D2926]/30">{content.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: rebrand Footer to Ryzo tokens"
```

---

## Task 8: Rebrand Hero

**Files:**
- Modify: `components/sections/Hero.tsx`

Hero is light-bg (cream `#F2EDE8`). Heading uses Junicode (`font-albra`) at clamp scale. Subheadline is muted body text. CTA is orange `rounded-full`. Background video/image support is preserved.

- [ ] **Step 1: Replace Hero.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { HeroContent } from '../../types/content'
import Button from '../ui/Button'

export default function Hero({ content }: { content: HeroContent }) {
  const hasMedia = !!(content.backgroundVideo || content.backgroundImage)
  const overlayOpacity =
    content.backgroundVideo?.overlayOpacity ??
    content.backgroundImage?.overlayOpacity ??
    0

  return (
    <section className="relative flex flex-col items-start justify-center min-h-screen text-left px-6 pt-24 pb-16 bg-[#F2EDE8] overflow-hidden">
      {/* Background video */}
      {content.backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={content.backgroundVideo.src}
          poster={content.backgroundVideo.poster}
          autoPlay muted loop playsInline aria-hidden="true"
        />
      )}

      {/* Background image */}
      {!content.backgroundVideo && content.backgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          role="img"
          aria-label={content.backgroundImage.alt}
          style={{
            backgroundImage: `url(${content.backgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Left gradient for readability over bright video */}
      {hasMedia && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'linear-gradient(90deg, rgba(45,41,38,0.55) 0%, rgba(45,41,38,0.2) 50%, transparent 75%)' }}
        />
      )}

      {/* Optional uniform tint */}
      {hasMedia && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: `rgba(45,41,38,${overlayOpacity})` }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl"
      >
        <h1
          className={`font-albra font-bold text-[clamp(42px,7.5vw,92px)] leading-[1.02] tracking-tight mb-6 ${
            hasMedia ? 'text-[#F2EDE8]' : 'text-[#333]'
          }`}
        >
          {content.headline}
        </h1>

        <p
          className={`font-geist text-lg sm:text-xl max-w-lg mb-8 leading-relaxed ${
            hasMedia ? 'text-[#F2EDE8]/80' : 'text-[#2D2926]/55'
          }`}
        >
          {content.subheadline}
        </p>

        <div className="mb-8">
          <Button href={content.cta.href} variant="primary">
            {content.cta.label}
          </Button>
        </div>

        {content.socialProof && (
          <p className={`font-geist text-sm ${hasMedia ? 'text-[#F2EDE8]/55' : 'text-[#2D2926]/30'}`}>
            {content.socialProof}
          </p>
        )}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: rebrand Hero — Junicode heading, Ryzo cream bg, orange CTA"
```

---

## Task 9: Rebrand ProblemSection and ValueProposition

**Files:**
- Modify: `components/sections/ProblemSection.tsx`
- Modify: `components/sections/ValueProposition.tsx`

ProblemSection: light bg (`#F2EDE8`), 3-card grid on cream cards. ValueProposition: dark bg (`#2D2926`) — contrast break between problem and services.

- [ ] **Step 1: Replace ProblemSection.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Icon from '../ui/Icon'
import { ProblemSectionContent } from '../../types/content'

export default function ProblemSection({ content }: { content: ProblemSectionContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-start gap-4 p-8 rounded-xl bg-[#FAF7F4] hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E0621A]/10 flex items-center justify-center text-[#E0621A]">
                <Icon d={card.icon} size={22} />
              </div>
              <h3 className="font-albra font-bold text-2xl text-[#333] leading-snug">{card.title}</h3>
              <p className="font-geist text-base text-[#2D2926]/55 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Replace ValueProposition.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { ValuePropositionContent } from '../../types/content'

export default function ValueProposition({ content }: { content: ValuePropositionContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#2D2926]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          {content.eyebrow && (
            <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4">
              {content.eyebrow}
            </p>
          )}
          <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#F2EDE8] leading-snug mb-8">
            {content.headline}
          </h2>
          <div className="font-geist text-base text-[#F2EDE8]/55 leading-relaxed space-y-4">
            {content.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Graphic / Placeholder */}
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#231F1C] flex items-center justify-center">
          {content.graphic ? (
            <img src={content.graphic.src} alt={content.graphic.alt} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-[#F2EDE8]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span className="font-geist text-sm">Solution graphic</span>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/ProblemSection.tsx components/sections/ValueProposition.tsx
git commit -m "feat: rebrand ProblemSection (light) + ValueProposition (dark) to Ryzo tokens"
```

---

## Task 10: Rebrand Services and Process

**Files:**
- Modify: `components/sections/Services.tsx`
- Modify: `components/sections/Process.tsx`

Services: light bg. Process: dark bg — keeps the light → dark rhythm.

- [ ] **Step 1: Replace Services.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Icon from '../ui/Icon'
import { ServicesContent } from '../../types/content'

export default function Services({ content }: { content: ServicesContent }) {
  return (
    <SectionWrapper id="services" className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-4 p-8 rounded-xl bg-[#FAF7F4] hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E0621A]/10 flex items-center justify-center text-[#E0621A]">
                <Icon d={card.icon} size={22} />
              </div>
              <h3 className="font-albra font-bold text-2xl text-[#333] leading-snug">{card.title}</h3>
              <p className="font-geist text-base text-[#2D2926]/55 leading-relaxed flex-1">{card.description}</p>
              {card.link && (
                <a href={card.link.href} className="inline-flex items-center gap-1 font-geist text-sm font-medium text-[#E0621A] hover:underline mt-auto">
                  {card.link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Replace Process.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { ProcessContent } from '../../types/content'

export default function Process({ content }: { content: ProcessContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#2D2926]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#F2EDE8] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="flex flex-col md:flex-row gap-0">
          {content.steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col md:flex-1 items-start md:items-center">
              {index < content.steps.length - 1 && (
                <>
                  <div className="md:hidden absolute left-5 top-10 w-0.5 h-full bg-[#F2EDE8]/10" aria-hidden="true" />
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-[#F2EDE8]/10" aria-hidden="true" />
                </>
              )}
              <div className="relative flex md:flex-col items-start md:items-center gap-4 pb-10 md:pb-0 md:px-4 w-full">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-[#E0621A] text-white flex items-center justify-center font-albra font-bold text-sm">
                  {index + 1}
                </div>
                <div className="md:text-center">
                  <h3 className="font-albra font-bold text-xl text-[#F2EDE8] mb-1">{step.title}</h3>
                  <p className="font-geist text-sm text-[#F2EDE8]/55 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/Services.tsx components/sections/Process.tsx
git commit -m "feat: rebrand Services (light) + Process (dark) to Ryzo tokens"
```

---

## Task 11: Rebrand Testimonials, PartnerLogos, CaseStudies, NextSteps, MediaBlock

**Files:**
- Modify: `components/sections/Testimonials.tsx`
- Modify: `components/sections/PartnerLogos.tsx`
- Modify: `components/sections/CaseStudies.tsx`
- Modify: `components/sections/NextSteps.tsx`
- Modify: `components/sections/MediaBlock.tsx`

All five are light-bg sections.

- [ ] **Step 1: Replace Testimonials.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { TestimonialsContent } from '../../types/content'

export default function Testimonials({ content }: { content: TestimonialsContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {content.items.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid mb-6 p-6 rounded-xl bg-[#FAF7F4]"
            >
              <blockquote className="font-geist text-base text-[#2D2926]/55 leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                {t.avatarSrc ? (
                  <img src={t.avatarSrc} alt={t.avatarAlt ?? t.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#2D2926] flex items-center justify-center flex-shrink-0">
                    <span className="font-albra font-bold text-white text-sm">{t.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-geist text-sm font-medium text-[#2D2926]">{t.name}</p>
                  <p className="font-geist text-xs text-[#2D2926]/30">
                    {t.title}{t.company ? `, ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Replace PartnerLogos.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { PartnerLogosContent } from '../../types/content'

export default function PartnerLogos({ content }: { content: PartnerLogosContent }) {
  if (content.logos.length === 0) return null

  return (
    <SectionWrapper className="py-12 px-6 bg-[#FAF7F4] border-y border-[#2D2926]/10">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs text-[#2D2926]/30 tracking-[0.18em] uppercase text-center mb-8">
            {content.eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {content.logos.map((logo) => {
            const img = (
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-auto object-contain grayscale opacity-50 hover:opacity-80 hover:grayscale-0 transition-all duration-200"
              />
            )
            return logo.href ? (
              <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer">{img}</a>
            ) : (
              <span key={logo.alt}>{img}</span>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Replace CaseStudies.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { CaseStudiesContent } from '../../types/content'

export default function CaseStudies({ content }: { content: CaseStudiesContent }) {
  return (
    <SectionWrapper id="case-studies" className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {content.items.map((cs) => (
            <div
              key={cs.title}
              className="flex flex-col rounded-xl bg-[#FAF7F4] overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-full aspect-video bg-[#2D2926]/05 flex items-center justify-center">
                {cs.imageSrc ? (
                  <img src={cs.imageSrc} alt={cs.imageAlt ?? cs.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#2D2926]/20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="font-albra font-bold text-2xl text-[#E0621A] mb-2">{cs.resultStat}</p>
                <h3 className="font-albra font-bold text-xl text-[#333] leading-snug mb-3">{cs.title}</h3>
                <p className="font-geist text-sm text-[#2D2926]/55 leading-relaxed flex-1">{cs.description}</p>
                {cs.link && (
                  <a href={cs.link.href} className="inline-flex items-center gap-1 font-geist text-sm font-medium text-[#E0621A] hover:underline mt-4">
                    {cs.link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Replace NextSteps.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { NextStepsContent } from '../../types/content'

export default function NextSteps({ content }: { content: NextStepsContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards.map((card, index) => (
            <div key={card.title} className="flex flex-col gap-4 p-8 rounded-xl bg-[#FAF7F4]">
              <span className="font-albra font-bold text-5xl text-[#E0621A]/20 leading-none select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-albra font-bold text-2xl text-[#333] leading-snug">{card.title}</h3>
              <p className="font-geist text-base text-[#2D2926]/55 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Replace MediaBlock.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { MediaBlockContent } from '../../types/content'

const aspectClasses: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
}

export default function MediaBlock({ content }: { content: MediaBlockContent }) {
  const aspect = aspectClasses[content.aspectRatio ?? '16/9'] ?? 'aspect-video'

  return (
    <SectionWrapper className="px-6 py-8 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto w-full rounded-xl overflow-hidden shadow-lg">
        {content.type === 'image' && content.src && (
          <img src={content.src} alt={content.alt ?? ''} className={`w-full object-cover ${aspect}`} />
        )}
        {content.type === 'video' && content.src && (
          <video src={content.src} poster={content.posterSrc} controls className={`w-full ${aspect}`} />
        )}
        {content.type === 'placeholder' && (
          <div className={`w-full ${aspect} flex items-center justify-center bg-[#FAF7F4]`}>
            <div className="flex flex-col items-center gap-3 text-[#2D2926]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="font-geist text-sm">{content.alt ?? 'Product screenshot'}</span>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/sections/Testimonials.tsx components/sections/PartnerLogos.tsx components/sections/CaseStudies.tsx components/sections/NextSteps.tsx components/sections/MediaBlock.tsx
git commit -m "feat: rebrand Testimonials, PartnerLogos, CaseStudies, NextSteps, MediaBlock to Ryzo tokens"
```

---

## Task 12: Rebrand CTASection and FAQ

**Files:**
- Modify: `components/sections/CTASection.tsx`
- Modify: `components/sections/FAQ.tsx`

CTASection is always dark (`#2D2926`), per brand rules. FAQ is light, clean accordion.

- [ ] **Step 1: Replace CTASection.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Button from '../ui/Button'
import { CTASectionContent } from '../../types/content'

export default function CTASection({ content, id = 'cta' }: { content: CTASectionContent; id?: string }) {
  return (
    <SectionWrapper id={id} className="py-28 px-6 bg-[#2D2926]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#F2EDE8] leading-snug mb-6">
          {content.headline}
        </h2>
        <p className="font-geist text-lg text-[#F2EDE8]/55 max-w-2xl mx-auto mb-10">
          {content.subheadline}
        </p>
        <Button href={content.cta.href} variant="primary">
          {content.cta.label}
        </Button>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Replace FAQ.tsx**

```tsx
'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { FAQContent } from '../../types/content'

export default function FAQ({ content }: { content: FAQContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-3xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16">
          {content.headline}
        </h2>

        <div className="flex flex-col gap-3">
          {content.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-[#2D2926]/10 bg-[#FAF7F4] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-geist font-medium text-[#2D2926] hover:bg-[#F5EEE7] transition-colors select-none">
                <span>{item.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#2D2926]/30 transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-1 font-geist text-base text-[#2D2926]/55 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/CTASection.tsx components/sections/FAQ.tsx
git commit -m "feat: rebrand CTASection (dark bg) + FAQ (light) to Ryzo tokens"
```

---

## Task 13: Create template JSONs and update example.json

**Files:**
- Create: `content/_template-sprint.json`
- Create: `content/_template-pitch.json`
- Modify: `content/example.json`

Sprint = 4 sections: hero, partnerLogos, testimonials, ctaSection  
Pitch = 8 sections: hero, problemSection, valueProposition, services, process, testimonials, ctaSection, faq

- [ ] **Step 1: Create _template-sprint.json**

```json
{
  "slug": "_template-sprint",
  "templateType": "sprint",
  "sections": ["hero", "partnerLogos", "testimonials", "ctaSection"],
  "meta": {
    "title": "Campaign Title — Ryzo",
    "description": "One-sentence campaign description for search and social sharing."
  },
  "navbar": {
    "logo": { "text": "Ryzo" },
    "cta": { "label": "Book a call", "href": "#cta" }
  },
  "hero": {
    "headline": "Stop paying SaaS tax on your growth",
    "subheadline": "Ryzo deploys an agent-led GTM system that replaces your tool stack and generates pipeline in 90 days.",
    "cta": { "label": "Book your pipeline audit", "href": "#cta" },
    "socialProof": "Trusted by B2B scale-ups across Europe"
  },
  "partnerLogos": {
    "eyebrow": "Clients we've deployed for",
    "logos": []
  },
  "testimonials": {
    "eyebrow": "What clients say",
    "headline": "Results, not promises",
    "items": [
      {
        "quote": "Ryzo mapped our GTM gaps in week one and had outbound running by week three. We closed two deals from the first sequence.",
        "name": "Founder",
        "title": "CEO",
        "company": "SaaS scale-up"
      },
      {
        "quote": "We replaced three vendors and a contractor. Ryzo costs less and produces more pipeline.",
        "name": "Founder",
        "title": "CCO",
        "company": "B2B services firm"
      },
      {
        "quote": "The RevOS implementation cleaned up our HubSpot and gave us actual pipeline visibility for the first time.",
        "name": "Founder",
        "title": "VP Revenue",
        "company": "Series A SaaS"
      }
    ]
  },
  "ctaSection": {
    "headline": "Ready to deploy your GTM system?",
    "subheadline": "Book a 30-minute pipeline audit. We'll map your gaps and show you what an agent-led system looks like for your business.",
    "cta": { "label": "Book your pipeline audit", "href": "https://ryzo.nl/contact" }
  },
  "footer": {
    "logo": { "text": "Ryzo" },
    "copyright": "© 2026 Ryzo. All rights reserved."
  }
}
```

- [ ] **Step 2: Create _template-pitch.json**

```json
{
  "slug": "_template-pitch",
  "templateType": "pitch",
  "sections": ["hero", "problemSection", "valueProposition", "services", "process", "testimonials", "ctaSection", "faq"],
  "meta": {
    "title": "Campaign Title — Ryzo",
    "description": "One-sentence campaign description for search and social sharing."
  },
  "navbar": {
    "logo": { "text": "Ryzo" },
    "cta": { "label": "Book a call", "href": "#cta" }
  },
  "hero": {
    "headline": "Stop paying SaaS tax on your growth",
    "subheadline": "Ryzo deploys an agent-led GTM system that replaces your tool stack and generates pipeline in 90 days.",
    "cta": { "label": "Book your pipeline audit", "href": "#cta" },
    "socialProof": "Trusted by B2B scale-ups across Europe"
  },
  "problemSection": {
    "eyebrow": "The problem",
    "headline": "Your GTM stack is expensive and disconnected",
    "cards": [
      {
        "icon": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        "title": "SaaS tax eating your margin",
        "description": "The average B2B scale-up pays €8k–€20k/month for tools that don't talk to each other. You pay for ZoomInfo, Outreach, Clay, and HubSpot — and still don't have a predictable pipeline."
      },
      {
        "icon": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        "title": "Outbound that doesn't scale",
        "description": "Manual sequences burn your domain reputation. Without AI-native personalization and signal-based targeting, your reply rates drop every quarter."
      },
      {
        "icon": "M13 10V3L4 14h7v7l9-11h-7z",
        "title": "CRM that nobody trusts",
        "description": "Dirty data, manual entry, and no lifecycle enforcement mean your pipeline report is a guess. Leadership makes decisions on fiction."
      }
    ]
  },
  "valueProposition": {
    "eyebrow": "The solution",
    "headline": "Map. Deploy. Operate.",
    "body": "Ryzo overlays an agent-led GTM system on your existing team. We map your revenue gaps, deploy the right systems for each layer (outbound, performance, RevOps), and operate them as a managed service.\n\nYou don't hire. You don't buy more tools. You get a complete GTM system that runs, learns, and compounds."
  },
  "services": {
    "eyebrow": "Three capabilities",
    "headline": "Neither alone is enough",
    "cards": [
      {
        "icon": "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
        "title": "OutboundOS",
        "description": "Agent-led outbound with ICP research, signal monitoring, multi-channel sequencing, and inbox management. Runs without an SDR headcount.",
        "link": { "label": "Learn more", "href": "https://ryzo.nl/outbound" }
      },
      {
        "icon": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        "title": "PerformanceOS",
        "description": "Paid acquisition managed end-to-end across Google, LinkedIn, and Meta. Creative strategy, media buying, and conversion tracking — no agency retainer required.",
        "link": { "label": "Learn more", "href": "https://ryzo.nl/performance" }
      },
      {
        "icon": "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        "title": "RevOS",
        "description": "HubSpot or Attio implementation with lifecycle stages, lead scoring, pipeline automation, and weekly RevOps coaching. Your CRM becomes a revenue system.",
        "link": { "label": "Learn more", "href": "https://ryzo.nl/revops" }
      }
    ]
  },
  "process": {
    "eyebrow": "How we work",
    "headline": "Live in 90 days",
    "steps": [
      {
        "title": "GTM Audit",
        "description": "We map your ICP, current stack, pipeline gaps, and competitive positioning. Deliverable: a written GTM blueprint in week two."
      },
      {
        "title": "System Design",
        "description": "We design your agent-led GTM stack: which OS layers you need, which tools we replace, how the systems connect."
      },
      {
        "title": "Deploy",
        "description": "We build and launch your OutboundOS sequences, PerformanceOS campaigns, and RevOS configuration. You review; we operate."
      },
      {
        "title": "Operate & Optimise",
        "description": "Ongoing management, weekly reporting, and quarterly strategy reviews. The system compounds as it learns your market."
      }
    ]
  },
  "testimonials": {
    "eyebrow": "What clients say",
    "headline": "Results, not promises",
    "items": [
      {
        "quote": "Ryzo mapped our GTM gaps in week one and had outbound running by week three. We closed two deals from the first sequence.",
        "name": "Founder",
        "title": "CEO",
        "company": "SaaS scale-up"
      },
      {
        "quote": "We replaced three vendors and a contractor. Ryzo costs less and produces more pipeline.",
        "name": "Founder",
        "title": "CCO",
        "company": "B2B services firm"
      },
      {
        "quote": "The RevOS implementation cleaned up our HubSpot and gave us actual pipeline visibility for the first time.",
        "name": "Founder",
        "title": "VP Revenue",
        "company": "Series A SaaS"
      }
    ]
  },
  "ctaSection": {
    "headline": "Ready to deploy your GTM system?",
    "subheadline": "Book a 30-minute pipeline audit. We'll map your gaps and show you what an agent-led system looks like for your business.",
    "cta": { "label": "Book your pipeline audit", "href": "https://ryzo.nl/contact" }
  },
  "faq": {
    "eyebrow": "FAQ",
    "headline": "Common questions",
    "items": [
      {
        "question": "How is Ryzo different from a growth agency?",
        "answer": "Traditional agencies sell hours. Ryzo deploys systems. We replace your tool stack with agent-led infrastructure and operate it — so results compound instead of resetting every retainer cycle."
      },
      {
        "question": "Do we need to replace our existing tools?",
        "answer": "Sometimes yes, sometimes no. We audit your stack in week one and identify which tools to keep, which to replace, and which to consolidate. We'll never recommend a change without clear ROI justification."
      },
      {
        "question": "How long until we see results?",
        "answer": "OutboundOS typically generates first replies in week three. PerformanceOS campaigns launch in week four. RevOS pipeline data improves progressively over the first 60 days as scoring and lifecycle enforcement kick in."
      },
      {
        "question": "What does Ryzo cost?",
        "answer": "Pricing depends on which OS layers you need and your pipeline targets. Most clients invest €5k–€15k/month — typically less than their current disconnected tool stack. Book an audit to get a scoped proposal."
      },
      {
        "question": "Do we need an in-house sales or marketing team?",
        "answer": "No. Ryzo is designed to run without in-house specialists. You provide market knowledge and approve strategy; we build and operate the system. That said, we work well alongside existing teams too."
      },
      {
        "question": "Which CRMs do you work with?",
        "answer": "We specialise in HubSpot and Attio. If you're on Salesforce or another platform, book an audit — we'll tell you honestly whether we can serve you well."
      }
    ]
  },
  "footer": {
    "logo": { "text": "Ryzo" },
    "links": [
      { "label": "Website", "href": "https://ryzo.nl" },
      { "label": "Privacy", "href": "https://ryzo.nl/privacy" }
    ],
    "socialLinks": [
      { "platform": "linkedin", "href": "https://linkedin.com/company/ryzo" }
    ],
    "copyright": "© 2026 Ryzo. All rights reserved."
  }
}
```

- [ ] **Step 3: Update example.json to add sections[] and templateType**

The existing `example.json` uses AcmeCorp content. Add the two new required fields at the top so the page doesn't 404 (TypeScript won't enforce at runtime, but the SECTION_MAP depends on `sections`). Update the meta while you're there.

In `content/example.json`, add after `"slug": "example",`:

```json
"templateType": "pitch",
"sections": ["hero", "mediaBlock", "problemSection", "valueProposition", "partnerLogos", "services", "process", "testimonials", "caseStudies", "nextSteps", "ctaSection", "faq"],
```

Also update `"meta"`:
```json
"meta": {
  "title": "Example — Landing Page Builder (Ryzo)",
  "description": "Full section showcase for the Ryzo landing page builder."
}
```

- [ ] **Step 4: Commit**

```bash
git add content/_template-sprint.json content/_template-pitch.json content/example.json
git commit -m "feat: add Sprint + Pitch template JSONs with Ryzo placeholder content; update example.json"
```

---

## Task 14: Visual verification

No code changes — run the dev server and confirm everything renders correctly.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` with no TypeScript or build errors.

- [ ] **Step 2: Check the Sprint template**

Open `http://localhost:3000/_template-sprint` in a browser.

Verify:
- Page background is warm cream (`#F2EDE8`), NOT white
- Navbar shows the Ryzo logo SVG (orange square icon), CTA button is orange rounded-full
- Hero heading is in a serif font (Junicode) at a large clamp size
- Hero subheadline is in sans (Geist), muted brown
- PartnerLogos section renders (even with empty logos array it should render null — confirm no crash)
- Testimonials section shows 3 cards on cream `#FAF7F4`
- CTASection has a dark `#2D2926` background with cream text and orange CTA button
- Footer shows the Ryzo logo, copyright line

- [ ] **Step 3: Check the Pitch template**

Open `http://localhost:3000/_template-pitch`.

Verify:
- 8 sections render in order: Hero → ProblemSection → ValueProposition → Services → Process → Testimonials → CTASection → FAQ
- ProblemSection has cream bg, 3 cards with orange icon backgrounds
- ValueProposition has dark `#2D2926` bg with cream headings
- Process has dark bg with numbered orange circles
- FAQ accordion opens/closes on click
- No console errors

- [ ] **Step 4: Check the example page (full section showcase)**

Open `http://localhost:3000/example`.

Verify all 12 sections render without errors. This is the full regression check.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: visual verification complete — Ryzo landing page builder rebranded"
```

---

## Workflow Reference (post-build)

```bash
# Start a new Sprint campaign
cp content/_template-sprint.json content/my-campaign-slug.json
# Edit the JSON, then preview:
npm run dev  # → http://localhost:3000/my-campaign-slug

# Reorder sections (example: move testimonials before partnerLogos)
# Edit "sections" array in the JSON:
# "sections": ["hero", "testimonials", "partnerLogos", "ctaSection"]

# Deploy
vercel --prod
# Page lives at: https://your-domain.com/my-campaign-slug
```
