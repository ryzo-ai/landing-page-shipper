/**
 * dataLayer helper for the Boost & People vacancy demo.
 *
 * Demo mode (default, NEXT_PUBLIC_BP_LIVE unset or not "true"): events are only logged with
 * console.debug. Nothing is pushed, no tag manager is loaded, nothing leaves the browser.
 * Live mode will push the same contract to window.dataLayer once a container is wired up.
 *
 * Contract (GTM triggers must match these names exactly). Never put personal data in params.
 *   lp_view · cta_click {cta_location} · form_open {cta_location} · form_start ·
 *   form_step_complete {step} · form_error {step, fields} · application_submit · thank_you_view
 */
export type BpEvent =
  | 'lp_view'
  | 'cta_click'
  | 'form_open'
  | 'form_start'
  | 'form_step_complete'
  | 'form_error'
  | 'application_submit'
  | 'thank_you_view'

export const BP_LIVE = process.env.NEXT_PUBLIC_BP_LIVE === 'true'
export const LP_VARIANT = 'bp-apply-form-v1'

type Params = Record<string, string | number | undefined>

export function pushEvent(event: BpEvent, params: Params = {}) {
  if (typeof window === 'undefined') return
  const payload = { event, lp_variant: LP_VARIANT, page_path: window.location.pathname, ...params }
  if (!BP_LIVE) {
    console.debug('[bp demo] event (not sent)', payload)
    return
  }
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(payload)
}
