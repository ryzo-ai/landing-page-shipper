'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Icon from '../ui/Icon'
import Button from '../ui/Button'
import { ServicesContent } from '../../types/content'

function Band({ content, id }: { content: ServicesContent; id?: string }) {
  return (
    <SectionWrapper id={id} className="gp-section" style={{ backgroundImage: 'var(--gradient-services)' }}>
      <div className="gp-container">
        <div className="mx-auto max-w-[48rem] text-center mb-[clamp(2rem,4vw,3.5rem)]">
          <h2 className="gp-h2">{content.headline}</h2>
          {content.body && <p className="gp-body mt-4">{content.body}</p>}
        </div>
        <div className="mx-auto max-w-[76rem] grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[var(--radius-md)] bg-[rgba(253,254,255,0.8)] p-5 md:p-8 md:min-h-[17.5rem] flex flex-col"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              {card.iconSrc ? (
                <img src={card.iconSrc} alt="" aria-hidden="true" className="w-[3.8rem] h-[3.8rem] md:w-[4.375rem] md:h-[4.375rem]" />
              ) : (
                <div className="w-14 h-14 rounded-[var(--radius-sm)] bg-[var(--color-surface-stats)] flex items-center justify-center text-[var(--color-secondary)]">
                  <Icon d={card.icon} size={26} />
                </div>
              )}
              <div className="mt-8 flex flex-col gap-3">
                <h3 className="gp-h3">{card.title}</h3>
                <p className="gp-body">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        {content.cta && (
          <div className="mt-[clamp(2rem,4vw,3rem)] text-center">
            <Button href={content.cta.href} variant={content.cta.style ?? 'accent'}>{content.cta.label}</Button>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

function Grid({ content, id }: { content: ServicesContent; id?: string }) {
  return (
    <SectionWrapper id={id} className="gp-section bg-[var(--color-background)]">
      <div className="gp-container">
        <div className="mx-auto max-w-[48rem] text-center mb-[clamp(2rem,4vw,3.5rem)]">
          <h2 className="gp-h2">{content.headline}</h2>
          {content.body && <p className="gp-body mt-4">{content.body}</p>}
        </div>
        <div className={`mx-auto grid grid-cols-1 gap-6 ${content.cards.length === 2 ? 'md:grid-cols-2 max-w-[52rem]' : 'md:grid-cols-3 max-w-[76rem]'}`}>
          {content.cards.map((card) => (
            <div key={card.title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 md:p-8 flex flex-col gap-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card)]">
              {card.iconSrc ? (
                <img src={card.iconSrc} alt="" aria-hidden="true" className="w-14 h-14" />
              ) : (
                <div className="w-14 h-14 rounded-[var(--radius-sm)] bg-[var(--color-surface-stats)] flex items-center justify-center text-[var(--color-secondary)]">
                  <Icon d={card.icon} size={26} />
                </div>
              )}
              <h3 className="gp-h3">{card.title}</h3>
              <p className="gp-body-sm flex-1">{card.description}</p>
              {card.link && (
                <a href={card.link.href} className="inline-flex items-center gap-1 font-body text-sm font-medium text-[var(--color-primary)] hover:underline mt-auto">
                  {card.link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              )}
            </div>
          ))}
        </div>
        {content.cta && (
          <div className="mt-[clamp(2rem,4vw,3rem)] text-center">
            <Button href={content.cta.href} variant={content.cta.style ?? 'primary'}>{content.cta.label}</Button>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

/** Original card grid, kept byte-for-byte in behaviour for pages that do not set a variant. */
function Legacy({ content, id }: { content: ServicesContent; id?: string }) {
  return (
    <SectionWrapper id={id} className="py-[var(--section-padding-y)] px-6 bg-[var(--color-surface-inverse)] bg-[image:var(--gradient-accent)]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs font-medium text-[var(--color-primary)] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,56px)] text-[var(--color-text-primary)] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>
        <div className={content.cards.length === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}>
          {content.cards.map((card) => (
            <div key={card.title} className="flex flex-col gap-5 p-10 rounded-[var(--radius-lg)] bg-[var(--color-background)] border border-[var(--color-border)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-200">
              <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <Icon d={card.icon} size={22} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-[var(--color-text-primary)] leading-snug">{card.title}</h3>
              <p className="font-body text-base text-[var(--color-text-secondary)] leading-relaxed flex-1">{card.description}</p>
              {card.link && (
                <a href={card.link.href} className="inline-flex items-center gap-1 font-body text-sm font-medium text-[var(--color-primary)] hover:underline mt-auto">
                  {card.link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default function Services({ content, id = 'services' }: { content: ServicesContent; id?: string }) {
  if (content.variant === 'band') return <Band content={content} id={id} />
  if (content.variant === 'grid') return <Grid content={content} id={id} />
  return <Legacy content={content} id={id} />
}
