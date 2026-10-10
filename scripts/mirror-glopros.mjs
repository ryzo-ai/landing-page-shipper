#!/usr/bin/env node
/**
 * Mirror live glopros.ai pages into distraction-free paid-traffic LPs.
 *
 *   node scripts/mirror-glopros.mjs            # all pages in PAGES
 *   node scripts/mirror-glopros.mjs sap-hiring # one page
 *
 * Output per page:
 *   content/mirror/<slug>.html   body fragment (styles + header + main + footer), no scripts
 *   content/mirror/<slug>.json   { title, description, sourceUrl, mirroredAt }
 *   public/mirror/glopros/...    vendored stylesheet + images (never hot-linked)
 *
 * Spec: docs/superpowers/specs/2026-10-10-glopros-demo-gate-mirror-lps-design.md
 * Re-run after GloPros changes a page; the transform is deterministic.
 */
import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const OUT_HTML = path.join(ROOT, 'content', 'mirror')
const OUT_ASSETS = path.join(ROOT, 'public', 'mirror', 'glopros')
const PUBLIC_PREFIX = '/mirror/glopros'
const CTA_LABEL = 'Watch the recorded demo'
const CDN = /^https?:\/\/(cdn\.prod\.website-files\.com|uploads-ssl\.webflow\.com)\//

const PAGES = {
  'scaleup-hiring': 'https://www.glopros.ai/scaleup-hiring',
  enterprises: 'https://www.glopros.ai/enterprises',
  'sap-hiring': 'https://www.glopros.ai/sap-hiring',
}

// Replaces the embedded booking form in demo-style heroes. Claims come from the page's own copy.
const HERO_CARDS = {
  'scaleup-hiring': {
    headline: 'See how GloPros fills roles at growth pace',
    items: [
      'How the AI-platform matches qualified professionals to your role',
      'How GloPros Recruiters run the deeper search and deliver a shortlist',
      'Contracts, onboarding and administration, handled automatically',
    ],
  },
  'sap-hiring': {
    headline: 'See how GloPros finds your next SAP professional',
    items: [
      'Matching on module, seniority, implementation experience and location',
      'How ERP-specialised GloPros Recruiters screen hard-to-find profiles',
      'Freelance, payroll contract and permanent hires in one solution',
    ],
  },
}

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function heroCardHtml(slug) {
  const c = HERO_CARDS[slug]
  if (!c) return ''
  return `<div class="gp-hero-card"><p class="gp-hero-card__eyebrow">Recorded product demo</p>` +
    `<h2 class="gp-hero-card__title">${esc(c.headline)}</h2><ul class="gp-hero-card__list">` +
    c.items.map((i) => `<li>${esc(i)}</li>`).join('') +
    `</ul><a href="#watch-demo" data-gp-cta="hero-card" class="gp-gate__submit gp-hero-card__cta">${CTA_LABEL}</a>` +
    `<p class="gp-gate__micro">Free · on demand · no sales call needed</p></div>`
}

// Final values of the count-up stats; the HTML ships them, GSAP animates from 0.
const KEEP_FOOTER_LEGAL = /privacy|security/i
const CTA_TEXT = /book (a|your)( free)? demo|schedule your demo|book a live demo|get started/i

fs.mkdirSync(OUT_HTML, { recursive: true })
fs.mkdirSync(path.join(OUT_ASSETS, 'img'), { recursive: true })
fs.mkdirSync(path.join(OUT_ASSETS, 'css'), { recursive: true })

const downloaded = new Map()

