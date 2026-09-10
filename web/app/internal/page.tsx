import Link from 'next/link'
import { can } from '@/lib/auth/grants'
import { canReadCashBook } from '@/lib/auth/permissions'
import { requireInternalUser } from '@/lib/auth/require'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function InternalHomePage() {
  const user = await requireInternalUser()
  const bisaKas = canReadCashBook(user.matrix, 'operasional') || canReadCashBook(user.matrix, 'tim')

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {can(user.matrix, 'jadwal', 'view') ? (
        <Link href="/internal/schedule" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Jadwal</p>
          <p className="mt-2 text-body">Kalender latihan dan scrim.</p>
        </Link>
      ) : null}
      {bisaKas ? (
        <Link href="/internal/cash" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Kas</p>
          <p className="mt-2 text-body">Dua buku, tanpa hapus entri.</p>
        </Link>
      ) : null}
      {can(user.matrix, 'laporan', 'view') ? (
        <Link href="/internal/reports" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Laporan</p>
          <p className="mt-2 text-body">Harian dan bulanan dari entri.</p>
        </Link>
      ) : null}
    </div>
  )
}
