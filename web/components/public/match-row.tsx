import Link from 'next/link'
import { formatMatchDate } from '@/lib/content/format'
import type { Match } from '@/lib/content/types'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function MatchRow({ match, recapHref }: { match: Match; recapHref?: string | null }) {
  const juara = match.placement === 1
  const selesai = match.status === 'completed'
  const namaTurnamen = recapHref ? (
    <Link href={recapHref} className={`inline-flex min-h-11 items-center ${KELAS_FOKUS}`}>
      {match.tournament}
    </Link>
  ) : (
    match.tournament
  )

  return (
    <div
      className={`grid grid-cols-[60px_1fr] items-center gap-4 bg-surface-raised px-6 py-6 md:grid-cols-[86px_1fr_auto_auto] md:gap-6 ${
        juara ? 'border-l-4 border-l-accent' : 'border-l-4 border-border'
      }`}
    >
      <div
        className={`font-display text-[46px] font-bold leading-none tabular-nums ${juara ? 'text-accent' : ''}`}
        aria-label={match.placement == null ? 'Belum ada posisi' : undefined}
      >
        {match.placement ?? '—'}
      </div>
      <div>
        <div className="font-display text-[22px] font-bold uppercase leading-[1.15]">
          {namaTurnamen} {match.stage}
        </div>
        <p className="mt-1 text-small text-content-muted">
          {match.location} · {formatMatchDate(match.scheduledAt)}
        </p>
      </div>
      {selesai ? (
        <>
          <div className="text-right tabular-nums">
            <span className="block font-display text-[26px] font-bold leading-none">{match.points}</span>
            <span className="mt-1 block font-display text-label uppercase text-content-muted">Poin</span>
          </div>
          <div className="text-right tabular-nums">
            <span className="block font-display text-[26px] font-bold leading-none">{match.wwcdCount}</span>
            <span className="mt-1 block font-display text-label uppercase text-content-muted">WWCD</span>
          </div>
        </>
      ) : null}
    </div>
  )
}
