'use client'

import { Fragment, ReactNode } from 'react'
import { LandingPageContent, SectionKey } from '../types/content'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import Hero from './sections/Hero'
import MediaBlock from './sections/MediaBlock'
import ProblemSection from './sections/ProblemSection'
import ValueProposition from './sections/ValueProposition'
import PartnerLogos from './sections/PartnerLogos'
import Services from './sections/Services'
import Process from './sections/Process'
import Testimonials from './sections/Testimonials'
import CaseStudies from './sections/CaseStudies'
import NextSteps from './sections/NextSteps'
import CTASection from './sections/CTASection'
import FAQ from './sections/FAQ'

type SectionRenderer = (c: LandingPageContent) => ReactNode

const SECTION_MAP: Record<SectionKey, SectionRenderer> = {
  hero:             (c) => c.hero             ? <Hero content={c.hero} />                         : null,
  mediaBlock:       (c) => c.mediaBlock       ? <MediaBlock content={c.mediaBlock} />             : null,
  problemSection:   (c) => c.problemSection   ? <ProblemSection content={c.problemSection} />     : null,
  valueProposition: (c) => c.valueProposition ? <ValueProposition content={c.valueProposition} /> : null,
  partnerLogos:     (c) => c.partnerLogos     ? <PartnerLogos content={c.partnerLogos} />         : null,
  services:         (c) => c.services         ? <Services content={c.services} />                 : null,
  process:          (c) => c.process          ? <Process content={c.process} />                   : null,
  testimonials:     (c) => c.testimonials     ? <Testimonials content={c.testimonials} />         : null,
  caseStudies:      (c) => c.caseStudies      ? <CaseStudies content={c.caseStudies} />           : null,
  nextSteps:        (c) => c.nextSteps        ? <NextSteps content={c.nextSteps} />               : null,
  ctaSection:       (c) => c.ctaSection       ? <CTASection content={c.ctaSection} />             : null,
  faq:              (c) => c.faq              ? <FAQ content={c.faq} />                           : null,
}

interface LandingPageProps {
  content: LandingPageContent
}

export default function LandingPage({ content }: LandingPageProps) {
  return (
    <div lang={content.lang} className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Navbar content={content.navbar} />
      <main>
        {content.sections.map((key) => (
          <Fragment key={key}>{SECTION_MAP[key]?.(content)}</Fragment>
        ))}
      </main>
      <Footer content={content.footer} />
    </div>
  )
}
