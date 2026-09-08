import Link from 'next/link'
import { prisma } from '@/lib/db'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function CmsHomePage() {
  const [berita, pemain, pesan] = await Promise.all([
    prisma.newsPost.count(),
    prisma.player.count(),
    prisma.contactMessage.count({ where: { status: 'baru' } }),
  ])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link href="/cms/news" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
        <p className="font-display text-label uppercase text-content-muted">Berita</p>
        <p className="mt-2 font-display text-section tabular-nums">{berita}</p>
      </Link>
      <Link href="/cms/players" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
        <p className="font-display text-label uppercase text-content-muted">Pemain</p>
        <p className="mt-2 font-display text-section tabular-nums">{pemain}</p>
      </Link>
      <Link href="/cms/inbox" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
        <p className="font-display text-label uppercase text-content-muted">Pesan baru</p>
        <p className="mt-2 font-display text-section tabular-nums">{pesan}</p>
      </Link>
    </div>
  )
}
