'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { PartnerLogosContent } from '../../types/content'

export default function PartnerLogos({ content }: { content: PartnerLogosContent }) {
  if (content.logos.length === 0) return null

  return (
    <SectionWrapper className="py-12 px-6 bg-[#FAF7F4] border-y border-[#2D2926]/10">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs text-[#2D2926]/30 tracking-[0.18em] uppercase text-center mb-8">
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
