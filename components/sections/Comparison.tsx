'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Button from '../ui/Button'
import Check from '../ui/Check'
import { ComparisonContent } from '../../types/content'

function Cross() {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true" className="flex-shrink-0 text-[var(--color-text-secondary)]">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.12" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function Comparison({ content }: { content: ComparisonContent }) {
  return (
    <SectionWrapper className="gp-section bg-[var(--color-background)]">
      <div className="gp-container">
        <div className="mx-auto max-w-[48rem] text-center mb-[clamp(2rem,4vw,3.5rem)]">
          <h2 className="gp-h2">{content.headline}</h2>
          {content.body && <p className="gp-body mt-4">{content.body}</p>}
        </div>

        <div className="mx-auto max-w-[76rem] grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Them */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-10">
            <h3 className="gp-h3 mb-6 text-[var(--color-text-secondary)]">{content.themLabel}</h3>
            <ul className="flex flex-col gap-5">
              {content.rows.map((row) => (
                <li key={row.them} className="flex items-start gap-3 gp-body-sm">
                  <span className="mt-0.5"><Cross /></span>
                  <span>{row.them}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Us */}
          <div
            className="rounded-[var(--radius-xl)] overflow-hidden flex flex-col"
            style={{ backgroundImage: 'var(--gradient-feature)', boxShadow: 'var(--shadow-card)' }}
          >
            {content.usImage && (
              <img src={content.usImage.src} alt={content.usImage.alt} loading="lazy" className="w-full h-52 md:h-60 object-contain pt-4" />
            )}
            <div className="p-8 md:p-10 pt-6 flex flex-col flex-1">
              <h3 className="gp-h3 mb-6">{content.usLabel}</h3>
              <ul className="flex flex-col gap-5">
                {content.rows.map((row) => (
                  <li key={row.us} className="flex items-start gap-3 font-body text-base leading-[1.55] text-[var(--color-text-body)]">
                    <span className="mt-0.5"><Check className="text-[var(--color-secondary)]" /></span>
                    <span>{row.us}</span>
                  </li>
                ))}
              </ul>
              {content.cta && (
                <div className="mt-8">
                  <Button href={content.cta.href} variant="secondary">{content.cta.label}</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
