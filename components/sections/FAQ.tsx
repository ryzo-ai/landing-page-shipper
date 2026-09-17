'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { FAQContent } from '../../types/content'

export default function FAQ({ content }: { content: FAQContent }) {
  if (content.variant === 'glopros') {
    return (
      <SectionWrapper className="gp-section bg-[var(--color-background)]">
        <div className="gp-container">
          <h2 className="gp-h2 text-center mb-[clamp(2rem,4vw,3.5rem)]">{content.headline}</h2>
          <div className="mx-auto max-w-[52rem] flex flex-col gap-3">
            {content.items.map((item) => (
              <details key={item.question} className="group rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white overflow-hidden transition-shadow duration-200 open:shadow-[var(--shadow-card)]">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none gp-h4 select-none hover:bg-[var(--color-surface-stats)] transition-colors">
                  <span>{item.question}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[var(--color-secondary)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-1 gp-body-sm">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </SectionWrapper>
    )
  }
  return (
    <SectionWrapper className="py-[var(--section-padding-y)] px-6 bg-[var(--color-background)]">
      <div className="max-w-3xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs font-medium text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-primary)] leading-snug text-center mb-16">
          {content.headline}
        </h2>

        <div className="flex flex-col gap-3">
          {content.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-body font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors select-none">
                <span>{item.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-1 font-body text-base text-[var(--color-text-secondary)] leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
