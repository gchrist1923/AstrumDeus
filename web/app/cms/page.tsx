import Link from 'next/link'
import { can } from '@/lib/auth/grants'
import { requireCmsUser } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function CmsHomePage() {
  const user = await requireCmsUser()
  const [berita, pemain, pesan] = await Promise.all([
    prisma.newsPost.count(),
    prisma.player.count(),
    prisma.contactMessage.count({ where: { status: 'baru' } }),
  ])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {can(user.matrix, 'news', 'view') ? (
        <Link href="/cms/news" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Berita</p>
          <p className="mt-2 font-display text-section tabular-nums">{berita}</p>
        </Link>
      ) : null}
      {can(user.matrix, 'roster', 'view') ? (
        <Link href="/cms/players" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Pemain</p>
          <p className="mt-2 font-display text-section tabular-nums">{pemain}</p>
        </Link>
      ) : null}
      {can(user.matrix, 'inbox', 'view') ? (
        <Link href="/cms/inbox" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Pesan baru</p>
          <p className="mt-2 font-display text-section tabular-nums">{pesan}</p>
        </Link>
      ) : null}
    </div>
  )
}
