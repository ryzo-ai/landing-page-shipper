'use client'

import { useEffect, useRef, useState } from 'react'
import { track, attribution } from '../../lib/track'
import { COMPANY_SIZES, HIRING_FOR, TIMELINES, GateAnswers, leadFit, validate } from '../../lib/qualify'
import { submitToHubspot } from '../../lib/hubspot'

const VIDEO_SRC = process.env.NEXT_PUBLIC_DEMO_VIDEO_SRC || ''
const VIDEO_POSTER = process.env.NEXT_PUBLIC_DEMO_VIDEO_POSTER || ''
const VIDEO_TITLE = 'GloPros recorded product demo'
const UNLOCK_KEY = 'gp_demo_unlocked'

const EMPTY: GateAnswers = {
  firstName: '', lastName: '', email: '', company: '', jobTitle: '',
  companySize: '', hiringFor: '', timeline: '', consent: false,
}

interface Props {
  open: boolean
  ctaLocation: string
  slug: string
  onClose: () => void
}

export default function DemoGate({ open, ctaLocation, slug, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'video'>('form')
  const [a, setA] = useState<GateAnswers>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const started = useRef(false)
  const dialog = useRef<HTMLDivElement>(null)

  // Returning visitors who already qualified go straight to the video
  useEffect(() => {
    if (!open) return
    let unlocked = false
    try { unlocked = sessionStorage.getItem(UNLOCK_KEY) === '1' } catch {}
    setStep(unlocked ? 'video' : 'form')
    track('demo_gate_open', { cta_location: ctaLocation })
    if (unlocked) track('video_unlocked')
    document.documentElement.style.overflow = 'hidden'
    setTimeout(() => dialog.current?.querySelector<HTMLElement>('input, button')?.focus(), 50)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function close() {
    track('demo_gate_close', { gate_step: step })
    onClose()
  }

  function set<K extends keyof GateAnswers>(k: K, v: GateAnswers[K]) {
    if (!started.current) {
      started.current = true
      track('form_start')
    }
    setA((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n })
  }

  async function submit() {
    const errs = validate(a)
    setErrors(errs)
    if (Object.keys(errs).length) {
      track('form_error', { error_fields: Object.keys(errs).join(',') })
      return
    }
    setBusy(true)
    const fit = leadFit(a)
    const status = await submitToHubspot(a, fit, { demo_cta_location: ctaLocation, demo_page: slug, ...attribution() })
    track('demo_form_submit', {
      lead_fit: fit,
      company_size: a.companySize,
      hiring_for: a.hiringFor,
      hiring_timeline: a.timeline,
      hubspot_status: status,
    })
    try { sessionStorage.setItem(UNLOCK_KEY, '1') } catch {}
    setBusy(false)
    setStep('video')
    track('video_unlocked')
  }

  if (!open) return null

  const bookHref =
    'https://www.glopros.ai/book-a-demo?utm_source=ryzo-lp&utm_medium=landing-page' +
    `&utm_campaign=${encodeURIComponent(slug)}&utm_content=after-recorded-demo`

  return (
    <div className="gp-gate" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="gp-gate__dialog" role="dialog" aria-modal="true" aria-labelledby="gp-gate-title" ref={dialog}>
        <button type="button" className="gp-gate__close" onClick={close} aria-label="Close">×</button>

        {step === 'form' ? (
          // Not a <form>: glopros.ai's GTM pushes hs_form_submit for every native submit event, which
          // would count failed attempts. Enter still submits via onKeyDown.
          <div
            role="form"
            aria-labelledby="gp-gate-title"
            className="gp-gate__form"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && (e.target as HTMLInputElement).type !== 'checkbox') {
                e.preventDefault()
                submit()
              }
            }}
          >
            <p className="gp-gate__eyebrow">Recorded product demo</p>
            <h2 id="gp-gate-title" className="gp-gate__title">Watch the GloPros demo</h2>
            <p className="gp-gate__lead">
              See how the AI-platform and GloPros Recruiters deliver a shortlist. Tell us a little about your hiring
              and the demo starts right away.
            </p>

            <div className="gp-gate__grid">
              <Field id="firstName" label="First name" err={errors.firstName}>
                <input id="firstName" autoComplete="given-name" value={a.firstName} onChange={(e) => set('firstName', e.target.value)} />
              </Field>
              <Field id="lastName" label="Last name" err={errors.lastName}>
                <input id="lastName" autoComplete="family-name" value={a.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </Field>
              <Field id="email" label="Work email" err={errors.email} wide>
                <input id="email" type="email" autoComplete="email" value={a.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field id="company" label="Company" err={errors.company}>
                <input id="company" autoComplete="organization" value={a.company} onChange={(e) => set('company', e.target.value)} />
              </Field>
              <Field id="jobTitle" label="Job title" err={errors.jobTitle}>
                <input id="jobTitle" autoComplete="organization-title" value={a.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} />
              </Field>
              <Field id="companySize" label="Company size" err={errors.companySize}>
                <select id="companySize" value={a.companySize} onChange={(e) => set('companySize', e.target.value as GateAnswers['companySize'])}>
                  <option value="">Select…</option>
                  {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </Field>
              <Field id="hiringFor" label="Hiring for" err={errors.hiringFor}>
                <select id="hiringFor" value={a.hiringFor} onChange={(e) => set('hiringFor', e.target.value)}>
                  <option value="">Select…</option>
                  {HIRING_FOR.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field id="timeline" label="When do you need to hire?" err={errors.timeline} wide>
                <div className="gp-gate__chips" role="radiogroup" aria-labelledby="timeline">
                  {TIMELINES.map((t) => (
                    <button type="button" key={t} role="radio" aria-checked={a.timeline === t}
                      className={`gp-gate__chip ${a.timeline === t ? 'is-on' : ''}`} onClick={() => set('timeline', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <label className={`gp-gate__consent ${errors.consent ? 'has-err' : ''}`}>
              <input type="checkbox" checked={a.consent} onChange={(e) => set('consent', e.target.checked)} />
              <span>
                I agree that GloPros processes my data to show the demo and contact me about it, as described in the{' '}
                <a href="https://www.glopros.ai/privacy-policy" target="_blank" rel="noopener">privacy policy</a>.
              </span>
            </label>
            {errors.consent && <p className="gp-gate__err">{errors.consent}</p>}

            <button type="button" className="gp-gate__submit gp-gate__submit--form" disabled={busy} onClick={submit}>
              {busy ? 'One moment…' : 'Watch the demo now'}
            </button>
            <p className="gp-gate__micro">Free · on demand · no sales call needed</p>
          </div>
        ) : (
          <div>
            <p className="gp-gate__eyebrow">Recorded product demo</p>
            <h2 id="gp-gate-title" className="gp-gate__title">Your GloPros demo</h2>
            <DemoVideo />
            <div className="gp-gate__after">
              <p>Want to see it with your own vacancies?</p>
              <a className="gp-gate__secondary" href={bookHref} onClick={() => track('book_demo_click')}>
                Book a live demo
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ id, label, err, wide, children }: { id: string; label: string; err?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={`gp-gate__field ${wide ? 'is-wide' : ''} ${err ? 'has-err' : ''}`}>
      <label htmlFor={id}>{label}<span aria-hidden> *</span></label>
      {children}
      {err && <p className="gp-gate__err">{err}</p>}
    </div>
  )
}

function DemoVideo() {
  const fired = useRef<Set<number>>(new Set())
  const played = useRef(false)

  if (!VIDEO_SRC) {
    return (
      <div className="gp-gate__video gp-gate__video--placeholder" data-gp-video="placeholder">
        <div>
          <span className="gp-gate__play" aria-hidden>▶</span>
          <p className="gp-gate__ph-title">The recorded demo is being produced</p>
          <p className="gp-gate__ph-sub">It will play here. Placeholder: set NEXT_PUBLIC_DEMO_VIDEO_SRC.</p>
        </div>
      </div>
    )
  }

  return (
    <video
      className="gp-gate__video"
      src={VIDEO_SRC}
      poster={VIDEO_POSTER || undefined}
      controls
      playsInline
      onPlay={() => {
        if (played.current) return
        played.current = true
        track('video_play', { video_title: VIDEO_TITLE })
      }}
      onTimeUpdate={(e) => {
        const v = e.currentTarget
        if (!v.duration) return
        const pct = (v.currentTime / v.duration) * 100
        for (const m of [25, 50, 75]) {
          if (pct >= m && !fired.current.has(m)) {
            fired.current.add(m)
            track('video_progress', { video_percent: m })
          }
        }
      }}
      onEnded={() => track('video_complete')}
    />
  )
}
