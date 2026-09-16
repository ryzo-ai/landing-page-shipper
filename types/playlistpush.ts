/**
 * Content schema for the PlaylistPush template — a 1:1 structural mirror of
 * playlistpush.com/spotify-playlists-promotion (read 2026-09-16).
 *
 * Every string a visitor can read lives here so the three genre pages are pure
 * data variants of one component tree. Numeric claims must come from the
 * Claimable Metrics table in the client CLAUDE.md (verified against the live site).
 */

export interface PPLink { label: string; href: string }
export interface PPImage { src: string; alt: string }

export interface PPHeader {
  home: string
  logoOnLight: PPImage
  logoOnDark: PPImage
  signIn: PPLink
  cta: PPLink
}

export interface PPPromoTile {
  label: string
  /** Numeric value that counts up on reveal (e.g. 82, 133, 9.9). */
  value: number
  prefix?: string
  suffix?: string
  badge?: string
  sub?: string
}

export interface PPHero {
  /** h1 renders as `${before} <span class="g">${highlight}</span>${after}`. */
  h1: { before?: string; highlight: string; after: string }
  sub: string
  cta: PPLink
  secondary: PPLink
  promo: {
    title: string
    playlists: PPPromoTile
    streams: PPPromoTile
    editorial: PPPromoTile
    algorithmic: PPPromoTile
    listeners: PPPromoTile
    followers: PPPromoTile
  }
  phone: PPImage
  trust: {
    href: string
    rating: number
    ratingText: string
    countText: string
    avatars: string[]
  }
  stats: { num: string; label: string }[]
}

export interface PPPitch {
  eyebrow: string
  title: string
  checklist: string[]
  cta: PPLink
  /** 9 playlist covers in the 3D grid; the first is the top-left tile. */
  covers: PPImage[]
}

export interface PPHowItWorks {
  eyebrow: string
  title: string
  steps: { title: string; text: string }[]
}

export interface PPCurators {
  title: string
  sub: string
  cta: PPLink
  curator: { name: string; avatar: PPImage; tag: string; checks: string[] }
}

export interface PPPress {
  label: string
  logos: (PPImage & { invert?: boolean })[]
}

export interface PPReviews {
  eyebrow: string
  title: string
  items: { quote: string; name: string; photo: string; artistUrl: string }[]
}

export interface PPTeam {
  eyebrow: string
  title: string
  sub: string
  avatars: string[]
  caption: string
}

export interface PPPricing {
  eyebrow: string
  title: string
  label: string
  min: number
  max: number
  step: number
  initial: number
  /** Site formula: playlists = round(budget / dollarsPerPlaylist). */
  dollarsPerPlaylist: number
  /** Above this budget the calculator shows "On Request" instead of numbers. */
  onRequestAbove: number
  reachLabel: string
  playlistsLabel: string
  currencyLabel: string
  onRequestPrompt: string
  onRequestLabel: string
  minLabel: string
  maxLabel: string
  cta: PPLink
  note: string
}

export interface PPFaq {
  title: string
  items: { q: string; a: string }[]
}

export interface PPFooter {
  cta: { title: string; sub: string; button: PPLink }
  logo: PPImage & { href: string }
  tagline: PPLink
  social: { icon: string; href: string; label: string }[]
  disclaimer: string
  columns: { title: string; links: PPLink[] }[]
  copyright: string
  bottomLinks: PPLink[]
}

export interface PlaylistPushContent {
  slug: string
  templateType: 'playlistpush'
  meta: { title: string; description: string }
  header: PPHeader
  hero: PPHero
  pitch: PPPitch
  howItWorks: PPHowItWorks
  curators: PPCurators
  press: PPPress
  reviews: PPReviews
  team: PPTeam
  pricing: PPPricing
  faq: PPFaq
  footer: PPFooter
}
