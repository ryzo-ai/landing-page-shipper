'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Button from '../ui/Button'
import Check from '../ui/Check'
import { CTASectionContent } from '../../types/content'

function Card({ content, id }: { content: CTASectionContent; id: string }) {
  return (
    <SectionWrapper id={id} className="gp-section bg-[var(--color-background)]">
      <div className="gp-container">
        <div
          className="mx-auto max-w-[76rem] rounded-[var(--radius-xl)] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center"
          style={{ backgroundImage: 'var(--gradient-feature)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="p-8 md:p-12 lg:p-14 order-2 lg:order-1">
            <h2 className="gp-h2 mb-4">{content.headline}</h2>
            <p className="gp-body mb-8">{content.subheadline}</p>
            {content.checklist && content.checklist.length > 0 && (
              <ul className="flex flex-col gap-3 mb-10">
                {content.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-base leading-[1.55] text-[var(--color-text-body)]">
                    <span className="mt-0.5"><Check className="text-[var(--color-secondary)]" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Button href={content.cta.href} variant="primary">{content.cta.label}</Button>
              {content.microcopy && <p className="font-body text-sm text-[var(--color-text-body)]">{content.microcopy}</p>}
            </div>
            {content.badge && (
              <div className="mt-10 flex items-center gap-3">
                <img src={content.badge.src} alt={content.badge.alt} loading="lazy" className="h-12 w-auto" />
                {content.badge.label && <span className="font-heading text-sm font-medium text-[var(--color-text-primary)]">{content.badge.label}</span>}
              </div>
            )}
          </div>
          {content.image && (
            <div className="order-1 lg:order-2 h-full flex items-end justify-center px-6 pt-8 lg:pt-12">
              <img src={content.image.src} alt={content.image.alt} loading="lazy" className="w-full max-w-[34rem] h-auto object-contain" />
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default function CTASection({ content, id = 'cta' }: { content: CTASectionContent; id?: string }) {
  if (content.variant === 'card') return <Card content={content} id={id} />
  return (
    <SectionWrapper id={id} className="py-[var(--section-padding-y)] px-6 bg-[var(--color-surface-inverse)] bg-[image:var(--gradient-accent)]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-on-inverse)] leading-snug mb-6">
          {content.headline}
        </h2>
        <p className="font-body text-lg text-[var(--color-text-on-inverse)]/55 max-w-2xl mx-auto mb-10">
          {content.subheadline}
        </p>
        <Button href={content.cta.href} variant="onInverse">
          {content.cta.label}
        </Button>
      </div>
    </SectionWrapper>
  )
}
