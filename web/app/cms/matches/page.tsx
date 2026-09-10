import Link from 'next/link'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function CmsMatchesPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'matches', 'view')
  const bisaTambah = can(user.matrix, 'matches', 'create')
  const bisaUbah = can(user.matrix, 'matches', 'update')
  const matches = await prisma.match.findMany({
    include: { tournament: true },
    orderBy: { scheduledAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-section uppercase">Pertandingan</h2>
        {bisaTambah ? (
          <Link
            href="/cms/matches/new"
            className={`inline-flex min-h-11 items-center bg-accent px-6 font-display text-label uppercase text-surface-raised ${KELAS_FOKUS}`}
          >
            Tambah pertandingan
          </Link>
        ) : null}
      </div>
      <ul className="flex flex-col gap-3">
        {matches.map((match) => (
          <li key={match.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3">
            <div>
              <p className="font-display text-body font-semibold">
                {match.tournament.name} · {match.stage}
              </p>
              <p className="text-small text-content-muted">{match.status}</p>
            </div>
            {bisaUbah ? (
              <Link href={`/cms/matches/${match.id}`} className={`inline-flex min-h-11 items-center text-accent underline ${KELAS_FOKUS}`}>
                Ubah
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
