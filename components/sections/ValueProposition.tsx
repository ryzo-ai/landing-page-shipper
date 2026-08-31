'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { ValuePropositionContent } from '../../types/content'

export default function ValueProposition({ content }: { content: ValuePropositionContent }) {
  const hasGraphic = Boolean(content.graphic)

  return (
    <SectionWrapper className="py-24 px-6 bg-[var(--color-surface-inverse)]">
      <div
        className={
          hasGraphic
            ? 'max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center'
            : 'max-w-3xl mx-auto text-center'
        }
      >
        {/* Text */}
        <div>
          {content.eyebrow && (
            <p className="font-body text-xs font-medium text-[var(--color-primary-on-inverse)] tracking-[0.2em] uppercase mb-4">
              {content.eyebrow}
            </p>
          )}
          <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-on-inverse)] leading-snug mb-8">
            {content.headline}
          </h2>
          <div className="font-body text-base text-[var(--color-text-on-inverse)]/55 leading-relaxed space-y-4">
            {content.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Graphic — only rendered when config provides real content; no placeholder panel */}
        {content.graphic && (
          <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-text-on-inverse)]/5 flex items-center justify-center">
            <img src={content.graphic.src} alt={content.graphic.alt} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
