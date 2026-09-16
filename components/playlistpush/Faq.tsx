'use client'

import { useEffect, useRef, useState } from 'react'
import { PPFaq } from '../../types/playlistpush'

const A = '/brand/playlistpush'

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const body = useRef<HTMLDivElement>(null)
  // Same technique as the site: animate max-height to the measured content height.
  useEffect(() => {
    const el = body.current
    if (el) el.style.maxHeight = isOpen ? `${el.scrollHeight}px` : '0px'
  }, [isOpen])
  return (
    <div className={`accordion-item${isOpen ? ' open' : ''}`}>
      <button className="accordion-head" aria-expanded={isOpen} onClick={onToggle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="acc-arrow" src={`${A}/icons/arrow-right.svg`} alt="" width={24} height={24} loading="lazy" decoding="async" />
        <h3>{q}</h3>
      </button>
      <div className="accordion-body" ref={body}>
        <div className="accordion-answer">{a}</div>
      </div>
    </div>
  )
}

export default function Faq({ content }: { content: PPFaq }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq-grid">
          <h2 className="reveal">{content.title}</h2>
          <div className="accordion reveal d1">
            {content.items.map((item, i) => (
              <AccordionItem key={item.q} q={item.q} a={item.a} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
