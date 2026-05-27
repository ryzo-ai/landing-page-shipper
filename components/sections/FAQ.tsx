'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { FAQContent } from '../../types/content'

export default function FAQ({ content }: { content: FAQContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#F2EDE8]">
      <div className="max-w-3xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#333] leading-snug text-center mb-16">
          {content.headline}
        </h2>

        <div className="flex flex-col gap-3">
          {content.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-[#2D2926]/10 bg-[#FAF7F4] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-geist font-medium text-[#2D2926] hover:bg-[#F5EEE7] transition-colors select-none">
                <span>{item.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#2D2926]/30 transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-6 pb-5 pt-1 font-geist text-base text-[#2D2926]/55 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
