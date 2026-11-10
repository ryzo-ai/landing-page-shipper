'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BpContent } from '../../types/boostpeople'
import {
  Application,
  EMPTY_APPLICATION,
  Errors,
  submitApplication,
  validateStep,
} from '../../lib/boostpeople/application'
import { pushEvent } from '../../lib/boostpeople/track'
import { THANK_YOU_PATH } from '../../lib/boostpeople/content'
import BoostIcon from './BoostIcon'

interface Props {
  open: boolean
  ctaLocation: string
  content: BpContent
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Four-step application form in Boost & People's style. Demo mode: validates and navigates to the
 * thank-you page, but sends and stores nothing (values live in React state only; the CV file is
 * never read, only its name is shown). State survives closing and reopening the dialog.
 */
export default function ApplyForm({ open, ctaLocation, content, onClose }: Props) {
  const { form, privacyUrl } = content
  const router = useRouter()
  const uid = useId()
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Application>(EMPTY_APPLICATION)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const started = useRef(false)
  const dialog = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const total = form.steps.length
  const current = form.steps[step]

  const close = useCallback(() => {
    onClose()
    opener.current?.focus?.()
  }, [onClose])

  // Open: event, scroll lock, focus the step heading, Escape + focus trap
  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement as HTMLElement | null
    pushEvent('form_open', { cta_location: ctaLocation })
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const t = window.setTimeout(() => heading.current?.focus(), 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !dialog.current) return
      const items = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      html.style.overflow = prev
    }
    // ctaLocation is read once per opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close])

  // Focus moves to the step heading on every step change
  useEffect(() => {
    if (open) heading.current?.focus()
  }, [step, open])

  function set<K extends keyof Application>(k: K, v: Application[K]) {
    if (!started.current) {
      started.current = true
      pushEvent('form_start')
    }
    setA((p) => ({ ...p, [k]: v }))
    if (errors[k] || (k === 'cvFileName' && errors.linkedin)) {
      setErrors((p) => {
        const n = { ...p }
        delete n[k]
        if (k === 'cvFileName') delete n.linkedin
        return n
      })
    }
  }

  function check(): boolean {
    const errs = validateStep(step, a, form.motivationMax)
    setErrors(errs)
    const fields = Object.keys(errs)
    if (fields.length) {
      pushEvent('form_error', { step: step + 1, fields: fields.join(',') })
      window.setTimeout(() => {
        dialog.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      }, 0)
      return false
    }
    pushEvent('form_step_complete', { step: step + 1, step_name: current.id })
    return true
  }

