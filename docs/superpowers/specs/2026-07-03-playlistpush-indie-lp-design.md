# PlaylistPush Indie Landing Page — Design

**Date:** 2026-07-03
**Status:** Draft — pending Pascal review
**Client:** PlaylistPush (`ryzo-management/service/clients/playlist-push/`, Google Ads 778-284-3388)

## Goal

Ship the first client-branded landing page from the landing-page-shipper: a PlaylistPush-branded page targeting **indie music promotion** search intent. Phase 1 (this spec) delivers a local prototype for Alex Mitchell-Hardt's review. Phase 2 (separate plan, after Alex validates) deploys it live as a Google Ads destination.

## Why indie (data basis)

- The Ads account is ~100% brand traffic: in the last 90 days (2026-04-04 → 2026-07-03), all converting search terms were "playlist push" variants; genre-modified terms had ~80 impressions and zero clicks. No genre signal exists in-account.
- Keyword Planner (US/English): "indie music promotion" = 320 searches/mo, LOW competition, $1.24–4.92 top-of-page bids — 6× the next genre ("rap music promotion", 50/mo, MEDIUM, bids to $11).
- "Indie" doubles as genre and identity: it matches independent artists of any genre, which is PlaylistPush's entire customer base. Best message match of any genre keyword.

## Architecture

Work happens on branch **`client/playlistpush`** in the `landing-page-shipper` repo (this repo). Nothing merges to `main` — per-client theming is per-deployment, and `main` stays Ryzo-branded until the multi-client theming model exists.

Two changes on the branch:

1. **`theme.config.ts`** — replace Ryzo tokens with PlaylistPush brand tokens (colors, fonts, radius, design style, default mode) extracted from playlistpush.com. Extraction: run the built-in `/admin/scan` against playlistpush.com; verify the extracted tokens manually against the live site before committing (scanner output is a starting point, not truth).
2. **`content/indie-music-promotion.json`** — new page config on the **`pitch`** template, rendering at `/indie-music-promotion`. Slug matches the target keyword for message match.

No component or engine code changes. If the pitch template can't express something the page needs, cut the section rather than fork components — template gaps get logged for the tool backlog instead.

## Page content

Copy is English, data-heavy, and trust-first per the client CLAUDE.md. Positioning constraints are hard requirements:

- **Angle:** "Get your music on real Spotify playlists" for independent artists — verified curators, transparent results, pay-per-campaign (from $280, no subscription).
- **Proof points:** ~45K artists, ~4K verified curators, AI "Playlist DNA" matching. Numbers only from the client CLAUDE.md or playlistpush.com itself — no invented stats.
- **Anti-spam rule:** nothing that resembles fake-stream/bot-playlist promises ("guaranteed streams", "go viral") — the category's scam reputation is the reason trust-first positioning exists.
- **CTA:** links to playlistpush.com campaign start, UTM-tagged (`utm_source=google&utm_medium=cpc&utm_campaign=indie-lp-prototype` placeholder until Phase 2 finalizes tracking).

## Error handling / risks

- Scanner output may be incomplete or wrong → manual verification step against the live site is mandatory before the theme commits.
- PlaylistPush fonts may be licensed → if not on Google Fonts, substitute the closest Google Font and note the substitution for Alex.
- Repo has unrelated dirty files (`docs/superpowers/plans/…`, stray PNGs) → commits on the branch include only files this work touches.

## Testing / acceptance

- `npm run dev`, page renders at `/indie-music-promotion` with no console errors.
- Full-page screenshots (desktop + mobile viewport) saved to `clients/playlist-push/builds/` in ryzo-ops for Alex's review.
- Visual check: page reads as PlaylistPush, not Ryzo — no `#E0621A` orange anywhere.
- Copy check against the anti-spam rule above.

## Out of scope (Phase 2, after Alex validates)

Vercel project, subdomain on playlistpush.com (needs Alex/DNS), conversion tracking + `/verify-tracking`, ad campaign build for the new keyword space. Client comms (sending the prototype to Alex) go through Pascal's review — never sent directly.
