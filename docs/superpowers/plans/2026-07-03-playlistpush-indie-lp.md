# PlaylistPush Indie Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A PlaylistPush-branded landing page at `/indie-music-promotion`, running locally on branch `client/playlistpush`, with desktop + mobile screenshots delivered to the client folder for Alex's review.

**Architecture:** Two changes on a client branch of this repo: (1) swap `theme.config.ts` tokens + load the Poppins font in `app/layout.tsx`; (2) add one content config `content/indie-music-promotion.json` on the existing `pitch` template. No component/engine changes. Screenshots are committed to the separate `client-playlist-push` repo.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind 4, next/font/google, Playwright (screenshots only).

**Spec:** `docs/superpowers/specs/2026-07-03-playlistpush-indie-lp-design.md`

## Global Constraints

- All work on branch `client/playlistpush` in this repo (`landing-page-shipper`). Never commit to `main`; never merge the branch.
- Commit ONLY files this plan touches. The repo has unrelated dirty files (`docs/superpowers/plans/2026-05-27-ryzo-landing-page-builder.md`, stray `.png`s, `.playwright-mcp/`) — leave them alone; always `git add` explicit paths, never `git add -A`.
- Copy rules (hard requirements): English; trust-first; no invented statistics, testimonials, or quotes; no fake-stream/"guaranteed streams"/"go viral" language. Allowed facts only: founded 2017; Spotify playlist pitching with "Playlist DNA" AI matching; TikTok creator campaigns; pay-per-campaign starting at $280, no subscription; ~45,000 artists; ~4,000 verified curators.
- PlaylistPush brand tokens (extracted 2026-07-03 from `playlistpush-1cb95d.webflow.shared.5d3889546.min.css`): primary `#642EFF`, ink/heading `#160042`, light surfaces `#F3F5FB`/`#E4E6F1`, font Poppins. Zero occurrences of Ryzo orange `#E0621A` may remain in the rendered page.
- Dev server: use `PORT=3010` for every dev-server step (avoids clashing with anything on 3000).
- Screenshot naming (client repo convention): `playlistpush-lp-indie-<viewport>-2026-07-03.png`.

---

### Task 1: Branch + PlaylistPush theme

**Files:**
- Modify: `theme.config.ts` (lines 48–123, the `themeConfig` literal only — keep the interfaces)
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: existing `ThemeTokens`/`ThemeConfig` interfaces (unchanged).
- Produces: CSS variable `--font-poppins` (referenced by the new theme tokens); PlaylistPush token values used by all pages. Task 2/3 rely on the branch name `client/playlistpush`.

- [ ] **Step 1: Create the branch**

```bash
cd /Users/pascal/code/projects/ryzo/ops/ryzo-management/marketing/tools/landing-page-builder
git checkout -b client/playlistpush
```

Expected: `Switched to a new branch 'client/playlistpush'`

- [ ] **Step 2: Load Poppins in `app/layout.tsx`**

Replace the full file with:

```tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Playlist Push — Campaign Landing Pages',
  description: 'Playlist Push campaign landing pages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

(Removing the Geist/Junicode `localFont` imports is intentional — nothing on this branch references `--font-geist`/`--font-albra` after Step 3.)

- [ ] **Step 3: Replace theme tokens in `theme.config.ts`**

Keep lines 1–46 (types) exactly as they are. Replace the `const themeConfig` literal (lines 48–123) with:

```ts
const themeConfig: ThemeConfig = {
  designStyle: 'flat',
  defaultMode: 'light',
  light: {
    colors: {
      primary:      '#642EFF',
      primaryHover: '#5326D9',
      primaryFg:    '#FFFFFF',
      background:   '#FFFFFF',
      surface:      '#F3F5FB',
      surfaceHover: '#E4E6F1',
      textPrimary:  '#160042',
      textSecondary:'rgba(22,0,66,0.65)',
      textMuted:    'rgba(22,0,66,0.40)',
      border:       'rgba(22,0,66,0.10)',
      borderHover:  'rgba(22,0,66,0.20)',
    },
    typography: {
      fontBody:    'var(--font-poppins), system-ui, sans-serif',
      fontHeading: 'var(--font-poppins), system-ui, sans-serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.375rem',
      radiusMd:   '0.75rem',
      radiusLg:   '1rem',
      radiusXl:   '1.5rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(22,0,66,0.06)',
      shadowMd: '0 4px 10px -1px rgba(22,0,66,0.10)',
      shadowLg: '0 12px 24px -4px rgba(22,0,66,0.12)',
    },
  },
  dark: {
    colors: {
      primary:      '#8B5CFF',
      primaryHover: '#642EFF',
      primaryFg:    '#FFFFFF',
      background:   '#160042',
      surface:      '#20094F',
      surfaceHover: '#2B1263',
      textPrimary:  '#F3F5FB',
      textSecondary:'rgba(243,245,251,0.70)',
      textMuted:    'rgba(243,245,251,0.40)',
      border:       'rgba(243,245,251,0.10)',
      borderHover:  'rgba(243,245,251,0.20)',
    },
    typography: {
      fontBody:    'var(--font-poppins), system-ui, sans-serif',
      fontHeading: 'var(--font-poppins), system-ui, sans-serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.375rem',
      radiusMd:   '0.75rem',
      radiusLg:   '1rem',
      radiusXl:   '1.5rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.3)',
      shadowMd: '0 4px 10px -1px rgba(0,0,0,0.4)',
      shadowLg: '0 12px 24px -4px rgba(0,0,0,0.5)',
    },
  },
}
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

Expected: exits 0, no output. If it errors about the removed fonts, some file still imports `--font-geist`/`--font-albra` — find it with `grep -rn "font-geist\|font-albra" app components lib` and update those references to `--font-poppins` too.

- [ ] **Step 5: Verify the theme renders**

```bash
PORT=3010 npm run dev &
sleep 8
curl -s http://localhost:3010/ryzo | grep -c "642EFF\|642eff"
curl -s http://localhost:3010/ryzo | grep -ci "E0621A"
```

Expected: first grep ≥ 1 (purple present), second grep outputs `0` (no Ryzo orange). Leave the dev server running for later tasks.

- [ ] **Step 6: Commit**

```bash
git add theme.config.ts app/layout.tsx
git commit -m "feat(playlistpush): swap theme to PlaylistPush brand tokens (purple/ink/Poppins)"
```

---

### Task 2: Content config `indie-music-promotion.json`

**Files:**
- Create: `content/indie-music-promotion.json`

**Interfaces:**
- Consumes: the `pitch` template section schema (see `content/_template-pitch.json`); route renders at `/[slug]`.
- Produces: page at `/indie-music-promotion` for Task 3 to screenshot.

- [ ] **Step 1: Create `content/indie-music-promotion.json`**

Note: `testimonials` is deliberately excluded from `sections` — we have no real client quotes and inventing them violates the trust rules. Alex can supply real ones later.

