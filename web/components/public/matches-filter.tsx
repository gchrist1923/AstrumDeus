'use client'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const KELAS_SELECT = `min-h-11 w-full border-2 border-border-strong bg-surface-raised px-4 text-body text-content-primary ${KELAS_FOKUS}`

export function tahunWib(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  }).format(new Date(iso))
}

export function MatchesFilter({
  years,
  tournaments,
  year,
  tournament,
  onYearChange,
  onTournamentChange,
}: {
  years: string[]
  tournaments: string[]
  year: string
  tournament: string
  onYearChange: (value: string) => void
  onTournamentChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <label className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-display text-label uppercase text-content-muted">Tahun</span>
        <select
          className={KELAS_SELECT}
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
        >
          <option value="">Semua tahun</option>
          {years.map((nilai) => (
            <option key={nilai} value={nilai}>
              {nilai}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="font-display text-label uppercase text-content-muted">Turnamen</span>
        <select
          className={KELAS_SELECT}
          value={tournament}
          onChange={(event) => onTournamentChange(event.target.value)}
        >
          <option value="">Semua turnamen</option>
          {tournaments.map((nilai) => (
            <option key={nilai} value={nilai}>
              {nilai}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
