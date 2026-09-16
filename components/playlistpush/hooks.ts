'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Mirrors the site's IntersectionObserver reveal: once an element is 15% visible
 * it gets `in-view` and is never observed again. Runs on the wrapper so one
 * observer covers every `.reveal`, `.promo-visual` and `.team-avatars`.
 */
export function useRevealObserver<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>('.reveal, .promo-visual, .team-avatars')
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((t) => t.classList.add('in-view'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
  return ref
}

/** `true` once the page has scrolled past 20px — drives the header's `scrolled` state. */
export function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/**
 * Count-up identical to the site's: 1600ms, cubic ease-out, decimals preserved,
 * starts when the element enters the viewport.
 */
export function useCountUp(target: number, prefix = '', suffix = '', duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null)
  const decimals = (String(target).split('.')[1] || '').length
  const [text, setText] = useState(prefix + target.toFixed(decimals) + suffix)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return
    let raf = 0
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      let start: number | null = null
      const tick = (now: number) => {
        if (start === null) start = now
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setText(prefix + (target * eased).toFixed(decimals) + suffix)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      setText(prefix + (0).toFixed(decimals) + suffix)
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, prefix, suffix, duration, decimals])
  return { ref, text }
}
