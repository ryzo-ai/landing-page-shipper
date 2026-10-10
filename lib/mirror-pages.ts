import fs from 'fs'
import path from 'path'

/** Pages produced by scripts/mirror-glopros.mjs (hero card copy lives there). */
export const MIRROR_PAGES = new Set(['scaleup-hiring', 'enterprises', 'sap-hiring'])

export interface MirrorDoc {
  slug: string
  html: string
  title: string
  description: string
}

export function readMirror(slug: string): MirrorDoc | null {
  if (!/^[a-z0-9-]+$/.test(slug) || !MIRROR_PAGES.has(slug)) return null
  const base = path.resolve(process.cwd(), 'content', 'mirror')
  try {
    const html = fs.readFileSync(path.join(base, `${slug}.html`), 'utf-8')
    const meta = JSON.parse(fs.readFileSync(path.join(base, `${slug}.json`), 'utf-8'))
    return { slug, html, title: meta.title, description: meta.description }
  } catch {
    return null
  }
}

export function mirrorSlugs(): string[] {
  return [...MIRROR_PAGES].filter((s) => readMirror(s))
}
