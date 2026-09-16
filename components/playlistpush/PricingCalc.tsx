'use client'

import { useState } from 'react'
import { PPPricing } from '../../types/playlistpush'
import { Arrow } from './Icons'

export default function PricingCalc({ content }: { content: PPPricing }) {
  const [budget, setBudget] = useState(content.initial)
  const onRequest = budget > content.onRequestAbove
  const playlists = Math.round(budget / content.dollarsPerPlaylist)
  const fill = ((budget - content.min) / (content.max - content.min)) * 100

  return (
    <section className="pricing-calc">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">{content.eyebrow}</div>
        </div>
        <div className="calc-panel reveal d1">
          <h2>{content.title}</h2>
          <div className="calc-label">{content.label}</div>
          <div className="calc-slider-wrap">
            <input
              type="range"
              className="price-slider"
              id="price-slider"
              min={content.min}
              max={content.max}
              step={content.step}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label={content.label}
              style={{ ['--fill' as string]: `${fill}%` }}
            />
            <div className="calc-minmax">
              <span>{content.minLabel}</span>
              <span>{content.maxLabel}</span>
            </div>
          </div>
          <div className="calc-results">
            {onRequest ? (
              <div className="calc-cell calc-on-request">
                <span className="unit">{content.onRequestPrompt}</span>
                <span className="big">{content.onRequestLabel}</span>
              </div>
            ) : (
              <>
                <div className="calc-cell calc-result">
                  <span className="unit">{content.reachLabel}</span>
                  <span className="big" id="calc-playlists">{playlists}</span>
                  <span className="unit">{content.playlistsLabel}</span>
                </div>
                <div className="calc-cell calc-result">
                  <span className="unit">$</span>
                  <span className="big" id="calc-budget">{Math.round(budget)}</span>
                  <span className="unit">{content.currencyLabel}</span>
                </div>
              </>
            )}
          </div>
          <div className="calc-divider" />
          <a href={content.cta.href} className="btn btn-red">
            {content.cta.label}
            <Arrow />
          </a>
          <p className="calc-note">{content.note}</p>
        </div>
      </div>
    </section>
  )
}