  async function next(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !check()) return
    if (step < total - 1) {
      setStep(step + 1)
      return
    }
    setBusy(true)
    await submitApplication(a)
    pushEvent('application_submit', { experience: a.experience, sector: a.sector, availability: a.availability })
    document.documentElement.style.overflow = ''
    router.push(THANK_YOU_PATH)
  }

  function back() {
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  if (!open) return null

  const fid = (k: string) => `${uid}-${k}`
  const errProps = (k: keyof Application) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': fid(`${k}-err`) } : {}
  const err = (k: keyof Application) =>
    errors[k] ? (
      <p className="bp-form__err" id={fid(`${k}-err`)}>
        {errors[k]}
      </p>
    ) : null

  const pct = Math.round(((step + 1) / total) * 100)

  return (
    <div className="bp-form" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="bp-form__dialog" role="dialog" aria-modal="true" aria-labelledby={fid('title')} ref={dialog}>
        <div className="bp-form__head">
          <p className="bp-form__title" id={fid('title')}>
            {form.title}
          </p>
          <button type="button" className="bp-form__close" onClick={close} aria-label="Sluiten">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="bp-form__progress">
          <p className="bp-form__stepcount" aria-live="polite">
            Stap {step + 1} van {total}
          </p>
          <div
            className="bp-form__bar"
            role="progressbar"
            aria-label="Voortgang sollicitatie"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={step + 1}
            aria-valuetext={`Stap ${step + 1} van ${total}: ${current.title}`}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>

        <form className="bp-form__body" noValidate onSubmit={next}>
          <h2 className="bp-form__h" ref={heading} tabIndex={-1}>
            {current.title}
          </h2>
          <p className="bp-form__intro">{current.intro}</p>

          {step === 0 && (
            <div className="bp-form__grid">
              <Field id={fid('firstName')} label="Voornaam" error={err('firstName')}>
                <input id={fid('firstName')} autoComplete="given-name" value={a.firstName} onChange={(e) => set('firstName', e.target.value)} {...errProps('firstName')} />
              </Field>
              <Field id={fid('lastName')} label="Achternaam" error={err('lastName')}>
                <input id={fid('lastName')} autoComplete="family-name" value={a.lastName} onChange={(e) => set('lastName', e.target.value)} {...errProps('lastName')} />
              </Field>
              <Field id={fid('email')} label="E-mailadres" error={err('email')} wide>
                <input id={fid('email')} type="email" inputMode="email" autoComplete="email" value={a.email} onChange={(e) => set('email', e.target.value)} {...errProps('email')} />
              </Field>
              <Field id={fid('phone')} label="Telefoonnummer" error={err('phone')} wide>
                <input id={fid('phone')} type="tel" inputMode="tel" autoComplete="tel" value={a.phone} onChange={(e) => set('phone', e.target.value)} {...errProps('phone')} />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="bp-form__grid">
              <Choice
                name={fid('experience')}
                legend="Jaren commerciële B2B-ervaring"
                options={form.experienceOptions}
                value={a.experience}
                onChange={(v) => set('experience', v)}
                error={errors.experience}
                errId={fid('experience-err')}
              />
              <Field id={fid('currentRole')} label="Huidige functie" error={err('currentRole')} wide>
                <input id={fid('currentRole')} autoComplete="organization-title" value={a.currentRole} onChange={(e) => set('currentRole', e.target.value)} {...errProps('currentRole')} />
              </Field>
              <Choice
                name={fid('sector')}
                legend="Sector"
                options={form.sectorOptions}
                value={a.sector}
                onChange={(v) => set('sector', v)}
                error={errors.sector}
                errId={fid('sector-err')}
              />
            </div>
          )}

          {step === 2 && (
            <div className="bp-form__grid">
              <Field id={fid('linkedin')} label="LinkedIn-profiel" optional="of cv hieronder" error={err('linkedin')} wide>
                <input
                  id={fid('linkedin')}
                  type="url"
                  inputMode="url"
                  placeholder="linkedin.com/in/jouwnaam"
                  value={a.linkedin}
                  onChange={(e) => set('linkedin', e.target.value)}
                  {...errProps('linkedin')}
                />
              </Field>
              <div className="bp-form__field is-wide">
                <span className="bp-form__label" id={fid('cv-label')}>
                  Cv <span className="bp-form__opt">(of LinkedIn hierboven)</span>
                </span>
                <div className="bp-form__file">
                  <label className="bp-form__filebtn" htmlFor={fid('cv')}>
                    {a.cvFileName ? 'Ander bestand kiezen' : 'Kies je cv'}
                  </label>
                  {/* Demo: the file is never read or uploaded. Only its name is kept, then the input is cleared. */}
                  <input
                    id={fid('cv')}
                    className="bp-form__fileinput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    aria-labelledby={fid('cv-label')}
                    aria-describedby={fid('cv-note')}
                    onChange={(e) => {
                      const name = e.target.files?.[0]?.name || ''
                      e.target.value = ''
                      if (name) set('cvFileName', name)
                    }}
                  />
                  {a.cvFileName ? (
                    <span className="bp-form__filename">
                      {a.cvFileName}
                      <button type="button" className="bp-form__fileclear" onClick={() => set('cvFileName', '')} aria-label={`Verwijder ${a.cvFileName}`}>
                        Verwijderen
                      </button>
                    </span>
                  ) : (
                    <span className="bp-form__filename is-empty">Geen bestand gekozen</span>
                  )}
                </div>
                <p className="bp-form__note" id={fid('cv-note')}>
                  PDF of Word. In deze demo wordt je cv niet geüpload of opgeslagen.
                </p>
              </div>
              <Field id={fid('motivation')} label="Motivatie" optional="optioneel" error={err('motivation')} wide>
                <textarea
                  id={fid('motivation')}
                  rows={4}
                  maxLength={form.motivationMax}
                  value={a.motivation}
                  onChange={(e) => set('motivation', e.target.value)}
                  aria-describedby={fid('motivation-count')}
                  {...(errors.motivation ? { 'aria-invalid': true } : {})}
                />
                <p className="bp-form__count" id={fid('motivation-count')} aria-live="polite">
                  {a.motivation.length} / {form.motivationMax} tekens
                </p>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="bp-form__grid">
              <Field id={fid('availability')} label="Beschikbaarheid / opzegtermijn" error={err('availability')} wide>
                <select id={fid('availability')} value={a.availability} onChange={(e) => set('availability', e.target.value)} {...errProps('availability')}>
                  <option value="">Kies je beschikbaarheid…</option>
                  {form.availabilityOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <div className={`bp-form__field is-wide ${errors.consent ? 'has-err' : ''}`}>
                <label className="bp-form__consent" htmlFor={fid('consent')}>
                  <input id={fid('consent')} type="checkbox" checked={a.consent} onChange={(e) => set('consent', e.target.checked)} {...errProps('consent')} />
                  <span>
                    Ik geef Boost &amp; People toestemming om mijn gegevens te gebruiken voor deze sollicitatie, zoals beschreven in het{' '}
                    <a href={privacyUrl} target="_blank" rel="noopener">
                      privacybeleid
                    </a>
                    .
                  </span>
                </label>
                {err('consent')}
              </div>
              <p className="bp-form__note">Demo: er wordt niets verstuurd of opgeslagen.</p>
            </div>
          )}

          <div className="bp-form__actions">
            {step > 0 ? (
              <button type="button" className="bp-form__back" onClick={back}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {form.backLabel}
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="bp-form__next" disabled={busy}>
              {step === total - 1 ? form.submitLabel : form.nextLabel}
              <BoostIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  optional,
  error,
  wide,
  children,
}: {
  id: string
  label: string
  optional?: string
  error: React.ReactNode
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`bp-form__field ${wide ? 'is-wide' : ''} ${error ? 'has-err' : ''}`}>
      <label className="bp-form__label" htmlFor={id}>
        {label} {optional && <span className="bp-form__opt">({optional})</span>}
      </label>
      {children}
      {error}
    </div>
  )
}

function Choice({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  errId,
}: {
  name: string
  legend: string
  options: string[]
  value: string
  onChange: (v: string) => void
  error?: string
  errId: string
}) {
  return (
    <fieldset
      className={`bp-form__field is-wide bp-form__choice ${error ? 'has-err' : ''}`}
      aria-describedby={error ? errId : undefined}
    >
      <legend className="bp-form__label">{legend}</legend>
      <div className="bp-form__chips">
        {options.map((o, i) => (
          <label key={o} className={`bp-form__chip ${value === o ? 'is-on' : ''}`}>
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              {...(error && i === 0 ? { 'aria-invalid': true } : {})}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="bp-form__err" id={errId}>
          {error}
        </p>
      )}
    </fieldset>
  )
}
