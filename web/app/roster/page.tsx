import { PlayerCard } from '@/components/public/player-card'
import { SectionHeading } from '@/components/public/section-heading'
import { getActivePlayers, getFormerPlayers } from '@/lib/content/dummy'
import { requirePage } from '@/lib/content/require-page'

export default function RosterPage() {
  requirePage('roster')

  const aktif = getActivePlayers()
  const mantan = getFormerPlayers()

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Roster</h1>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {aktif.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
        {mantan.length > 0 ? (
          <section className="mt-24">
            <SectionHeading title="Mantan pemain" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {mantan.map((player) => (
                <PlayerCard key={player.slug} player={player} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
