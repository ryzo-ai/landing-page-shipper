'use client'

import { useEffect, useRef, useState } from 'react'
import { PPHowItWorks } from '../../types/playlistpush'
import { Tick } from './Icons'

const A = '/brand/playlistpush'

/* The five app mock-ups are the site's own creative; they are fixed, not content. */
function MockSubmit() {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-field">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/icons/spotify-small.png`} alt="" width={100} height={100} />
        <span className="mock-url">open.spotify.com/track<span className="mock-caret" /></span>
      </div>
      <div className="mock-or">or</div>
      <div className="mock-upload">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {' '}Upload audio file
      </div>
      <div className="mock-label launch">Launch date</div>
      <div className="mock-field">
        <svg className="mock-cal" viewBox="0 0 24 24" fill="none">
          <path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="mock-date">Fri, Sep 12</span>
      </div>
    </div>
  )
}

function MockTargeting() {
  const pills: [string, boolean][] = [['Indie Pop', true], ['Hip-Hop', false], ['House', true], ['Rock', false], ['R&B', true], ['Afrobeats', false]]
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-label">Genres</div>
      <div className="mock-pills">
        {pills.map(([name, on]) => (
          <span key={name} className={`pill${on ? ' on' : ''}`}>{on && <Tick />}{name}</span>
        ))}
      </div>
      <div className="mock-slider" style={{ ['--w' as string]: '62%' }}>
        <div className="slider-head">
          <span className="mock-label">Playlists to reach</span>
          <span className="slider-value">150</span>
        </div>
        <div className="slider-track">
          <span className="slider-fill" />
          <span className="slider-knob" />
        </div>
        <div className="slider-note">412 match your targeting</div>
      </div>
    </div>
  )
}

function MockSend() {
  const covers = ['afrobeats.webp', 'summer-hits.jpeg', 'tropical-house.jpeg', 'run-this-city.jpeg', 'indie-focus.jpeg']
  return (
    <div className="mock" aria-hidden="true">
      <div className="send-covers">
        {covers.map((c) => <span key={c} style={{ backgroundImage: `url('${A}/covers/${c}')` }} />)}
        <span className="more">+240</span>
      </div>
      <div className="send-track" />
      <div className="send-label"><span className="live-dot" />Delivering to matched playlists</div>
    </div>
  )
}

function MockResponse() {
  return (
    <div className="mock" aria-hidden="true">
      <div className="resp-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/trevor.jpg`} alt="" width={214} height={214} />
        <div>
          <div className="resp-name">Trevor R.</div>
          <div className="resp-tag">Curator</div>
        </div>
        <span className="resp-cover" style={{ backgroundImage: `url('${A}/covers/indie-focus.jpeg')` }} />
      </div>
      <div className="resp-lines"><span /><span /><span /></div>
      <div className="resp-added">
        <span className="resp-badge"><Tick />Added to playlist</span>
      </div>
    </div>
  )
}

function MockReport() {
  const bars = ['34%', '52%', '44%', '71%', '63%', '100%']
  return (
    <div className="mock" aria-hidden="true">
      <div className="rep-head">
        <span>Campaign report</span>
        <span className="rep-live"><span className="live-dot" />Live</span>
      </div>
      <div className="rep-bars">
        {bars.map((h, i) => <span key={i} style={{ ['--h' as string]: h }} />)}
      </div>
      <div className="rep-stats">
        <div><strong>+82</strong><small>Playlist adds</small></div>
        <div><strong>133K</strong><small>Streams</small></div>
        <div><strong>55%</strong><small>Success ratio</small></div>
      </div>
    </div>
  )
}

const MOCKS = [MockSubmit, MockTargeting, MockSend, MockResponse, MockReport]

export default function HowSteps({ content }: { content: PPHowItWorks }) {
  const [active, setActive] = useState(0)
  const stepsRef = useRef<HTMLDivElement>(null)

  // Same trigger as the site: a step becomes active when it crosses the middle 16% band.
  useEffect(() => {
    const steps = Array.from(stepsRef.current?.querySelectorAll<HTMLElement>('.sc-step') ?? [])
    if (!steps.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(steps.indexOf(e.target as HTMLElement)) }),
      { rootMargin: '-42% 0px -42% 0px' },
    )
    steps.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <section className="how-steps" id="how-it-works">
      <div className="container">
        <div className="steps-header reveal">
          <div className="eyebrow">{content.eyebrow}</div>
          <h2 className="section-title small">{content.title}</h2>
        </div>
        <div className="scrolly" id="scrolly">
          <div className="sc-steps" ref={stepsRef}>
            {content.steps.map((step, i) => {
              const Mock = MOCKS[i]
              return (
                <article key={step.title} className={`sc-step${active === i ? ' active' : ''}`} >
                  <div className="sc-marker">{String(i + 1).padStart(2, '0')}</div>
                  <div className="sc-text">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  {Mock && <div className="sc-mock sc-on"><Mock /></div>}
                </article>
              )
            })}
          </div>
          <div className="sc-visual">
            <div className="sc-pin">
              <div className="sc-frame">
                {MOCKS.map((Mock, i) => (
                  <div key={i} className={`sc-mock${active === i ? ' sc-on' : ''}`}><Mock /></div>
                ))}
              </div>
              <div className="sc-dots" aria-hidden="true">
                {MOCKS.map((_, i) => <i key={i} className={active === i ? 'on' : ''} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
