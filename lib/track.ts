/**
 * dataLayer helper for the demo-gate LPs. Event names and parameters are the contract in
 * docs/superpowers/specs/2026-10-10-glopros-demo-gate-mirror-lps-design.md — GTM triggers match
 * them exactly, so rename only together with the GTM script.
 */
export type GateEvent =
  | 'lp_view'
  | 'cta_click'
  | 'demo_gate_open'
  | 'form_start'
  | 'form_error'
  | 'demo_form_submit'
  | 'video_unlocked'
  | 'video_play'
  | 'video_progress'
  | 'video_complete'
  | 'book_demo_click'
  | 'demo_gate_close'

export const LP_VARIANT = 'demo-gate-v1'

type DL = Record<string, unknown>[]

let pageSlug = ''
export function setPageSlug(slug: string) {
  pageSlug = slug
}

export function track(event: GateEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: DL }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, page_slug: pageSlug, lp_variant: LP_VARIANT, ...params })
  if (process.env.NODE_ENV !== 'production') console.info('[track]', event, params)
}

/** Attribution params captured once per visit and sent with the form. */
export function attribution(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const q = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'li_fat_id']
  const out: Record<string, string> = {}
  for (const k of keys) {
    const v = q.get(k)
    if (v) out[k] = v
  }
  if (document.referrer) out.referrer = document.referrer
  return out
}
