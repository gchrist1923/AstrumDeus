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

export default async function Home() {
  const flags = await getMenuFlags()
  const [live, stats, matches, players, news, partners] = await Promise.all([
    getLiveEvent(),
    getSiteStats(),
    getCompletedMatches(),
    getActivePlayers(),
    getPublishedNews(),
    getPartners(),
  ])

  return (
    <HomeSections
      flags={flags}
      content={{ live, stats, matches, players, news, partners }}
    />
  )
}
