'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Button from '../ui/Button'
import { CTASectionContent } from '../../types/content'

export default function CTASection({ content, id = 'cta' }: { content: CTASectionContent; id?: string }) {
  return (
    <SectionWrapper id={id} className="py-28 px-6 bg-[var(--color-text-primary)]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-background)] leading-snug mb-6">
          {content.headline}
        </h2>
        <p className="font-body text-lg text-[var(--color-background)]/55 max-w-2xl mx-auto mb-10">
          {content.subheadline}
        </p>
        <Button href={content.cta.href} variant="primary">
          {content.cta.label}
        </Button>
      </div>
    </SectionWrapper>
  )
}
