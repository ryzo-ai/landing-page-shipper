'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Icon from '../ui/Icon'
import { ServicesContent } from '../../types/content'

export default function Services({ content }: { content: ServicesContent }) {
  return (
    <SectionWrapper id="services" className="py-24 px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs font-medium text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-primary)] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div
          className={
            content.cards.length === 2
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'
              : 'grid grid-cols-1 md:grid-cols-3 gap-6'
          }
        >
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-4 p-8 rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <Icon d={card.icon} size={22} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] leading-snug">{card.title}</h3>
              <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed flex-1">{card.description}</p>
              {card.link && (
                <a href={card.link.href} className="inline-flex items-center gap-1 font-body text-sm font-medium text-[var(--color-primary)] hover:underline mt-auto">
                  {card.link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
