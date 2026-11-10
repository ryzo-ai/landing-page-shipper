'use client'

import { memo, useEffect, useRef } from 'react'

interface Props {
  /** Sanitised fragment from content/mirror/<client>/ (see scripts/mirror/sanitise.mjs). */
  html: string
  /** Attribute that marks a CTA in the fragment, e.g. "data-bp-cta". Its value is the location. */
  ctaAttr: string
  onCta: (location: string, text: string) => void
  className?: string
}

/**
 * Renders a mirrored client page (vendored CSS + static markup, no CMS runtime) and routes every
 * CTA marked with `ctaAttr` to `onCta`. Client-agnostic; ported from the GloPros mirror.
 */
function MirrorPage({ html, ctaAttr, onCta, className }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const cb = useRef(onCta)
  useEffect(() => {
    cb.current = onCta
  }, [onCta])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      const t = (e.target as Element).closest(`[${ctaAttr}]`)
      if (!t || !el.contains(t)) return
      e.preventDefault()
      cb.current(t.getAttribute(ctaAttr) || 'unknown', (t.textContent || '').trim().slice(0, 60))
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [ctaAttr])

  return <div ref={root} className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

// The fragment is static: never re-render it (that would reset the DOM under the user).
export default memo(MirrorPage, (a, b) => a.html === b.html && a.ctaAttr === b.ctaAttr && a.className === b.className)
