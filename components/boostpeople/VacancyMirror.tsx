'use client'

import { useCallback, useEffect, useState } from 'react'
import MirrorPage from '../mirror/MirrorPage'
import ApplyForm from './ApplyForm'
import type { BpContent } from '../../types/boostpeople'
import { pushEvent } from '../../lib/boostpeople/track'

const FORM_HASH = '#solliciteren'

/** The mirrored vacancy page; every [data-bp-cta] opens the application form. */
export default function VacancyMirror({ html, content }: { html: string; content: BpContent }) {
  const [form, setForm] = useState<{ open: boolean; location: string }>({ open: false, location: '' })

  const onCta = useCallback((location: string) => {
    pushEvent('cta_click', { cta_location: location })
    setForm({ open: true, location })
  }, [])

  useEffect(() => {
    pushEvent('lp_view')
    // Deep link: /business-manager#solliciteren opens the form straight away
    const fromHash = () => {
      if (window.location.hash === FORM_HASH) setForm({ open: true, location: 'deeplink' })
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const onClose = useCallback(() => {
    setForm((f) => ({ ...f, open: false }))
    if (window.location.hash === FORM_HASH) history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  return (
    <>
      <MirrorPage html={html} ctaAttr="data-bp-cta" onCta={onCta} className="bp-mirror" />
      <ApplyForm open={form.open} ctaLocation={form.location} content={content} onClose={onClose} />
    </>
  )
}
