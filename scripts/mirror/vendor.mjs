/**
 * Asset vendoring for mirrored pages (client-agnostic). Copies a client's images, fonts and
 * stylesheets into public/mirror/<client>/ so a mirror never hot-links the client's servers.
 *
 *   const v = createVendor({ root, client: 'boostpeople', allow: /^https:\/\/boostpeople\.nl\// })
 *   const local = await v.asset('https://…/logo.svg')        // → /mirror/boostpeople/img/logo-ab12cd34.svg
 *   const css = await v.css(text, 'https://…/style.css')     // url(...) inside rewritten to vendored copies
 *
 * Ported from scripts/mirror-glopros.mjs (client/glopros), generalised: allowed hosts, relative
 * url() resolution, and font/image sub-folders.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import os from 'node:os'
import { execFileSync } from 'node:child_process'

/** CMSs serve WebP under other names; trust magic bytes, not the extension. */
export function extFor(buf, fallback) {
  const h = buf.subarray(0, 12)
  if (h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP') return '.webp'
  if (h.subarray(4, 12).toString().startsWith('ftypavif')) return '.avif'
  if (h[0] === 0x89 && h.subarray(1, 4).toString() === 'PNG') return '.png'
  if (h[0] === 0xff && h[1] === 0xd8) return '.jpg'
  if (h.subarray(0, 4).toString() === 'GIF8') return '.gif'
  if (h.subarray(0, 4).toString() === 'wOF2') return '.woff2'
  if (h.subarray(0, 4).toString() === 'wOFF') return '.woff'
  const s = buf.subarray(0, 200).toString().trimStart()
  if (s.startsWith('<svg') || s.startsWith('<?xml')) return '.svg'
  return fallback
}

const FONT_EXT = /\.(woff2?|ttf|otf|eot)$/i
const MAX_BYTES = 400 * 1024
const MAX_PX = 1600

/** macOS `sips`; when it is missing (Linux CI) optimisation is skipped, never fatal. */
function sips(args) {
  try { return execFileSync('sips', args, { stdio: ['ignore', 'pipe', 'ignore'] }).toString() } catch { return null }
}

/**
 * Performance is a feature: CMS uploads are often camera originals. Rasters over 400 KB are
 * downscaled to 1600 px; opaque PNGs embedded in SVG wrappers are recompressed as JPEG.
 */
export function optimise(buf, ext) {
  if (buf.length <= MAX_BYTES) return { buf, ext }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-'))
  try {
    if (ext === '.jpg' || ext === '.png') {
      const src = path.join(tmp, `in${ext}`)
      fs.writeFileSync(src, buf)
      const alpha = /hasAlpha: yes/.test(sips(['-g', 'hasAlpha', src]) || '')
      const outExt = alpha ? '.png' : '.jpg'
      const out = path.join(tmp, `out${outExt}`)
      const fmt = alpha ? ['-s', 'format', 'png'] : ['-s', 'format', 'jpeg', '-s', 'formatOptions', '78']
      if (sips(['-Z', String(MAX_PX), ...fmt, src, '--out', out]) === null) return { buf, ext }
      const next = fs.readFileSync(out)
      return next.length < buf.length ? { buf: next, ext: outExt } : { buf, ext }
    }
    if (ext === '.svg') {
      let svg = buf.toString('utf8')
      const re = /data:image\/png;base64,([A-Za-z0-9+/=]+)/g
      for (const m of [...svg.matchAll(re)]) {
        const png = Buffer.from(m[1], 'base64')
        if (png.length <= MAX_BYTES) continue
        const r = optimise(png, '.png')
        if (r.ext === '.jpg') svg = svg.replace(m[0], `data:image/jpeg;base64,${r.buf.toString('base64')}`)
      }
      return { buf: Buffer.from(svg), ext }
    }
    return { buf, ext }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}

export function createVendor({ root, client, allow, userAgent = 'Mozilla/5.0 (mirror)' }) {
  const outDir = path.join(root, 'public', 'mirror', client)
  const prefix = `/mirror/${client}`
  for (const sub of ['img', 'fonts', 'css']) fs.mkdirSync(path.join(outDir, sub), { recursive: true })
  const done = new Map()
  const skipped = new Set()

  async function fetchOk(url) {
    const res = await fetch(url, { headers: { 'User-Agent': userAgent } })
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    return res
  }

  function fileName(clean, buf, ext) {
    const base = decodeURIComponent(clean.split('/').pop() || 'asset').replace(/\.[a-z0-9]+$/i, '')
    const slug = base.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60).toLowerCase() || 'asset'
    const hash = crypto.createHash('sha1').update(clean).digest('hex').slice(0, 8)
    return `${slug}-${hash}${ext}`
  }

  /** Vendor one binary asset. Returns the local public path, or the URL unchanged if not allowed. */
  async function asset(url, base) {
    if (!url) return url
    let abs
    try { abs = new URL(url, base).href } catch { return url }
    if (!allow.test(abs)) { skipped.add(abs.split('?')[0]); return url }
    const clean = abs.split('#')[0].split('?')[0]
    if (done.has(clean)) return done.get(clean)
    const raw = Buffer.from(await (await fetchOk(clean)).arrayBuffer())
    const sub = FONT_EXT.test(clean) ? 'fonts' : 'img'
    const { buf, ext } = sub === 'img' ? optimise(raw, extFor(raw, path.extname(clean) || '.bin')) : { buf: raw, ext: path.extname(clean) || '.bin' }
    const file = fileName(clean, buf, ext)
    fs.writeFileSync(path.join(outDir, sub, file), buf)
    const local = `${prefix}/${sub}/${file}`
    done.set(clean, local)
    return local
  }

  /** Rewrite every url(...) in a stylesheet to a vendored copy. `base` resolves relative urls. */
  async function css(text, base) {
    const re = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/g
    const urls = [...new Set([...text.matchAll(re)].map((m) => m[2].trim()))]
    const map = new Map()
    for (const u of urls) {
      if (/^(data:|#|about:)/i.test(u)) continue
      try {
        const local = await asset(u, base)
        if (local !== u) map.set(u, local)
      } catch (e) {
        // A dead background on some other page of their site must not stop the mirror.
        console.warn(`  skip ${u}: ${e.message}`)
      }
    }
    return text.replace(re, (m, q, u) => (map.has(u.trim()) ? `url("${map.get(u.trim())}")` : m))
  }

  /** Fetch a stylesheet, vendor its urls, write it to css/<name>-<hash>.css, return the public path. */
  async function stylesheet(href, name) {
    const text = await (await fetchOk(href)).text()
    return writeCss(await css(text, href), name)
  }

  function writeCss(text, name) {
    const hash = crypto.createHash('sha1').update(text).digest('hex').slice(0, 8)
    const file = `${name.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}-${hash}.css`
    fs.writeFileSync(path.join(outDir, 'css', file), text)
    return `${prefix}/css/${file}`
  }

  /** Remove files from earlier runs that this run no longer references. */
  function prune(keep) {
    const keepSet = new Set(keep)
    for (const sub of ['img', 'fonts', 'css']) {
      for (const f of fs.readdirSync(path.join(outDir, sub))) {
        if (!keepSet.has(`${prefix}/${sub}/${f}`)) fs.rmSync(path.join(outDir, sub, f))
      }
    }
  }

  return { asset, css, stylesheet, writeCss, prune, done, skipped, prefix, outDir }
}
