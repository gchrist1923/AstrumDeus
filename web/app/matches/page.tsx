import { MatchesBoard } from '@/components/public/matches-board'
import { getCompletedMatches, getUpcomingMatches } from '@/lib/content/cms'
import { getMenuFlags } from '@/lib/content/flags'
import { requirePage } from '@/lib/content/require-page'
import { isMenuEnabled } from '@/lib/nav'

export default async function MatchesPage() {
  const flags = await getMenuFlags()
  requirePage('matches', flags)

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Matches</h1>
        <MatchesBoard
          upcoming={await getUpcomingMatches()}
          completed={await getCompletedMatches()}
          newsEnabled={isMenuEnabled('news', flags)}
        />
      </div>
    </main>
  )
}
