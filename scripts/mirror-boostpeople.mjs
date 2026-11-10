#!/usr/bin/env node
/**
 * Mirror the Boost & People vacancy page (WordPress + Elementor Pro) into a demo LP whose every
 * "Solliciteren" opens the multi-step application form.
 *
 *   node scripts/mirror-boostpeople.mjs
 *
 * Output:
 *   content/mirror/boostpeople/business-manager.html   full page fragment (header + vacancy + footer)
 *   content/mirror/boostpeople/header.html             header only   (thank-you page)
 *   content/mirror/boostpeople/footer.html             footer only   (thank-you page, login)
 *   content/mirror/boostpeople/contact-card.html       Florian's card (thank-you page)
 *   content/mirror/boostpeople/business-manager.json   title, description, body classes, stylesheets
 *   public/mirror/boostpeople/{css,fonts,img}/          vendored copies, never hot-linked
 *
 * Generic core: scripts/mirror/sanitise.mjs + scripts/mirror/vendor.mjs. This file is the
 * Elementor adapter. Re-run after B&P edits the page; the transform is deterministic.
 * No WordPress / Elementor / jQuery / Carerix / slider / GA / GTM script survives.
 */
import * as cheerio from 'cheerio'
import fs from 'node:fs'
import path from 'node:path'
import { sanitise } from './mirror/sanitise.mjs'
import { createVendor } from './mirror/vendor.mjs'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const CLIENT = 'boostpeople'
const SLUG = 'business-manager'
const SOURCE = 'https://boostpeople.nl/business-manager-amsterdam-e-o/'
const OUT = path.join(ROOT, 'content', 'mirror', CLIENT)
const ORIGIN = /^https:\/\/boostpeople\.nl\//
const PRIVACY_URL = 'https://boostpeople.nl/cookiebeleid/'
const FORM_HASH = '#solliciteren'
const CTA_LABEL = 'Solliciteer direct'

