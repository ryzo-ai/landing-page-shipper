import { BP_LIVE } from './track'

/** Everything the form collects. Lives in React state only: never stored, never sent in demo mode. */
export interface Application {
  firstName: string
  lastName: string
  email: string
  phone: string
  experience: string
  currentRole: string
  sector: string
  linkedin: string
  /** Only the chosen file's name, for display. The file itself is never read or uploaded. */
  cvFileName: string
  motivation: string
  availability: string
  consent: boolean
}

export const EMPTY_APPLICATION: Application = {
  firstName: '', lastName: '', email: '', phone: '',
  experience: '', currentRole: '', sector: '',
  linkedin: '', cvFileName: '', motivation: '',
  availability: '', consent: false,
}

export type Errors = Partial<Record<keyof Application, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Dutch mobile/landline or international: digits, spaces, dashes, optional leading +
const PHONE = /^\+?[0-9][0-9\s-]{8,16}$/

export function isLinkedinUrl(v: string): boolean {
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    return /(^|\.)linkedin\.com$/i.test(u.hostname) && u.pathname.length > 1
  } catch {
    return false
  }
}

/** Per-step validation with Dutch messages. Step indexes are 0-based. */
export function validateStep(step: number, a: Application, motivationMax: number): Errors {
  const e: Errors = {}
  if (step === 0) {
    if (!a.firstName.trim()) e.firstName = 'Vul je voornaam in.'
    if (!a.lastName.trim()) e.lastName = 'Vul je achternaam in.'
    if (!a.email.trim()) e.email = 'Vul je e-mailadres in.'
    else if (!EMAIL.test(a.email.trim())) e.email = 'Dit e-mailadres klopt niet. Controleer het nog even.'
    const digits = a.phone.replace(/\D/g, '')
    if (!a.phone.trim()) e.phone = 'Vul je telefoonnummer in.'
    else if (!PHONE.test(a.phone.trim()) || digits.length < 9) e.phone = 'Dit telefoonnummer klopt niet. Gebruik bijvoorbeeld 06 12345678.'
  }
  if (step === 1) {
    if (!a.experience) e.experience = 'Kies hoeveel jaar commerciële B2B-ervaring je hebt.'
    if (!a.currentRole.trim()) e.currentRole = 'Vul je huidige functie in.'
    if (!a.sector) e.sector = 'Kies de sector waarin je nu werkt.'
  }
  if (step === 2) {
    const hasLinkedin = a.linkedin.trim().length > 0
    if (!hasLinkedin && !a.cvFileName) e.linkedin = 'Deel je LinkedIn-profiel of kies je cv. Eén van de twee is genoeg.'
    else if (hasLinkedin && !isLinkedinUrl(a.linkedin.trim())) e.linkedin = 'Dit lijkt geen LinkedIn-profiel. Gebruik bijvoorbeeld linkedin.com/in/jouwnaam.'
    if (a.motivation.length > motivationMax) e.motivation = `Je motivatie is te lang (maximaal ${motivationMax} tekens).`
  }
  if (step === 3) {
    if (!a.availability) e.availability = 'Kies wanneer je kunt beginnen.'
    if (!a.consent) e.consent = 'Geef toestemming om je sollicitatie te verwerken.'
  }
  return e
}

/**
 * Submission. Demo mode sends and stores nothing: the form only navigates to the thank-you page.
 * Live wiring (ATS / Carerix, e-mail) is deliberately not implemented yet; setting
 * NEXT_PUBLIC_BP_LIVE=true without that work still sends nothing.
 */
export async function submitApplication(_a: Application): Promise<{ status: 'demo' | 'not_implemented' }> {
  void _a
  if (!BP_LIVE) return { status: 'demo' }
  console.warn('[bp] NEXT_PUBLIC_BP_LIVE is true, but live submission is not implemented; nothing was sent.')
  return { status: 'not_implemented' }
}
