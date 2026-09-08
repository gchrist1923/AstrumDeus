import { notFound } from 'next/navigation'
import { getActivePlayers, getFormerPlayers, getPlayerBySlug } from '@/lib/content/cms'
import { formatMatchDate } from '@/lib/content/format'
import { getMenuFlags } from '@/lib/content/flags'
import { requirePage } from '@/lib/content/require-page'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export async function generateStaticParams() {
  try {
    const [aktif, mantan] = await Promise.all([getActivePlayers(), getFormerPlayers()])
    return [...aktif, ...mantan].map((player) => ({ slug: player.slug }))
  } catch {
    return []
  }
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  requirePage('roster', await getMenuFlags())

  const { slug } = await params
  const player = await getPlayerBySlug(slug)

  if (!player) {
    notFound()
  }

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-start gap-12 md:grid-cols-[minmax(0,280px)_1fr] md:gap-16">
          <img
            src={player.photo}
            alt={`Pemain ${player.ign}`}
            className="aspect-[3/4] w-full max-w-[280px] object-cover grayscale contrast-[1.1] brightness-[.88] outline outline-1 outline-content-primary/10"
          />
          <div>
            <p className="mb-4 font-display text-label uppercase tracking-[0.2em] text-accent">{player.role}</p>
            <h1 className="font-display text-page uppercase text-balance">{player.ign}</h1>
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-display text-label uppercase text-content-muted">Bergabung</dt>
                <dd className="mt-2 text-body">{formatMatchDate(player.joinedAt)}</dd>
              </div>
              {player.leftAt ? (
                <div>
                  <dt className="font-display text-label uppercase text-content-muted">Keluar</dt>
                  <dd className="mt-2 text-body">{formatMatchDate(player.leftAt)}</dd>
                </div>
              ) : null}
            </dl>
            {player.socials.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-4">
                {player.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      className={`inline-flex min-h-11 items-center border-b-2 border-accent font-display text-label uppercase text-accent ${KELAS_FOKUS}`}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <section className="mt-24">
          <h2 className="mb-8 font-display text-section uppercase">Statistik</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-6 font-display text-label uppercase text-content-muted">Turnamen</th>
                  <th className="py-3 pr-6 font-display text-label uppercase text-content-muted">Pertandingan</th>
                  <th className="py-3 pr-6 font-display text-label uppercase text-content-muted">Kill</th>
                  <th className="py-3 font-display text-label uppercase text-content-muted">Rata-rata posisi</th>
                </tr>
              </thead>
              <tbody>
                {player.stats.map((row) => (
                  <tr key={row.tournament} className="border-b border-border">
                    <td className="py-4 pr-6 font-display text-body font-semibold uppercase">{row.tournament}</td>
                    <td className="py-4 pr-6 tabular-nums">{row.matchesPlayed}</td>
                    <td className="py-4 pr-6 tabular-nums">{row.kills}</td>
                    <td className="py-4 tabular-nums">{row.averagePlacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
