import {
  AirtableRecord,
  AirtableClientFields,
  AirtableCopyFields,
  AirtableServiceFields,
  AirtableProcessStepFields,
  AirtableTestimonialFields,
  AirtableCaseStudyFields,
  AirtableFAQFields,
} from './airtable'
import {
  LandingPageContent,
  ServiceCard,
  ProcessStep,
  Testimonial,
  CaseStudy,
  FAQItem,
  NextStepCard,
  ProblemCard,
} from '../types/content'

const DEFAULT_ICON = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
const DEFAULT_NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]
const DEFAULT_NEXT_STEPS: [NextStepCard, NextStepCard, NextStepCard] = [
  { title: 'Book a Call', description: 'Schedule a free 30-minute discovery call with our team.' },
  { title: 'Get a Proposal', description: 'Receive a tailored proposal within 48 hours.' },
  { title: 'Start Today', description: 'Kick off your project and see results fast.' },
]

function padTo<T>(arr: T[], length: number, make: (i: number) => T): T[] {
  const result = [...arr]
  while (result.length < length) result.push(make(result.length))
  return result.slice(0, length)
}

export function mapAirtableToContent(
  client: AirtableRecord<AirtableClientFields>,
  copy: AirtableRecord<AirtableCopyFields> | null,
  services: AirtableRecord<AirtableServiceFields>[],
  processSteps: AirtableRecord<AirtableProcessStepFields>[],
  testimonials: AirtableRecord<AirtableTestimonialFields>[],
  caseStudies: AirtableRecord<AirtableCaseStudyFields>[],
  faqs: AirtableRecord<AirtableFAQFields>[]
): LandingPageContent {
  const cf = client.fields
  const cp = copy?.fields ?? {}
  const slug = cf.FieldTypeSlug ?? client.id
  const companyName = cf['Company Name'] ?? 'Company'
  const ctaLabel = cp['CTA Text'] ?? 'Get Started'
  const year = new Date().getFullYear()

  const serviceCards = padTo<ServiceCard>(
    services.map(s => ({
      icon: DEFAULT_ICON,
      title: s.fields.Title ?? 'Service',
      description: s.fields.Description ?? '',
    })),
    3,
    i => ({ icon: DEFAULT_ICON, title: `Service ${i + 1}`, description: 'Coming soon.' })
  ) as [ServiceCard, ServiceCard, ServiceCard]

  const problemCards = padTo<ProblemCard>(
    services.slice(0, 3).map(s => ({
      icon: DEFAULT_ICON,
      title: s.fields.Title ?? 'Challenge',
      description: s.fields.Description ?? '',
    })),
    3,
    i => ({ icon: DEFAULT_ICON, title: `Challenge ${i + 1}`, description: 'To be defined.' })
  ) as [ProblemCard, ProblemCard, ProblemCard]

  const processStepsMapped = padTo<ProcessStep>(
    processSteps.map(s => ({
      title: s.fields['Step Title'] ?? `Step ${s.fields.OrderNumber ?? ''}`,
      description: s.fields['Step Description'] ?? '',
    })),
    4,
    i => ({ title: `Step ${i + 1}`, description: 'To be defined.' })
  ) as [ProcessStep, ProcessStep, ProcessStep, ProcessStep]

  const testimonialsMapped: Testimonial[] = testimonials.map(t => ({
    quote: t.fields.Quote ?? '',
    name: t.fields.Name ?? '',
    title: t.fields['Job Title'] ?? '',
    company: t.fields.Company,
  }))

  const caseStudiesMapped: CaseStudy[] = caseStudies.map(cs => ({
    title: cs.fields['Client Label'] ?? '',
    resultStat: cs.fields['Key Stat'] ?? '',
    description: cs.fields.Description ?? '',
  }))

  const faqsMapped = padTo<FAQItem>(
    faqs.map(f => ({
      question: f.fields.Question ?? '',
      answer: f.fields.Answer ?? '',
    })),
    6,
    i => ({ question: `Question ${i + 1}`, answer: 'Answer coming soon.' })
  ) as [FAQItem, FAQItem, FAQItem, FAQItem, FAQItem, FAQItem]

  return {
    slug,
    templateType: 'pitch',
    sections: [
      'hero', 'mediaBlock', 'problemSection', 'valueProposition',
      'partnerLogos', 'services', 'process', 'testimonials',
      'caseStudies', 'nextSteps', 'ctaSection', 'faq',
    ],
    meta: {
      title: `${companyName} — ${cp['CTA Text'] ?? cf['Campaign Name'] ?? ''}`,
      description: cp['Outcome Statement'] ?? cp['Problem Statement'] ?? '',
    },
    navbar: {
      logo: { text: companyName },
      links: DEFAULT_NAV_LINKS,
      cta: { label: ctaLabel, href: '#cta' },
    },
    hero: {
      headline: cp.Headline ?? '',
      subheadline: cp.Subheadline ?? '',
      cta: { label: ctaLabel, href: '#cta' },
      socialProof: '',
    },
    mediaBlock: { type: 'placeholder', aspectRatio: '16/9', alt: `${companyName} product screenshot` },
    problemSection: {
      eyebrow: 'The Problem',
      headline: cp['Problem Statement'] ?? '',
      cards: problemCards,
    },
    valueProposition: {
      eyebrow: 'The Solution',
      headline: cp['Outcome Statement'] ?? '',
      body: cp['Problem Statement'] ?? '',
    },
    partnerLogos: { logos: [] },
    services: {
      eyebrow: 'What We Do',
      headline: 'Our Services',
      cards: serviceCards,
    },
    process: {
      eyebrow: 'How It Works',
      headline: 'Our Process',
      steps: processStepsMapped,
    },
    testimonials: {
      eyebrow: 'What Our Customers Say',
      headline: `Teams love ${companyName}`,
      items: testimonialsMapped,
    },
    caseStudies: {
      eyebrow: 'Case Studies',
      headline: 'Real results from real customers',
      items: caseStudiesMapped,
    },
    nextSteps: {
      eyebrow: 'Get Started',
      headline: 'Three ways to begin',
      cards: DEFAULT_NEXT_STEPS,
    },
    ctaSection: {
      headline: 'Ready to get started?',
      subheadline: cp['Outcome Statement'] ?? '',
      cta: { label: ctaLabel, href: '#cta' },
    },
    faq: {
      eyebrow: 'FAQ',
      headline: 'Everything you need to know',
      items: faqsMapped,
    },
    footer: {
      logo: { text: companyName },
      links: DEFAULT_NAV_LINKS,
      socialLinks: [],
      copyright: `© ${year} ${companyName}. All rights reserved.`,
    },
  }
}
