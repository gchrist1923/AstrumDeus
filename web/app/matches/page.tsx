import { MatchesBoard } from '@/components/public/matches-board'
import { getCompletedMatches, getUpcomingMatches } from '@/lib/content/dummy'
import { MENU_FLAGS } from '@/lib/content/flags'
import { requirePage } from '@/lib/content/require-page'
import { isMenuEnabled } from '@/lib/nav'

export default function MatchesPage() {
  requirePage('matches')

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Matches</h1>
        <MatchesBoard
          upcoming={getUpcomingMatches()}
          completed={getCompletedMatches()}
          newsEnabled={isMenuEnabled('news', MENU_FLAGS)}
        />
      </div>
    </main>
  )
}