/** Webflow serves WebP under .avif names; trust magic bytes, not the extension. */
function extFor(buf, fallback) {
  const h = buf.subarray(0, 12)
  if (h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP') return '.webp'
  if (h.subarray(4, 12).toString().startsWith('ftypavif')) return '.avif'
  if (h[0] === 0x89 && h.subarray(1, 4).toString() === 'PNG') return '.png'
  if (h[0] === 0xff && h[1] === 0xd8) return '.jpg'
  if (h.subarray(0, 4).toString() === 'GIF8') return '.gif'
  const s = buf.subarray(0, 200).toString().trimStart()
  if (s.startsWith('<svg') || s.startsWith('<?xml')) return '.svg'
  return fallback
}

async function vendor(url, sub = 'img') {
  if (!url || !CDN.test(url)) return url
  const clean = url.split('?')[0]
  if (downloaded.has(clean)) return downloaded.get(clean)
  const res = await fetch(clean)
  if (!res.ok) throw new Error(`asset ${res.status}: ${clean}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const base = decodeURIComponent(clean.split('/').pop()).replace(/\.[a-z0-9]+$/i, '')
  const slugBase = base.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60).toLowerCase()
  const hash = crypto.createHash('sha1').update(clean).digest('hex').slice(0, 8)
  const ext = extFor(buf, path.extname(clean) || '.bin')
  const file = `${slugBase}-${hash}${ext}`
  fs.writeFileSync(path.join(OUT_ASSETS, sub, file), buf)
  const local = `${PUBLIC_PREFIX}/${sub}/${file}`
  downloaded.set(clean, local)
  return local
}

async function vendorCssUrls(css) {
  const urls = [...new Set([...css.matchAll(/url\((['"]?)(https?:[^)'"]+)\1\)/g)].map((m) => m[2]))]
  for (const u of urls) {
    if (!CDN.test(u)) continue
    const local = await vendor(u)
    css = css.split(u).join(local)
  }
  return css
}

/** Strip the rules that keep [data-anim] / [data-slide-animation] hidden until GSAP runs. */
function stripRevealHiding(css) {
  return css.replace(/[^{}]*\[data-(anim|slide-animation)[^{}]*\{[^{}]*(visibility\s*:\s*hidden|opacity\s*:\s*0)[^{}]*\}/g, '')
}

// --- Sanitiser. The fragment is rendered with dangerouslySetInnerHTML, so treat the source page as
// untrusted even though it is GloPros' own site: a compromised Webflow page must not become XSS here.
const DROP_TAGS = 'script, noscript, template, iframe, frame, frameset, object, embed, applet, base, meta, link, ' +
  'form, input, textarea, select, button[formaction], portal, math, animate, animatemotion, animatetransform, set, foreignobject, use'
const URL_ATTRS = /^(href|src|action|formaction|xlink:href|poster|background|lowsrc|dynsrc|ping|cite|longdesc|srcset|imagesrcset|data|codebase)$/i
const DROP_ATTRS = /^(on|srcdoc$|formaction$|attributename$|values$|from$|to$|by$|begin$|xmlns:xlink$)/i
const WF_ATTRS = /^data-wf-(ao|native|element|component)/

/** Strip whitespace, control chars and entities-turned-chars so "java\tscript:" is caught. */
const normaliseUrl = (v) => String(v).replace(/[\u0000-\u0020\u007f-\u009f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, '').toLowerCase()
function unsafeUrl(name, value, tag) {
  const v = normaliseUrl(value)
  if (/^(javascript|vbscript|livescript|mocha):/.test(v)) return true
  if (v.startsWith('data:')) return !(tag === 'img' && /^data:image\/(png|gif|jpe?g|webp|avif);/.test(v))
  return false
}

function sanitise($frag, root) {
  root.find(DROP_TAGS).remove()
  root.find('*').each((_, e) => {
    const tag = (e.tagName || '').toLowerCase()
    for (const k of Object.keys(e.attribs || {})) {
      const v = e.attribs[k]
      if (WF_ATTRS.test(k) || DROP_ATTRS.test(k)) $frag(e).removeAttr(k)
      else if (URL_ATTRS.test(k) && unsafeUrl(k, v, tag)) $frag(e).removeAttr(k)
      else if (k.toLowerCase() === 'style' && /expression\s*\(|javascript:|behavior\s*:|-moz-binding/i.test(normaliseUrl(v))) $frag(e).removeAttr(k)
    }
  })
  // Final assertion: fail the mirror run rather than ship anything that still looks executable
  const html = root.prop('outerHTML') || ''
  if (/<(script|iframe|object|embed|animate|set|foreignobject)\b|\son[a-z]+\s*=|javascript:/i.test(html)) {
    throw new Error('sanitiser: executable content survived; refusing to write the fragment')
  }
}

function relabel($, $el, label) {
  // Replace the deepest non-empty text node so the button keeps its inner structure.
  const textEls = $el.find('*').addBack().filter((_, e) => $(e).children().length === 0 && $(e).text().trim())
  if (textEls.length) $(textEls[0]).text(label)
  else $el.text(label)
}

function sectionKey($, el) {
  const sec = $(el).closest('section')
  const cls = (sec.attr('class') || '').split(/\s+/)[0] || 'page'
  return cls.replace(/^section_/, '').replace(/_/g, '-')
}

function makeCta($, $el, location) {
  $el.attr('href', '#watch-demo').attr('data-gp-cta', location).removeAttr('target')
  relabel($, $el, CTA_LABEL)
}

async function mirror(slug, url) {
  const html = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (ryzo-mirror)' } })).text()
  const $ = cheerio.load(html)

  const title = $('title').text().trim()
  const description = $('meta[name="description"]').attr('content') || ''

  // Stylesheet
  const cssHref = $('link[rel="stylesheet"]').filter((_, l) => CDN.test($(l).attr('href') || '')).first().attr('href')
  if (!cssHref) throw new Error(`${slug}: Webflow stylesheet not found`)
  let css = await (await fetch(cssHref)).text()
  css = await vendorCssUrls(css)
  const cssFile = `shared-${crypto.createHash('sha1').update(css).digest('hex').slice(0, 8)}.css`
  fs.writeFileSync(path.join(OUT_ASSETS, 'css', cssFile), css)

  // Inline <style> blocks (head custom code + body embeds), minus reveal-hiding rules
  const styles = []
  for (const s of $('style').toArray()) {
    const t = stripRevealHiding($(s).html() || '')
    if (t.trim()) styles.push(await vendorCssUrls(t))
  }

  // --- Header: logo + one CTA
  const $header = $('header.navbar').first()
  $header.find('.navbar_menu, .navbar_menu-button').remove()
  const $btnWrap = $header.find('.navbar_button_wrapper')
  const $demoBtn = $btnWrap.find('.button-main').filter((_, b) => /book a demo/i.test($(b).text())).first().closest('.hide-mobile')
  $btnWrap.children().not($demoBtn).remove()
  $demoBtn.removeClass('hide-mobile')
  $demoBtn.find('a').each((_, a) => $(a).attr('href', '#watch-demo').attr('data-gp-cta', 'header').removeAttr('target'))
  relabel($, $demoBtn.find('.button-main').first(), CTA_LABEL)
  $demoBtn.find('.button-main').first().attr('data-gp-cta', 'header')
  const $brand = $header.find('a.navbar_brand')
  $brand.replaceWith(`<div class="${$brand.attr('class')}">${$brand.html()}</div>`)

  // --- Main
  const $main = $('main').length ? $('main').first() : $('body')
  $main.find('section.section_soft-links-to-other-pages').remove()
  $main.find('.hero_demo-form').each((_, f) => {
    $(f).replaceWith(`<div class="hero_demo-form gp-demo-card">${heroCardHtml(slug)}</div>`)
  })
  // CTAs
  $main.find('a, button').each((_, el) => {
    const $el = $(el)
    if ($el.closest('.w-tab-menu').length || $el.hasClass('w-tab-link')) return
    const text = $el.text().trim()
    const href = $el.attr('href') || ''
    const isButton = $el.is('.button, .button-main, .button-arrow') || $el.closest('.button-main').length
    if (CTA_TEXT.test(text) || /book-a-demo/.test(href) || (isButton && text)) {
      const key = sectionKey($, el)
      // a.link-absolute is an invisible overlay link inside .button-main: hook it, never label it
      $el.find('a.link-absolute').attr('href', '#watch-demo').attr('data-gp-cta', key)
      if ($el.is('a.link-absolute')) { $el.attr('href', '#watch-demo').attr('data-gp-cta', key); return }
      makeCta($, $el, key)
      return
    }
    // Any other link that leaves the page is a distraction
    if ($el.is('a') && href && !href.startsWith('#')) {
      $el.closest('a').remove()
    }
  })

  // --- Footer: logo, copyright, privacy + security
  const $footer = $('footer').first()
  $footer.find('.footer_top, .devider-footer, .footer_link-wrap, .footer_main .hflex').remove()
  $footer.find('.footer_main_left a').each((_, a) => $(a).replaceWith(`<div>${$(a).html()}</div>`))
  $footer.find('a.footer_legal').each((_, a) => {
    if (!KEEP_FOOTER_LEGAL.test($(a).text())) $(a).remove()
    else {
      const h = $(a).attr('href') || ''
      $(a).attr('href', h.startsWith('http') ? h : `https://www.glopros.ai${h}`).attr('target', '_blank').attr('rel', 'noopener')
    }
  })
  const $footerBg = $('.footer_bg').first()

  // --- Assets and scripts
  const $frag = cheerio.load('<div id="gp-mirror"></div>')
  const root = $frag('#gp-mirror')
  root.append($header.clone()).append($main.clone()).append($footer.clone()).append($footerBg.clone())
  root.find('script, noscript, iframe, form').remove()
  root.find('.css-code, .js-code').filter((_, e) => !$frag(e).find('style').length).remove()
  root.find('style').remove() // collected above
  root.find('[srcset]').removeAttr('srcset').removeAttr('sizes')
  for (const img of root.find('img').toArray()) {
    const src = $frag(img).attr('src')
    $frag(img).attr('src', await vendor(src)).removeAttr('loading')
  }
  for (const el of root.find('[style*="url("]').toArray()) {
    $frag(el).attr('style', await vendorCssUrls($frag(el).attr('style')))
  }
  // Webflow runtime ids that would otherwise trip IX2 lookups; plus a hard sanitise, since the
  // fragment is rendered with dangerouslySetInnerHTML: no inline handlers, no javascript: URLs.
  sanitise($frag, root)

  const out =
    `<link rel="stylesheet" href="${PUBLIC_PREFIX}/css/${cssFile}">\n` +
    `<style data-gp="inline">${styles.join('\n')}</style>\n` +
    root.prop('outerHTML')
  fs.writeFileSync(path.join(OUT_HTML, `${slug}.html`), out)
  fs.writeFileSync(
    path.join(OUT_HTML, `${slug}.json`),
    JSON.stringify({ slug, title, description, sourceUrl: url, mirroredAt: new Date().toISOString() }, null, 2) + '\n',
  )
  const ctas = root.find('[data-gp-cta]').length
  const leftoverLinks = root.find('a[href]').filter((_, a) => !/^#|glopros\.ai\/(privacy|security)/i.test($frag(a).attr('href'))).length
  console.log(`${slug}: ${ctas} CTA hooks, ${leftoverLinks} other links, ${root.find('img').length} images`)
}

const only = process.argv.slice(2)
for (const [slug, url] of Object.entries(PAGES)) {
  if (only.length && !only.includes(slug)) continue
  await mirror(slug, url)
}
console.log(`assets: ${downloaded.size} files in public/mirror/glopros`)
