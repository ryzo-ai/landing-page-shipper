'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { StatsContent } from '../../types/content'

export default function Stats({ content }: { content: StatsContent }) {
  return (
    <SectionWrapper className="gp-section bg-[var(--color-surface-stats)]">
      <div className="gp-container">
        <h2 className="gp-h2 text-center mb-[clamp(2rem,4vw,3.5rem)]">{content.headline}</h2>
        <div
          className="mx-auto max-w-[76rem] rounded-[var(--radius-lg)] bg-white/[0.04] backdrop-blur-[10px] px-6 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6"
          style={{ boxShadow: 'var(--shadow-glass-inset)' }}
        >
          {content.items.map((item) => (
            <div key={item.label} className="mx-auto w-full max-w-[15.5rem] text-center">
              <p className="font-body font-normal text-[clamp(3rem,4.6vw,4.1875rem)] leading-[0.8] tracking-[0.08rem] text-[var(--color-text-primary)]">
                {item.value}
              </p>
              <p className="mt-3 mb-3 font-heading font-semibold text-[1.375rem] leading-[1.4] tracking-[0.1rem] text-[var(--color-text-primary)]">
                {item.label}
              </p>
              <p className="gp-body">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
