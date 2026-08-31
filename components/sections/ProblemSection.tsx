'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Icon from '../ui/Icon'
import { ProblemSectionContent } from '../../types/content'

export default function ProblemSection({ content }: { content: ProblemSectionContent }) {
  return (
    <SectionWrapper className="py-[var(--section-padding-y)] px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs font-medium text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-primary)] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-start gap-5 p-10 rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <Icon d={card.icon} size={22} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] leading-snug">{card.title}</h3>
              <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
