'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { PartnerLogosContent } from '../../types/content'

function Marquee({ content }: { content: PartnerLogosContent }) {
  // Duplicate the row so the -50% translate loops seamlessly (same approach as glopros.ai's logo slider).
  const row = [...content.logos, ...content.logos]
  return (
    <SectionWrapper className="pt-[clamp(2.5rem,5vw,3.5rem)] pb-[clamp(2.5rem,5vw,4rem)] bg-[var(--color-background)]">
      {content.eyebrow && (
        <h2 className="gp-h4 text-center text-[var(--color-text-secondary)] mb-8 px-[var(--container-padding-x)]">
          {content.eyebrow}
        </h2>
      )}
      <div
        className="relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}
      >
        <ul className="flex w-max items-center gap-[clamp(2.5rem,6vw,5.5rem)] motion-safe:animate-[gp-marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {row.map((logo, i) => (
            <li key={`${logo.src}-${i}`} aria-hidden={i >= content.logos.length} className="flex-none">
              <img
                src={logo.src}
                alt={i >= content.logos.length ? '' : logo.alt}
                loading="lazy"
                className="h-9 md:h-10 w-auto max-w-[140px] object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  )
}

export default function PartnerLogos({ content }: { content: PartnerLogosContent }) {
  if (content.logos.length === 0) return null
  if (content.variant === 'marquee') return <Marquee content={content} />

  return (
    <SectionWrapper className="py-12 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-body text-xs text-[var(--color-text-muted)] tracking-[0.18em] uppercase text-center mb-8">
            {content.eyebrow}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {content.logos.map((logo) => {
            const img = (
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-auto object-contain grayscale opacity-50 hover:opacity-80 hover:grayscale-0 transition-all duration-200"
              />
            )
            return logo.href ? (
              <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer">{img}</a>
            ) : (
              <span key={logo.alt}>{img}</span>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
