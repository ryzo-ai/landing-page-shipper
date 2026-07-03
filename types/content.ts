export interface NavLink { label: string; href: string }
export interface NavbarContent {
  logo: { text: string; imageSrc?: string; imageAlt?: string }
  links?: NavLink[]
  cta: { label: string; href: string }
}
export interface HeroContent {
  headline: string
  subheadline: string
  cta: { label: string; href: string }
  socialProof?: string
  backgroundImage?: {
    src: string
    alt: string
    overlayOpacity?: number
  }
  backgroundVideo?: {
    src: string
    poster?: string
    overlayOpacity?: number
  }
}
export interface MediaBlockContent {
  type: 'image' | 'video' | 'placeholder'
  src?: string
  alt?: string
  posterSrc?: string
  aspectRatio?: '16/9' | '4/3' | '1/1'
}
export interface ProblemCard { icon: string; title: string; description: string }
export interface ProblemSectionContent {
  eyebrow?: string
  headline: string
  cards: [ProblemCard, ProblemCard, ProblemCard]
}
export interface ValuePropositionContent {
  eyebrow?: string
  headline: string
  body: string
  graphic?: { src: string; alt: string }
}
export interface PartnerLogo { src: string; alt: string; href?: string }
export interface PartnerLogosContent { eyebrow?: string; logos: PartnerLogo[] }
export interface ServiceCard {
  icon: string
  title: string
  description: string
  link?: { label: string; href: string }
}
export interface ServicesContent {
  eyebrow?: string
  headline: string
  cards: [ServiceCard, ServiceCard] | [ServiceCard, ServiceCard, ServiceCard]
}
export interface ProcessStep { title: string; description: string }
export interface ProcessContent {
  eyebrow?: string
  headline: string
  steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep]
}
export interface Testimonial {
  quote: string
  name: string
  title: string
  company?: string
  avatarSrc?: string
  avatarAlt?: string
}
export interface TestimonialsContent {
  eyebrow?: string
  headline: string
  items: Testimonial[]
}
export interface CaseStudy {
  imageSrc?: string
  imageAlt?: string
  title: string
  resultStat: string
  description: string
  link?: { label: string; href: string }
}
export interface CaseStudiesContent {
  eyebrow?: string
  headline: string
  items: CaseStudy[]
}
export interface NextStepCard { title: string; description: string }
export interface NextStepsContent {
  eyebrow?: string
  headline: string
  cards: [NextStepCard, NextStepCard, NextStepCard]
}
export interface CTASectionContent {
  headline: string
  subheadline: string
  cta: { label: string; href: string }
}
export interface FAQItem { question: string; answer: string }
export interface FAQContent {
  eyebrow?: string
  headline: string
  items: FAQItem[]
}
export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'youtube' | 'instagram'
  href: string
}
export interface FooterContent {
  logo: { text: string; imageSrc?: string; imageAlt?: string }
  links?: NavLink[]
  socialLinks?: SocialLink[]
  copyright: string
}
export interface PageMeta { title: string; description: string; ogImage?: string }

export type SectionKey =
  | 'hero'
  | 'mediaBlock'
  | 'problemSection'
  | 'valueProposition'
  | 'partnerLogos'
  | 'services'
  | 'process'
  | 'testimonials'
  | 'caseStudies'
  | 'nextSteps'
  | 'ctaSection'
  | 'faq'

export interface LandingPageContent {
  slug: string
  templateType: 'sprint' | 'pitch'
  /** Ordered list of sections to render. Navbar and Footer are always rendered. */
  sections: SectionKey[]
  meta: PageMeta
  navbar: NavbarContent
  footer: FooterContent
  hero?: HeroContent
  mediaBlock?: MediaBlockContent
  problemSection?: ProblemSectionContent
  valueProposition?: ValuePropositionContent
  partnerLogos?: PartnerLogosContent
  services?: ServicesContent
  process?: ProcessContent
  testimonials?: TestimonialsContent
  caseStudies?: CaseStudiesContent
  nextSteps?: NextStepsContent
  ctaSection?: CTASectionContent
  faq?: FAQContent
}
