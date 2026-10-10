/**
 * Qualification for the recorded-demo gate. The answers travel to HubSpot and GTM as
 * `lead_fit`, so Roberto (SDR) can prioritise follow-up and ads can be optimised on fit later.
 */
export const COMPANY_SIZES = ['1–49', '50–249', '250–999', '1,000–4,999', '5,000+'] as const
export const HIRING_FOR = ['SAP / ERP', 'IT & tech', 'Finance', 'Engineering', 'Sales & marketing', 'Other'] as const
export const TIMELINES = ['Now', 'Within 3 months', '3–6 months', 'Just exploring'] as const

export type CompanySize = (typeof COMPANY_SIZES)[number]
export type Timeline = (typeof TIMELINES)[number]

export interface GateAnswers {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  companySize: CompanySize | ''
  hiringFor: string
  timeline: Timeline | ''
  consent: boolean
}

export type LeadFit = 'high' | 'medium' | 'low'

/**
 * Decide how warm this lead is.
 *
 * TODO(Pascal): this is GloPros' commercial call, so tune it with Phil. The default below follows
 * the ICP from discovery: scale-ups (50–500 FTE) and enterprises are the targets, and an active
 * hiring need beats company size. Things to weigh:
 *   - a 1–49 company with an SAP role "Now" may still be worth a call (niche roles, high fee)
 *   - "Just exploring" at 5,000+ is an ABM account, not an SDR call this week
 *   - keep it simple: Roberto must be able to explain why a lead is "high"
 */
export function leadFit(a: GateAnswers): LeadFit {
  const sizeOk = a.companySize !== '' && a.companySize !== '1–49'
  const soon = a.timeline === 'Now' || a.timeline === 'Within 3 months'
  if (sizeOk && soon) return 'high'
  if (sizeOk || soon) return 'medium'
  return 'low'
}

const FREE_MAIL = /@(gmail|googlemail|hotmail|outlook|live|msn|yahoo|ymail|icloud|me|mac|aol|proton(mail)?|pm|gmx|web|ziggo|kpnmail|planet|home|hetnet|xs4all|chello|telenet|skynet|orange|free|laposte|libero|mail|yandex)\.[a-z.]+$/i

export function validate(a: GateAnswers): Record<string, string> {
  const e: Record<string, string> = {}
  if (!a.firstName.trim()) e.firstName = 'Please enter your first name'
  if (!a.lastName.trim()) e.lastName = 'Please enter your last name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) e.email = 'Please enter a valid email address'
  else if (FREE_MAIL.test(a.email.trim())) e.email = 'Please use your work email'
  if (!a.company.trim()) e.company = 'Please enter your company'
  if (!a.jobTitle.trim()) e.jobTitle = 'Please enter your job title'
  if (!a.companySize) e.companySize = 'Please select your company size'
  if (!a.hiringFor) e.hiringFor = 'Please select what you are hiring for'
  if (!a.timeline) e.timeline = 'Please select your timeline'
  if (!a.consent) e.consent = 'Please accept the privacy policy'
  return e
}
