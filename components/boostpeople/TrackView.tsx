'use client'

import { useEffect } from 'react'
import { BpEvent, pushEvent } from '../../lib/boostpeople/track'

/** Fires one page-level event on mount (lp_view, thank_you_view). */
export default function TrackView({ event }: { event: BpEvent }) {
  useEffect(() => {
    pushEvent(event)
  }, [event])
  return null
}
