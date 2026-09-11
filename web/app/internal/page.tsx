import Link from 'next/link'
import { can } from '@/lib/auth/grants'
import { canReadCashBook } from '@/lib/auth/permissions'
import { requireInternalUser } from '@/lib/auth/require'
import { cashBookPath } from '@/lib/finance/cash-path'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function InternalHomePage() {
  const user = await requireInternalUser()

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {can(user.matrix, 'jadwal', 'view') ? (
        <Link href="/internal/schedule" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Jadwal</p>
          <p className="mt-2 text-body">Kalender latihan dan scrim.</p>
        </Link>
      ) : null}
      {canReadCashBook(user.matrix, 'operasional') ? (
        <Link href={cashBookPath('operasional')} className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Kas operasional</p>
          <p className="mt-2 text-body">Tanpa hapus entri.</p>
        </Link>
      ) : null}
      {canReadCashBook(user.matrix, 'tim') ? (
        <Link href={cashBookPath('tim')} className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
          <p className="font-display text-label uppercase text-content-muted">Kas tim</p>
          <p className="mt-2 text-body">Tanpa hapus entri.</p>
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
