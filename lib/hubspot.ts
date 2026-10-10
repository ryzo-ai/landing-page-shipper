import type { GateAnswers, LeadFit } from './qualify'

const PORTAL = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '48282941'
// Placeholder until GloPros creates the gate form in HubSpot and shares its GUID.
const FORM_GUID = process.env.NEXT_PUBLIC_HUBSPOT_GATE_FORM_GUID || ''

export type HubspotStatus = 'sent' | 'failed' | 'not_configured'

function cookie(name: string) {
  return document.cookie.split('; ').find((c) => c.startsWith(name + '='))?.split('=')[1]
}

/**
 * Submit to the HubSpot Forms API v3 (unauthenticated endpoint; the form GUID is public by design).
 * Field names must exist as contact properties on the HubSpot form. Custom ones
 * (company_size, hiring_for, hiring_timeline, lead_fit, demo_cta_location) need to be created
 * by GloPros alongside the form.
 */
export async function submitToHubspot(
  a: GateAnswers,
  fit: LeadFit,
  extra: Record<string, string>,
): Promise<HubspotStatus> {
  if (!FORM_GUID) return 'not_configured'
  const fields: Record<string, string> = {
    firstname: a.firstName.trim(),
    lastname: a.lastName.trim(),
    email: a.email.trim(),
    company: a.company.trim(),
    jobtitle: a.jobTitle.trim(),
    company_size: a.companySize,
    hiring_for: a.hiringFor,
    hiring_timeline: a.timeline,
    lead_fit: fit,
    ...extra,
  }
  const body = {
    fields: Object.entries(fields).filter(([, v]) => v).map(([name, value]) => ({ name, value })),
    context: { hutk: cookie('hubspotutk'), pageUri: window.location.href, pageName: document.title },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: 'I agree to GloPros processing my data to show the demo and contact me about it.',
      },
    },
  }
  try {
    const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL}/${FORM_GUID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
