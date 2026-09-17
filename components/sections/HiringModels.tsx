'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { HiringModelsContent } from '../../types/content'

export default function HiringModels({ content }: { content: HiringModelsContent }) {
  return (
    <SectionWrapper className="gp-section bg-[var(--color-background)]">
      <div className="gp-container">
        <div className="mx-auto max-w-[48rem] text-center mb-[clamp(2rem,4vw,3.5rem)]">
          <h2 className="gp-h2">{content.headline}</h2>
          {content.body && <p className="gp-body mt-4">{content.body}</p>}
        </div>

        <div className="mx-auto max-w-[76rem] grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.models.map((model) => (
            <article key={model.title} className="rounded-[var(--radius-md)] bg-[var(--color-surface-stats)] overflow-hidden flex flex-col">
              {model.image && (
                <div className="px-6 pt-6">
                  <img src={model.image.src} alt={model.image.alt} loading="lazy" className="w-full h-44 object-contain" />
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col gap-4 flex-1">
                <h3 className="gp-h3-lg">{model.title}</h3>
                <p className="gp-body-sm">{model.description}</p>
                <div className="mt-auto pt-2">
                  <h4 className="gp-h4">What’s included:</h4>
                  <p className="gp-body-sm mt-1">{model.included}</p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-[rgba(59,160,193,0.1)] px-5 py-4">
                  <p className="font-heading text-[0.9375rem] font-medium text-[var(--color-text-primary)]">For companies:</p>
                  <p className="gp-body-sm mt-1">{model.forCompanies}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {content.note && (
          <p className="mx-auto max-w-[76rem] mt-6 rounded-[var(--radius-md)] bg-[var(--color-surface-stats)] px-6 py-4 text-center font-body text-base text-[var(--color-text-primary)]">
            {content.note}
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}
