'use client'

import '../../app/playlistpush.css'
import { PlaylistPushContent } from '../../types/playlistpush'
import Header from './Header'
import PageHero from './PageHero'
import Pitch from './Pitch'
import HowSteps from './HowSteps'
import Curators from './Curators'
import Press from './Press'
import Reviews from './Reviews'
import Team from './Team'
import PricingCalc from './PricingCalc'
import Faq from './Faq'
import Footer from './Footer'
import { useRevealObserver } from './hooks'

/**
 * Section order is fixed to mirror playlistpush.com/spotify-playlists-promotion:
 * header → hero → pitch → how it works → curators → press → reviews → team →
 * pricing → faq → footer. Content JSON supplies every string and asset.
 */
export default function PlaylistPushPage({ content }: { content: PlaylistPushContent }) {
  const ref = useRevealObserver<HTMLDivElement>()
  return (
    <div ref={ref} className="pp-page page-light">
      <Header content={content.header} />
      <main>
        <PageHero content={content.hero} />
        <Pitch content={content.pitch} />
        <HowSteps content={content.howItWorks} />
        <Curators content={content.curators} />
        <Press content={content.press} />
        <Reviews content={content.reviews} />
        <Team content={content.team} />
        <PricingCalc content={content.pricing} />
        <Faq content={content.faq} />
      </main>
      <Footer content={content.footer} />
    </div>
  )
}
