import type { Metadata, Viewport } from 'next'
import { MirrorMeta, readMirrorMeta } from '../../lib/mirror-pages'
import { BP_CLIENT, bpContent } from '../../lib/boostpeople/content'
import DemoBadge from '../../components/boostpeople/DemoBadge'
import '../../components/boostpeople/bp.css'

/**
 * Root layout for the Boost & People demo. Loads B&P's vendored WordPress/Elementor CSS in the
 * order of the live page and reuses its body classes (Elementor scopes its kit tokens to
 * body.elementor-kit-7). No CMS, analytics or tag-manager script is loaded.
 */
function loadMeta(): MirrorMeta {
  const m = readMirrorMeta(BP_CLIENT, bpContent.vacancy.slug)
  if (!m) throw new Error('Run `node scripts/mirror-boostpeople.mjs` first: mirror metadata missing')
  return m
}
const meta = loadMeta()

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: meta.favicon ? { icon: [{ url: meta.favicon, type: 'image/svg+xml' }] } : undefined,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#143E35',
}

export default function BoostPeopleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        {meta.stylesheets.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body id="bp" className={meta.bodyClass}>
        {children}
        <DemoBadge />
      </body>
    </html>
  )
}
