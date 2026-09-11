import { HomeSections } from '@/components/public/home-sections'
import {
  getActivePlayers,
  getCompletedMatches,
  getLiveEvent,
  getPartners,
  getPublishedNews,
  getSiteStats,
} from '@/lib/content/cms'
import { getMenuFlags } from '@/lib/content/flags'
import { getPublicSiteSettings } from '@/lib/content/public-site'

export default async function Home() {
  const flags = await getMenuFlags()
  const [live, stats, matches, players, news, partners, situs] = await Promise.all([
    getLiveEvent(),
    getSiteStats(),
    getCompletedMatches(),
    getActivePlayers(),
    getPublishedNews(),
    getPartners(),
    getPublicSiteSettings(),
  ])

  return (
    <HomeSections
      flags={flags}
      content={{ live, stats, matches, players, news, partners }}
      hero={{
        eyebrow: situs.heroEyebrow,
        title: situs.heroTitle,
        tagline: situs.heroTagline,
        image: situs.heroImage,
        imageAlt: situs.heroImageAlt,
      }}
    />
  )
}
