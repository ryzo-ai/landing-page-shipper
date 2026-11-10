import fs from 'fs'
import path from 'path'

/**
 * Reads pages produced by the mirror scripts (scripts/mirror-<client>.mjs). Client-agnostic:
 * content/mirror/<client>/<slug>.json holds the metadata, <part>.html the sanitised fragments.
 * Fragments are sanitised at mirror time (scripts/mirror/sanitise.mjs); never write them by hand.
 */
export interface MirrorMeta {
  slug: string
  title: string
  description: string
  sourceUrl: string
  mirroredAt: string
  bodyClass: string
  favicon?: string
  stylesheets: string[]
}

const SAFE = /^[a-z0-9-]+$/
const base = () => path.resolve(process.cwd(), 'content', 'mirror')

function resolveFile(client: string, file: string): string | null {
  const name = file.replace(/\.(json|html)$/, '')
  if (!SAFE.test(client) || !SAFE.test(name)) return null
  const p = path.resolve(base(), client, file)
  return p.startsWith(base() + path.sep) ? p : null
}

export function readMirrorMeta(client: string, slug: string): MirrorMeta | null {
  const p = resolveFile(client, `${slug}.json`)
  if (!p) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as MirrorMeta
  } catch {
    return null
  }
}

/** A sanitised HTML fragment: the full page (`<slug>`) or a part such as `header` or `footer`. */
export function readMirrorPart(client: string, part: string): string {
  const p = resolveFile(client, `${part}.html`)
  if (!p) throw new Error(`mirror part not allowed: ${client}/${part}`)
  return fs.readFileSync(p, 'utf-8')
}