// Links that may stay live. Everything else that leaves the page is rendered as plain text.
const KEEP_LINK = /^(#|tel:|mailto:|https:\/\/wa\.me\/|https:\/\/www\.linkedin\.com\/in\/florianverhagen|https:\/\/boostpeople\.nl\/cookiebeleid)/i
// Sidebar blocks that send visitors elsewhere (or hold a newsletter form)
const DROP_SIDEBAR = /^(Gerelateerde vacatures|Ontvang vergelijkbare|Deel deze vacature|Nieuws)/i
// The page's own jQuery renames these Carerix headings at runtime; apply them statically.
const CX_HEADINGS = {
  '.cx_h4.cx2_introduction': 'Wat ga je doen?',
  '.cx_h4.cx2_function': 'Wie ben jij?',
  '.cx_h4.cx2_offer': 'Wat wij bieden?',
  '.cx_h4.cx2_requirements': 'Wat wij vragen?',
}
// Stylesheets from other hosts: sliders (removed), Google Fonts (self-hosted copies exist), FA CDN.
const SKIP_CSS = /cdn\.jsdelivr\.net|fonts\.googleapis\.com|bootstrapcdn\.com/
// Inline style blocks that only matter with the WP runtime
const SKIP_INLINE = /wp-emoji-styles/

const v = createVendor({ root: ROOT, client: CLIENT, allow: ORIGIN })
fs.mkdirSync(OUT, { recursive: true })

const html = await (await fetch(SOURCE, { headers: { 'User-Agent': 'Mozilla/5.0 (mirror)' } })).text()
const $ = cheerio.load(html)

const title = $('title').text().trim()
const bodyClass = ($('body').attr('class') || '').trim()

// ---------------------------------------------------------------- stylesheets, in document order
const stylesheets = []
let inlineIdx = 0
for (const el of $('link[rel="stylesheet"], style').toArray()) {
  const $el = $(el)
  if (el.tagName === 'link') {
    const href = ($el.attr('href') || '').replace(/&#038;/g, '&')
    const abs = new URL(href, SOURCE).href
    if (SKIP_CSS.test(abs) || !ORIGIN.test(abs)) continue
    const name = ($el.attr('id') || path.basename(abs.split('?')[0], '.css')).replace(/-css$/, '')
    stylesheets.push(await v.stylesheet(abs, name))
  } else {
    if (SKIP_INLINE.test($el.attr('id') || '')) continue
    let css = $el.html() || ''
    // Elementor hides backgrounds of below-the-fold containers until its JS adds .e-lazyloaded
    css = css.replace(/[^{}]*:not\(\.e-lazyloaded\)[^{}]*\{[^{}]*\}/g, '')
    if (!css.trim()) continue
    css = await v.css(css, SOURCE)
    stylesheets.push(v.writeCss(css, `inline-${String(++inlineIdx).padStart(2, '0')}-${$el.attr('id') || 'style'}`))
  }
}
// Font stylesheets referenced by @import are not used by Elementor; fail loudly if that changes.
for (const s of stylesheets) {
  const t = fs.readFileSync(path.join(ROOT, 'public', s), 'utf8')
  if (/@import\s/.test(t)) console.warn(`  note: @import left in ${s}`)
}

// ---------------------------------------------------------------- generic Elementor clean-up
// EWWW lazy-loader: real src lives in data-src-img; the noscript fallback is dropped.
$('img[data-src-img]').each((_, img) => {
  const $i = $(img)
  $i.attr('src', $i.attr('data-src-img')).removeAttr('data-src-img').removeAttr('data-src-webp').removeAttr('data-eio')
})
$('noscript').remove()
$('[srcset]').removeAttr('srcset').removeAttr('sizes')
// Reveal animations: show the end state
$('.elementor-invisible').removeClass('elementor-invisible')
// Elementor Pro sticky (jQuery) → CSS position: sticky, same offset and devices (see bp.css .bp-sticky)
$('[data-settings*="sticky"]').each((_, el) => {
  let s
  try { s = JSON.parse($(el).attr('data-settings')) } catch { return }
  if (s.sticky !== 'top') return
  const $el = $(el)
  // The header's sticky child only works on the <header> itself; bp.css handles that case.
  if ($el.closest('header').length) return
  $el.addClass('bp-sticky').attr('style', `--bp-sticky-top:${Number(s.sticky_offset) || 0}px`)
  if (Array.isArray(s.sticky_on) && !s.sticky_on.includes('mobile')) $el.addClass('bp-sticky--desktop')
})
$('[data-settings]').removeAttr('data-settings')
$('.elementor-widget-html').remove() // script-only widgets (Carerix jQuery tweaks)
for (const [sel, text] of Object.entries(CX_HEADINGS)) $(sel).text(text)

function makeCta($a, location) {
  $a.attr('href', FORM_HASH).attr('data-bp-cta', location).removeAttr('target').removeAttr('rel')
  const $t = $a.find('.elementor-button-text')
  if ($t.length) $t.text(CTA_LABEL)
  else $a.text(CTA_LABEL)
}
// Plain text: an <a> without href keeps B&P's link styling but is not a link (not focusable, no navigation)
const textOnly = ($a) => {
  for (const k of ['href', 'target', 'rel', 'title']) $a.removeAttr(k)
}

// ---------------------------------------------------------------- header: logo + one CTA
const $header = $('header.elementor-location-header').first()
$header.find('.elementor-widget-nav-menu').remove()
$header.find('a').each((_, a) => {
  const $a = $(a)
  if ($a.find('img').length) textOnly($a) // logo, not linked
})
$header.find('a.elementor-button').each((_, a) => {
  makeCta($(a), 'header')
  // B&P hide this button below desktop (the burger menu takes over); here it is the only action.
  for (const el of $(a).parents('.elementor-element').toArray()) {
    const $el = $(el)
    $el.attr('class', ($el.attr('class') || '').replace(/\belementor-hidden-[a-z_]+\b/g, '').replace(/\s+/g, ' ').trim())
  }
  $(a).closest('.e-con').addClass('bp-header-cta')
})

// ---------------------------------------------------------------- vacancy body
const $single = $('[data-elementor-type="single-post"]').first()
$single.attr('id', 'bp-content')
// Breadcrumbs as plain text
$single.find('#breadcrumbs a').each((_, a) => textOnly($(a)))
// Sidebar distractions
$single.find('.elementor-widget-heading').each((_, h) => {
  if (DROP_SIDEBAR.test($(h).text().trim())) $(h).closest('.e-con').remove()
})
// Every "Solliciteren" CTA opens the form
$single.find('a').each((_, a) => {
  const $a = $(a)
  const href = $a.attr('href') || ''
  if (/#vacatures-contact/.test(href) || /sollicit/i.test($a.find('.elementor-button-text').text())) {
    makeCta($a, $a.closest('.contact-form').length ? 'contact-block' : 'apply-bar')
  }
})
// Florian's card: links stay live, open in a new tab, and get an accessible name
const ICON_LABEL = [
  [/linkedin\.com/, 'LinkedIn-profiel van Florian Verhagen'],
  [/wa\.me/, 'WhatsApp Florian Verhagen'],
  [/^mailto:/, 'E-mail Florian Verhagen'],
  [/^tel:/, 'Bel Florian Verhagen'],
]
$single.find('a.elementor-icon').each((_, a) => {
  const $a = $(a)
  const href = $a.attr('href') || ''
  const label = ICON_LABEL.find(([re]) => re.test(href))
  if (label) $a.attr('aria-label', label[1])
  if (/^https:/.test(href)) $a.attr('target', '_blank').attr('rel', 'noopener')
})
// Contact block: keep "Boost en bel direct", add the primary "Solliciteer direct" before it
$single.find('.contact-form a[href^="tel:"].elementor-button').each((_, a) => {
  const $widget = $(a).closest('.elementor-widget-button')
  const $primary = $widget.clone()
  makeCta($primary.find('a.elementor-button'), 'contact-block')
  $widget.addClass('bp-btn-secondary')
  $widget.wrap('<div class="bp-btn-row"></div>')
  $widget.before($primary)
})

// ---------------------------------------------------------------- footer: logo, ©, privacy
const $footer = $('footer.elementor-location-footer').first()
$footer.find('.elementor-widget').each((_, w) => {
  const $w = $(w)
  const isLogo = $w.is('.elementor-widget-image') && $w.find('img[src*="logo"]').length
  const isCopyright = $w.is('.elementor-widget-icon-list') && /©/.test($w.text())
  if (!isLogo && !isCopyright) $w.remove()
})
$footer.find('.elementor-icon-list-item').each((_, li) => {
  const $li = $(li)
  const t = $li.text().trim()
  if (!/©|privacy/i.test(t)) $li.remove()
})
$footer.find('a').each((_, a) => {
  const $a = $(a)
  if (/privacy/i.test($a.text())) $a.attr('href', PRIVACY_URL).attr('target', '_blank').attr('rel', 'noopener')
  else textOnly($a)
})
// Drop containers that no longer hold any widget
for (let i = 0; i < 4; i++) {
  $footer.find('.e-con').each((_, c) => {
    if (!$(c).find('.elementor-widget').length) $(c).remove()
  })
}

// ---------------------------------------------------------------- any link left that leaves the page
for (const $scope of [$header, $single, $footer]) {
  $scope.find('a[href]').each((_, a) => {
    const $a = $(a)
    if (!KEEP_LINK.test($a.attr('href') || '')) textOnly($a)
  })
}

// ---------------------------------------------------------------- assemble, vendor, sanitise
const $frag = cheerio.load('<div id="bp-root"></div>')
const root = $frag('#bp-root')
const skip = $('a.skip-link').first().clone().attr('href', '#bp-content')
root.append(skip).append($header.clone()).append($single.clone()).append($footer.clone())

for (const img of root.find('img').toArray()) {
  const $i = $frag(img)
  $i.attr('src', await v.asset($i.attr('src'), SOURCE))
  if (!$i.attr('alt') && /logo/.test($i.attr('src') || '')) $i.attr('alt', 'Boost & People')
}
for (const el of root.find('[style*="url("]').toArray()) {
  $frag(el).attr('style', await v.css($frag(el).attr('style'), SOURCE))
}
sanitise($frag, root)

const pieces = {
  [`${SLUG}.html`]: root.html(),
  'header.html': $frag.html(root.find('header.elementor-location-header')),
  'footer.html': $frag.html(root.find('footer.elementor-location-footer')),
  // Elementor scopes element CSS under .elementor-<post id>; keep that wrapper around the card
  'contact-card.html':
    `<div class="${root.find('#bp-content').attr('class')}">` +
    $frag.html(root.find('.elementor-widget-image').filter((_, w) => /florian/i.test($frag(w).find('img').attr('src') || '')).first().closest('.e-con')) +
    '</div>',
}
for (const [file, out] of Object.entries(pieces)) {
  if (!out || out.length < 50) throw new Error(`empty mirror piece: ${file}`)
  fs.writeFileSync(path.join(OUT, file), out + '\n')
}

const favicon = await v.asset('https://boostpeople.nl/wp-content/uploads/2024/06/Favicon-1.svg')
const meta = {
  slug: SLUG,
  title,
  description:
    'Business Manager bij Boost & People in Amsterdam e.o.: commercie, relatiebeheer en recruitment. ' +
    '€4.000–4.750 bruto per maand, 40 uur, HBO/WO.',
  sourceUrl: SOURCE,
  mirroredAt: new Date().toISOString(),
  bodyClass,
  favicon,
  stylesheets,
}
fs.writeFileSync(path.join(OUT, `${SLUG}.json`), JSON.stringify(meta, null, 2) + '\n')

v.prune([...v.done.values(), ...stylesheets])

const ctas = root.find('[data-bp-cta]').length
const links = root.find('a[href]').map((_, a) => $frag(a).attr('href')).get()
console.log(`${SLUG}: ${ctas} CTA hooks, ${root.find('img').length} images, ${stylesheets.length} stylesheets`)
console.log(`live links kept: ${[...new Set(links)].join(' · ')}`)
console.log(`assets: ${v.done.size} vendored · ${v.skipped.size} external refs not vendored`)
for (const s of v.skipped) console.log(`  external (not loaded): ${s}`)
