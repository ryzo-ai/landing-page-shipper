'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { TestimonialsContent } from '../../types/content'

export default function Testimonials({ content }: { content: TestimonialsContent }) {
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

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {content.items.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid mb-6 p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)]"
            >
              <blockquote className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                {t.avatarSrc ? (
                  <img src={t.avatarSrc} alt={t.avatarAlt ?? t.name} className="w-11 h-11 rounded-[var(--radius-full)] object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-[var(--radius-full)] bg-[var(--color-text-primary)] flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-[var(--color-primary-fg)] text-sm">{t.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-body text-sm font-medium text-[var(--color-text-primary)]">{t.name}</p>
                  <p className="font-body text-xs text-[var(--color-text-muted)]">
                    {t.title}{t.company ? `, ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
