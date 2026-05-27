'use client'

import SectionWrapper from '../ui/SectionWrapper'
import { MediaBlockContent } from '../../types/content'

const aspectClasses: Record<string, string> = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
}

export default function MediaBlock({ content }: { content: MediaBlockContent }) {
  const aspect = aspectClasses[content.aspectRatio ?? '16/9'] ?? 'aspect-video'

  return (
    <SectionWrapper className="px-6 py-8 bg-[#F2EDE8]">
      <div className="max-w-6xl mx-auto w-full rounded-xl overflow-hidden shadow-lg">
        {content.type === 'image' && content.src && (
          <img src={content.src} alt={content.alt ?? ''} className={`w-full object-cover ${aspect}`} />
        )}
        {content.type === 'video' && content.src && (
          <video src={content.src} poster={content.posterSrc} controls className={`w-full ${aspect}`} />
        )}
        {content.type === 'placeholder' && (
          <div className={`w-full ${aspect} flex items-center justify-center bg-[#FAF7F4]`}>
            <div className="flex flex-col items-center gap-3 text-[#2D2926]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="font-geist text-sm">{content.alt ?? 'Product screenshot'}</span>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
