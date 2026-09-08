import Link from 'next/link'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function CmsPlayersPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'roster', 'view')
  const bisaTambah = can(user.matrix, 'roster', 'create')
  const bisaUbah = can(user.matrix, 'roster', 'update')
  const players = await prisma.player.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-section uppercase">Roster</h2>
        {bisaTambah ? (
          <Link
            href="/cms/players/new"
            className={`inline-flex min-h-11 items-center bg-accent px-6 font-display text-label uppercase text-surface-raised ${KELAS_FOKUS}`}
          >
            Tambah pemain
          </Link>
        ) : null}
      </div>
      <ul className="flex flex-col gap-3">
        {players.map((player) => (
          <li key={player.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3">
            <div>
              <p className="font-display text-body font-semibold uppercase">{player.ign}</p>
              <p className="text-small text-content-muted">
                {player.role} · {player.isActive ? 'aktif' : 'mantan'}
              </p>
            </div>
            {bisaUbah ? (
              <Link href={`/cms/players/${player.id}`} className={`inline-flex min-h-11 items-center text-accent underline ${KELAS_FOKUS}`}>
                Ubah
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
