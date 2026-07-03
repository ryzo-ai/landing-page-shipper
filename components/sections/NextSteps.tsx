'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { NextStepsContent } from '../../types/content'

export default function NextSteps({ content }: { content: NextStepsContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[var(--color-background)]">
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
          {content.cards.map((card, index) => (
            <div key={card.title} className="flex flex-col gap-4 p-8 rounded-[var(--radius-lg)] bg-[var(--color-surface)]">
              <span className="font-heading font-bold text-5xl text-[var(--color-primary)]/20 leading-none select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] leading-snug">{card.title}</h3>
              <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
