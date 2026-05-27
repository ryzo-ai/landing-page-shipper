'use client'

import SectionWrapper from '../ui/SectionWrapper'
import Icon from '../ui/Icon'
import { ProblemSectionContent } from '../../types/content'

export default function ProblemSection({ content }: { content: ProblemSectionContent }) {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-start gap-4 p-8 rounded-xl bg-[#FAF7F4] hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-[#E0621A]/10 flex items-center justify-center text-[#E0621A]">
                <Icon d={card.icon} size={22} />
              </div>
              <h3 className="font-albra font-bold text-2xl text-[#333] leading-snug">{card.title}</h3>
              <p className="font-geist text-base text-[#2D2926]/55 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
