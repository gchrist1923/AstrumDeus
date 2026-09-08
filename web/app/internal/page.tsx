import Link from 'next/link'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function InternalHomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link href="/internal/schedule" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
        <p className="font-display text-label uppercase text-content-muted">Jadwal</p>
        <p className="mt-2 text-body">Kalender latihan dan scrim.</p>
      </Link>
      <Link href="/internal/cash" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
        <p className="font-display text-label uppercase text-content-muted">Kas</p>
        <p className="mt-2 text-body">Dua buku, tanpa hapus entri.</p>
      </Link>
      <Link href="/internal/reports" className={`border-2 border-border-strong p-5 ${KELAS_FOKUS}`}>
        <p className="font-display text-label uppercase text-content-muted">Laporan</p>
        <p className="mt-2 text-body">Harian dan bulanan dari entri.</p>
      </Link>
    </div>
  )
}