```json
{
  "slug": "indie-music-promotion",
  "templateType": "pitch",
  "sections": ["hero", "problemSection", "valueProposition", "services", "process", "ctaSection", "faq"],
  "meta": {
    "title": "Indie Music Promotion — Real Spotify Playlists | Playlist Push",
    "description": "Get your indie music heard on real Spotify playlists. Verified curators, transparent results, pay per campaign. No bots, no fake streams, no subscription."
  },
  "navbar": {
    "logo": { "text": "Playlist Push" },
    "cta": { "label": "Start your campaign", "href": "#cta" }
  },
  "hero": {
    "headline": "Indie music promotion on real Spotify playlists",
    "subheadline": "Submit your track once. Our Playlist DNA technology matches it to verified curators whose playlists actually fit your sound — and you see every result in your dashboard.",
    "cta": { "label": "Start your campaign", "href": "#cta" },
    "socialProof": "45,000+ independent artists · 4,000+ verified curators"
  },
  "problemSection": {
    "eyebrow": "The problem",
    "headline": "Promoting indie music is a minefield",
    "cards": [
      {
        "icon": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        "title": "Fake playlists burn artists",
        "description": "Bot-filled playlists inflate your stream count and can get your music flagged by Spotify. Most \"promotion\" services can't tell you where your streams actually came from."
      },
      {
        "icon": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        "title": "DIY pitching doesn't scale",
        "description": "Finding curators, checking their playlists are real, writing pitches, following up — doing that one playlist at a time is a full-time job on top of making music."
      },
      {
        "icon": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        "title": "No data, no learning",
        "description": "If you can't see which playlists added you, how long you stayed, and what it did for your listeners, you can't tell what worked — or what to do differently on the next release."
      }
    ]
  },
  "valueProposition": {
    "eyebrow": "How Playlist Push is different",
    "headline": "Verified curators. Matched by your sound. Measured in the open.",
    "body": "Playlist DNA analyzes your track's audio profile and matches it to curators whose playlists genuinely fit — by genre, mood, and sound, not spray-and-pray blasts.\n\nEvery curator in the network is vetted and re-verified, and every placement shows up in your campaign dashboard. You always know where your music is, and what it's doing there."
  },
  "services": {
    "eyebrow": "Two ways to grow",
    "headline": "Built for independent artists",
    "cards": [
      {
        "icon": "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
        "title": "Spotify Playlist Pitching",
        "description": "Your track goes to verified curators matched by Playlist DNA. Curators listen and decide — placements are earned, tracked, and reported in your dashboard."
      },
      {
        "icon": "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
        "title": "TikTok Creator Campaigns",
        "description": "Real TikTok creators use your sound in their content, putting your music in front of new audiences organically — no ads, no bots."
      }
    ]
  },
  "process": {
    "eyebrow": "How it works",
    "headline": "From upload to placements in four steps",
    "steps": [
      {
        "title": "Submit your track",
        "description": "Share your released or upcoming track and set your campaign budget. Campaigns are pay-per-campaign — no subscription, no lock-in."
      },
      {
        "title": "Playlist DNA matches",
        "description": "Our AI analyzes your track's audio profile and finds the verified curators whose playlists fit your genre, mood, and sound."
      },
      {
        "title": "Curators listen",
        "description": "Matched curators review your track and decide whether it fits their playlist. Placements are real editorial decisions by real people."
      },
      {
        "title": "Track your results",
        "description": "Follow every placement, review, and stream in your campaign dashboard — transparent data from start to finish."
      }
    ]
  },
  "ctaSection": {
    "headline": "Ready to get your music heard?",
    "subheadline": "Campaigns start at $280. Pay per campaign — no subscription. See exactly which playlists pick you up and what it does for your audience.",
    "cta": { "label": "Start your campaign", "href": "https://playlistpush.com/?utm_source=google&utm_medium=cpc&utm_campaign=indie-lp-prototype" }
  },
  "faq": {
    "eyebrow": "FAQ",
    "headline": "Common questions",
    "items": [
      {
        "question": "Is Playlist Push legit?",
        "answer": "Yes. Playlist Push has been operating since 2017 and works only with verified playlist curators — real people with real audiences. Curators are reviewed before joining the network and monitored continuously. No bots, no fake streams, no guaranteed-placement schemes."
      },
      {
        "question": "Do you guarantee streams or placements?",
        "answer": "No — and you should be suspicious of anyone who does. Curators make their own editorial decisions. What we guarantee is that your track reaches verified curators matched to your sound, and that you can see every result in your dashboard."
      },
      {
        "question": "What does a campaign cost?",
        "answer": "Campaigns start at $280 and scale with your budget and goals. You pay per campaign — there's no subscription and no recurring fee."
      },
      {
        "question": "How does Playlist DNA matching work?",
        "answer": "Playlist DNA analyzes the audio characteristics of your track — genre, mood, energy, sound — and matches it against curator playlist profiles, so your music lands with curators who actually feature your kind of music."
      },
      {
        "question": "I'm an independent artist without a label. Is this for me?",
        "answer": "That's exactly who Playlist Push is built for. More than 45,000 independent artists have run campaigns — you don't need a label, a distributor deal, or an existing following to start."
      },
      {
        "question": "How do I see my results?",
        "answer": "Your campaign dashboard shows every curator review, playlist placement, and the follower and stream activity around your campaign — live, from start to finish."
      }
    ]
  },
  "footer": {
    "logo": { "text": "Playlist Push" },
    "links": [
      { "label": "Website", "href": "https://playlistpush.com" },
      { "label": "Privacy", "href": "https://playlistpush.com/privacy" }
    ],
    "socialLinks": [],
    "copyright": "© 2026 Playlist Push. All rights reserved."
  }
}
```

