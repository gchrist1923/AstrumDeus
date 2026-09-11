import Link from 'next/link'
import { formatRupiah } from '@/lib/content/format'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const KELAS_KARTU = `border-2 border-border-strong p-5 ${KELAS_FOKUS}`

export type RingkasanEvent = { title: string; waktu: string | null }
export type RingkasanBuku = { nama: string; saldo: number }

export function RingkasanInternal({
  hariIso,
  jadwal,
  kas,
}: {
  hariIso: string
  jadwal: RingkasanEvent[] | null
  kas: RingkasanBuku[] | null
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {jadwal ? (
        <Link href={`/internal/schedule?hari=${hariIso}`} className={KELAS_KARTU}>
          <p className="font-display text-label uppercase text-content-muted">Jadwal</p>
          {jadwal.length === 0 ? (
            <p className="mt-2 text-body text-content-secondary">Tidak ada jadwal hari ini.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {jadwal.map((event, index) => (
                <li key={`${event.title}-${event.waktu ?? 'hari'}-${index}`}>
                  <p className="font-display text-body">{event.title}</p>
                  {event.waktu ? <p className="text-small text-content-muted">{event.waktu}</p> : null}
                </li>
              ))}
            </ul>
          )}
        </Link>
      ) : null}
      {kas ? (
        <Link href="/internal/cash" className={KELAS_KARTU}>
          <p className="font-display text-label uppercase text-content-muted">Kas</p>
          <dl className="mt-3 flex flex-col gap-3">
            {kas.map((buku) => (
              <div key={buku.nama}>
                <dt className="text-small text-content-muted">{buku.nama}</dt>
                <dd className="font-display text-section tabular-nums">{formatRupiah(buku.saldo)}</dd>
              </div>
            ))}
          </dl>
        </Link>
      ) : null}
    </div>
  )
}
