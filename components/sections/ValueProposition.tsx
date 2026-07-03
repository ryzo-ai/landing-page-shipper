'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { ValuePropositionContent } from '../../types/content'

export default function ValueProposition({ content }: { content: ValuePropositionContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[var(--color-surface-inverse)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          {content.eyebrow && (
            <p className="font-body text-xs font-medium text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4">
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

        {/* Graphic / Placeholder */}
        {/* #231F1C is a bespoke "inset panel" shade with no light-theme token equivalent — see report exceptions */}
        <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[#231F1C] flex items-center justify-center">
          {content.graphic ? (
            <img src={content.graphic.src} alt={content.graphic.alt} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-[var(--color-text-on-inverse)]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span className="font-body text-sm">Solution graphic</span>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
