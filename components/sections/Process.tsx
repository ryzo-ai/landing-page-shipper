'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { ProcessContent } from '../../types/content'

function Badges({ content }: { content: ProcessContent }) {
  return (
    <SectionWrapper className="gp-section bg-[var(--color-background)]">
      <div className="gp-container">
        <div className="mx-auto max-w-[48rem] text-center mb-[clamp(2.5rem,5vw,4rem)]">
          <h2 className="gp-h2">{content.headline}</h2>
          {content.body && <p className="gp-body mt-4">{content.body}</p>}
        </div>
        {/* Each step spans four shared row tracks (badge, title, body, image) via subgrid,
            so titles, body copy and images line up across columns and every block ends level. */}
        <ol className="mx-auto max-w-[76rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {content.steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col sm:grid sm:grid-rows-subgrid sm:row-span-4 sm:gap-y-0">
              {/* connector line, desktop only (glopros.ai step rail) */}
              {index < content.steps.length - 1 && (
                <div className="hidden lg:block absolute top-[1.3rem] left-0 right-[-1.5rem] h-px bg-[#F2F2F2]" aria-hidden="true" />
              )}
              <span
                className={`relative z-10 self-start justify-self-start rounded-[var(--radius-sm)] border px-[1.125rem] py-2 font-body text-[1.125rem] leading-[1.55] ${
                  index === 0
                    ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)] text-[#F5F8FA]'
                    : 'bg-white border-[#F2F2F2] text-[var(--color-text-secondary)]'
                }`}
              >
                Step {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="gp-h3 mt-6 mb-3">{step.title}</h3>
              <p className="gp-body-sm">{step.description}</p>
              {step.image ? (
                <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-surface-stats)] p-4">
                  <img src={step.image.src} alt={step.image.alt} loading="lazy" className="w-full h-40 object-contain" />
                </div>
              ) : (
                <div aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  )
}

export default function Process({ content }: { content: ProcessContent }) {
  if (content.variant === 'badges') return <Badges content={content} />
  return (
    <SectionWrapper className="py-[var(--section-padding-y)] px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs font-medium text-[var(--color-primary-on-inverse)] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-on-inverse)] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="flex flex-col md:flex-row gap-0">
          {content.steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col md:flex-1 items-start md:items-center">
              {index < content.steps.length - 1 && (
                <>
                  <div className="md:hidden absolute left-5 top-10 w-0.5 h-full bg-[var(--color-background)]/10" aria-hidden="true" />
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-[var(--color-background)]/10" aria-hidden="true" />
                </>
              )}
              <div className="relative flex md:flex-col items-start md:items-center gap-4 pb-10 md:pb-0 md:px-4 w-full">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-primary-fg)] flex items-center justify-center font-heading font-bold text-sm">
                  {index + 1}
                </div>
                <div className="md:text-center">
                  <h3 className="font-heading font-bold text-xl text-[var(--color-text-on-inverse)] mb-1">{step.title}</h3>
                  <p className="font-body text-sm text-[var(--color-text-on-inverse)]/55 leading-relaxed">{step.description}</p>
                  {step.image && (
                    <img
                      src={step.image.src}
                      alt={step.image.alt}
                      loading="lazy"
                      className="mt-6 w-full max-w-[260px] md:mx-auto h-auto rounded-[var(--radius-md)]"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
