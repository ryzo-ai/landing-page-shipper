'use client'

import { useEffect, useRef, useState } from 'react'
import DemoGate from './DemoGate'
import { setPageSlug, track } from '../../lib/track'
import './gate.css'

interface Props {
  slug: string
  html: string
}

/**
 * Renders a mirrored glopros.ai page (static Webflow markup + vendored CSS) and wires every
 * [data-gp-cta] to the recorded-demo gate. No Webflow / GSAP runtime: reveal animations are shown
 * in their end state, and Webflow tabs get a minimal replacement below.
 */
export default function MirrorPage({ slug, html }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [gate, setGate] = useState<{ open: boolean; location: string }>({ open: false, location: '' })

  useEffect(() => {
    setPageSlug(slug)
    track('lp_view')
    const el = root.current
    if (!el) return

    const onClick = (e: MouseEvent) => {
      const t = (e.target as Element).closest('[data-gp-cta]')
      if (!t) return
      e.preventDefault()
      const location = t.getAttribute('data-gp-cta') || 'unknown'
      track('cta_click', { cta_location: location, cta_text: (t.textContent || '').trim().slice(0, 60) })
      setGate({ open: true, location })
    }
    el.addEventListener('click', onClick)

    // Webflow tabs (enterprise use cases)
    const tabs = [...el.querySelectorAll<HTMLElement>('.w-tabs')]
    const cleanups = tabs.map((w) => {
      const links = [...w.querySelectorAll<HTMLElement>('.w-tab-link')]
      const panes = [...w.querySelectorAll<HTMLElement>('.w-tab-pane')]
      const show = (i: number) => {
        links.forEach((l, j) => l.classList.toggle('w--current', i === j))
        panes.forEach((p, j) => {
          p.classList.toggle('w--tab-active', i === j)
          p.style.display = i === j ? '' : 'none'
          p.style.opacity = '1'
        })
      }
      const handlers = links.map((l, i) => {
        const h = (ev: Event) => { ev.preventDefault(); show(i) }
        l.addEventListener('click', h)
        return () => l.removeEventListener('click', h)
      })
      show(Math.max(0, links.findIndex((l) => l.classList.contains('w--current'))))
      return () => handlers.forEach((h) => h())
    })

    // Header shadow on scroll, as on glopros.ai
    const nav = el.querySelector('.navbar')
    const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      el.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
      cleanups.forEach((c) => c())
    }
  }, [slug])

  return (
    <>
      <div ref={root} className="gp-mirror-root" dangerouslySetInnerHTML={{ __html: html }} />
      <DemoGate
        open={gate.open}
        ctaLocation={gate.location}
        slug={slug}
        onClose={() => setGate((g) => ({ ...g, open: false }))}
      />
    </>
  )
}
