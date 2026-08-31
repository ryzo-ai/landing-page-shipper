'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { CaseStudiesContent } from '../../types/content'

export default function CaseStudies({ content }: { content: CaseStudiesContent }) {
  return (
    <SectionWrapper id="case-studies" className="py-[var(--section-padding-y)] px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs font-medium text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-primary)] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {content.items.map((cs) => (
            <div
              key={cs.title}
              className="flex flex-col rounded-[var(--radius-lg)] bg-[var(--color-surface)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow duration-200"
            >
              <div className="w-full aspect-video bg-[var(--color-text-primary)]/5 flex items-center justify-center">
                {cs.imageSrc ? (
                  <img src={cs.imageSrc} alt={cs.imageAlt ?? cs.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[var(--color-text-primary)]/20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="font-heading font-bold text-2xl text-[var(--color-primary)] mb-2">{cs.resultStat}</p>
                <h3 className="font-heading font-bold text-xl text-[var(--color-text-primary)] leading-snug mb-3">{cs.title}</h3>
                <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">{cs.description}</p>
                {cs.link && (
                  <a href={cs.link.href} className="inline-flex items-center gap-1 font-body text-sm font-medium text-[var(--color-primary)] hover:underline mt-4">
                    {cs.link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
