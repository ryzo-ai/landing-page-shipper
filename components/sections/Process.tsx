'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { ProcessContent } from '../../types/content'

export default function Process({ content }: { content: ProcessContent }) {
  return (
    <SectionWrapper className="py-24 px-6 bg-[#2D2926]">
      <div className="max-w-6xl mx-auto">
        {content.eyebrow && (
          <p className="font-geist text-xs font-medium text-[#E0621A] tracking-[0.2em] uppercase mb-4 text-center">
            {content.eyebrow}
          </p>
        )}
        <h2 className="font-albra font-bold text-[clamp(32px,5vw,56px)] text-[#F2EDE8] leading-snug text-center mb-16 max-w-2xl mx-auto">
          {content.headline}
        </h2>

        <div className="flex flex-col md:flex-row gap-0">
          {content.steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col md:flex-1 items-start md:items-center">
              {index < content.steps.length - 1 && (
                <>
                  <div className="md:hidden absolute left-5 top-10 w-0.5 h-full bg-[#F2EDE8]/10" aria-hidden="true" />
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-[#F2EDE8]/10" aria-hidden="true" />
                </>
              )}
              <div className="relative flex md:flex-col items-start md:items-center gap-4 pb-10 md:pb-0 md:px-4 w-full">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-[#E0621A] text-white flex items-center justify-center font-albra font-bold text-sm">
                  {index + 1}
                </div>
                <div className="md:text-center">
                  <h3 className="font-albra font-bold text-xl text-[#F2EDE8] mb-1">{step.title}</h3>
                  <p className="font-geist text-sm text-[#F2EDE8]/55 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