- [ ] **Step 2: Validate JSON syntax**

```bash
node -e "JSON.parse(require('fs').readFileSync('content/indie-music-promotion.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Verify the page renders**

Dev server should still be running from Task 1 (else restart: `PORT=3010 npm run dev &`).

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3010/indie-music-promotion
curl -s http://localhost:3010/indie-music-promotion | grep -c "Playlist DNA"
curl -s http://localhost:3010/indie-music-promotion | grep -ciE "guaranteed streams|go viral|E0621A"
```

Expected: `200`, then ≥ 1, then `0` (spam-language + Ryzo-orange check).

- [ ] **Step 4: Commit**

```bash
git add content/indie-music-promotion.json
git commit -m "feat(playlistpush): add indie-music-promotion page config"
```

---

### Task 3: Visual QA + screenshots to client repo

**Files:**
- Create: `/Users/pascal/code/projects/ryzo/ops/ryzo-management/service/clients/playlist-push/builds/playlistpush-lp-indie-desktop-2026-07-03.png`
- Create: `/Users/pascal/code/projects/ryzo/ops/ryzo-management/service/clients/playlist-push/builds/playlistpush-lp-indie-mobile-2026-07-03.png`

**Interfaces:**
- Consumes: page at `http://localhost:3010/indie-music-promotion` (Tasks 1–2).
- Produces: two full-page PNGs committed to the `client-playlist-push` repo (a separate git repo — NOT the shipper repo).

- [ ] **Step 1: Capture full-page screenshots**

Use Playwright browser tools (Playwright MCP or `npx playwright`) against the running dev server. CLI variant:

```bash
BUILDS=/Users/pascal/code/projects/ryzo/ops/ryzo-management/service/clients/playlist-push/builds
npx playwright screenshot --viewport-size=1440,900 --full-page \
  http://localhost:3010/indie-music-promotion "$BUILDS/playlistpush-lp-indie-desktop-2026-07-03.png"
npx playwright screenshot --viewport-size=390,844 --full-page \
  http://localhost:3010/indie-music-promotion "$BUILDS/playlistpush-lp-indie-mobile-2026-07-03.png"
```

Expected: two PNG files > 100KB each. If `npx playwright` complains about missing browsers, run `npx playwright install chromium` once, or fall back to the Playwright MCP `browser_take_screenshot` tool with the same viewports.

- [ ] **Step 2: Visual review of the screenshots**

Open/Read both PNGs and check against the spec's acceptance criteria:
- Page reads as PlaylistPush (purple `#642EFF` accents, navy `#160042` headings, Poppins) — not Ryzo.
- All 7 sections render; nothing overflows on the 390px mobile shot.
- Copy shows no spam-adjacent phrasing (spot-check hero + CTA + FAQ).

If anything fails, fix the theme/config, re-capture, and re-review before proceeding.

- [ ] **Step 3: Stop the dev server**

```bash
kill %1 2>/dev/null || pkill -f "next dev.*3010" || true
```

- [ ] **Step 4: Commit screenshots in the client repo**

```bash
cd /Users/pascal/code/projects/ryzo/ops/ryzo-management/service/clients/playlist-push
git add builds/playlistpush-lp-indie-desktop-2026-07-03.png builds/playlistpush-lp-indie-mobile-2026-07-03.png
git commit -m "feat: indie LP prototype screenshots for Alex review (landing-page-shipper client/playlistpush)"
```

Expected: commit created on `main` of `client-playlist-push`. Do NOT push either repo — Pascal reviews first, and client comms go through him.
