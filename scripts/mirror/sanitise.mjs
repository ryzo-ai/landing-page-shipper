/**
 * Mirror sanitiser (client-agnostic). Ported from scripts/mirror-glopros.mjs on client/glopros.
 *
 * Mirrored fragments are rendered with dangerouslySetInnerHTML, so the source page is treated as
 * untrusted even when it is the client's own site: a compromised CMS page must not become XSS here.
 * Regression test: node scripts/sanitise.test.mjs
 */
export const DROP_TAGS =
  'script, noscript, template, iframe, frame, frameset, object, embed, applet, base, meta, link, ' +
  'form, input, textarea, select, button[formaction], portal, math, animate, animatemotion, animatetransform, set, foreignobject, use'
const URL_ATTRS = /^(href|src|action|formaction|xlink:href|poster|background|lowsrc|dynsrc|ping|cite|longdesc|srcset|imagesrcset|data|codebase)$/i
const DROP_ATTRS = /^(on|srcdoc$|formaction$|attributename$|values$|from$|to$|by$|begin$|xmlns:xlink$)/i

/** Strip whitespace, control chars and entities-turned-chars so "java\tscript:" is caught. */
export const normaliseUrl = (v) => String(v).replace(/[\u0000-\u0020\u007f-\u009f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, '').toLowerCase()

export function unsafeUrl(value, tag) {
  const v = normaliseUrl(value)
  if (/^(javascript|vbscript|livescript|mocha):/.test(v)) return true
  if (v.startsWith('data:')) return !(tag === 'img' && /^data:image\/(png|gif|jpe?g|webp|avif);/.test(v))
  return false
}

/**
 * Remove executable content from `root` (a cheerio selection inside document `$`).
 * @param {import('cheerio').CheerioAPI} $
 * @param {import('cheerio').Cheerio<any>} root
 * @param {{ dropAttrs?: RegExp }} [opts] extra attributes to strip (CMS runtime noise)
 */
export function sanitise($, root, opts = {}) {
  root.find(DROP_TAGS).remove()
  root.find('*').each((_, e) => {
    const tag = (e.tagName || '').toLowerCase()
    for (const k of Object.keys(e.attribs || {})) {
      const v = e.attribs[k]
      if ((opts.dropAttrs && opts.dropAttrs.test(k)) || DROP_ATTRS.test(k)) $(e).removeAttr(k)
      else if (URL_ATTRS.test(k) && unsafeUrl(v, tag)) $(e).removeAttr(k)
      else if (k.toLowerCase() === 'style' && /expression\s*\(|javascript:|behavior\s*:|-moz-binding/i.test(normaliseUrl(v))) $(e).removeAttr(k)
    }
  })
  assertSafe(root.prop('outerHTML') || '')
}

/** Final assertion: fail the mirror run rather than ship anything that still looks executable. */
export function assertSafe(html) {
  if (/<(script|iframe|object|embed|animate|set|foreignobject)\b|\son[a-z]+\s*=|javascript:/i.test(html)) {
    throw new Error('sanitiser: executable content survived; refusing to write the fragment')
  }
}
