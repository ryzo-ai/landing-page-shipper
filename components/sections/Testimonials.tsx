'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { TestimonialsContent } from '../../types/content'

export default function Testimonials({ content }: { content: TestimonialsContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {content.items.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid mb-6 p-6 rounded-xl bg-[#FAF7F4]"
            >
              <blockquote className="font-geist text-base text-[#2D2926]/55 leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                {t.avatarSrc ? (
                  <img src={t.avatarSrc} alt={t.avatarAlt ?? t.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#2D2926] flex items-center justify-center flex-shrink-0">
                    <span className="font-albra font-bold text-white text-sm">{t.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-geist text-sm font-medium text-[#2D2926]">{t.name}</p>
                  <p className="font-geist text-xs text-[#2D2926]/30">
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
