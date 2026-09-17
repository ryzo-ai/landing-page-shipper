export interface NavLink { label: string; href: string }
export interface LogoContent {
  text: string
  imageSrc?: string
  imageAlt?: string
  showMark?: boolean
  /** Where the logo links to. Defaults to '/' when omitted — never hardcode a brand URL in components. */
  href?: string
}
export interface NavbarContent {
  logo: LogoContent
  links?: NavLink[]
  cta: { label: string; href: string }
}
export interface HeroContent {
  headline: string
  subheadline: string
  cta: { label: string; href: string }
  socialProof?: string
  /** 'centered' renders the glopros.ai homepage hero: centred copy on the brand gradient with rounded bottom corners. */
  layout?: 'default' | 'centered'
  /** Short reassurance items shown under the CTA, each with a tick (e.g. "20-minute demo"). */
  microcopy?: string[]
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
export interface PartnerLogosContent {
  eyebrow?: string
  logos: PartnerLogo[]
  /** 'marquee' = full-colour scrolling row like glopros.ai; default = static greyscale row. */
  variant?: 'default' | 'marquee'
}
export interface ServiceCard {
  /** SVG path data for the built-in icon style. Ignored when iconSrc is set. */
  icon: string
  /** Image icon (e.g. a vendored brand SVG). */
  iconSrc?: string
  title: string
  description: string
  link?: { label: string; href: string }
}
export interface ServicesContent {
  eyebrow?: string
  headline: string
  body?: string
  cards: [ServiceCard, ServiceCard] | [ServiceCard, ServiceCard, ServiceCard]
  /** 'band' = glopros.ai "we do the work for you" section: gradient band, glass cards.
   *  'grid' = white section with bordered cards in the glopros.ai type scale. */
  variant?: 'default' | 'band' | 'grid'
  cta?: { label: string; href: string; style?: 'primary' | 'accent' | 'secondary' }
}
export interface ProcessStep { title: string; description: string; image?: { src: string; alt: string } }
export interface ProcessContent {
  eyebrow?: string
  headline: string
  body?: string
  steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep]
  /** 'badges' = glopros.ai "Step 01" badges on a light background. */
  variant?: 'default' | 'badges'
}
export interface StatItem { value: string; label: string; description: string }
export interface StatsContent {
  headline: string
  items: StatItem[]
}
export interface ComparisonRow { them: string; us: string }
export interface ComparisonContent {
  headline: string
  body?: string
  themLabel: string
  usLabel: string
  rows: ComparisonRow[]
  usImage?: { src: string; alt: string }
  cta?: { label: string; href: string }
}
export interface HiringModel {
  title: string
  description: string
  included: string
  forCompanies: string
  image?: { src: string; alt: string }
}
export interface HiringModelsContent {
  headline: string
  body?: string
  models: HiringModel[]
  note?: string
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
  /** 'card' = glopros.ai "Ready for your next hire?" feature card with checklist and image. */
  variant?: 'default' | 'card'
  checklist?: string[]
  microcopy?: string
  image?: { src: string; alt: string }
  badge?: { src: string; alt: string; label?: string }
}
export interface FAQItem { question: string; answer: string }
export interface FAQContent {
  eyebrow?: string
  headline: string
  items: FAQItem[]
  /** 'glopros' = white cards in the glopros.ai type scale. */
  variant?: 'default' | 'glopros'
}
export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'youtube' | 'instagram'
  href: string
}
export interface FooterContent {
  /** 'glass' = glopros.ai footer: pale band with rounded top and a frosted card. */
  variant?: 'default' | 'glass'
  logo: LogoContent
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
  | 'stats'
  | 'comparison'
  | 'hiringModels'
  | 'servicesSecondary'

export interface LandingPageContent {
  slug: string
  templateType: 'sprint' | 'pitch'
  /** BCP-47 language tag for this page; overrides the root <html lang>. */
  lang?: string
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
  stats?: StatsContent
  comparison?: ComparisonContent
  hiringModels?: HiringModelsContent
  /** A second services block, rendered with the same component. */
  servicesSecondary?: ServicesContent
}
