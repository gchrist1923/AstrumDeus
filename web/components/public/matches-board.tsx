'use client'

import { useMemo, useState } from 'react'
import { MatchRow } from '@/components/public/match-row'
import { MatchesFilter, tahunWib } from '@/components/public/matches-filter'
import { SectionHeading } from '@/components/public/section-heading'
import { EmptyState } from '@/components/ui/states'
import type { Match } from '@/lib/content/types'

const DESKRIPSI_KOSONG = 'Jadwal akan tampil di sini setelah Editor menambahkannya dari CMS.'

function recapHref(match: Match, newsEnabled: boolean): string | null {
  return newsEnabled && match.recapSlug ? `/news/${match.recapSlug}` : null
}

function saring(matches: Match[], year: string, tournament: string): Match[] {
  return matches.filter((match) => {
    if (year && tahunWib(match.scheduledAt) !== year) {
      return false
    }

    if (tournament && match.tournament !== tournament) {
      return false
    }

    return true
  })
}

export function MatchesBoard({
  upcoming,
  completed,
  newsEnabled,
}: {
  upcoming: Match[]
  completed: Match[]
  newsEnabled: boolean
}) {
  const [year, setYear] = useState('')
  const [tournament, setTournament] = useState('')

  const years = useMemo(() => {
    const nilai = new Set([...upcoming, ...completed].map((match) => tahunWib(match.scheduledAt)))

    return [...nilai].sort((a, b) => (a < b ? 1 : -1))
  }, [upcoming, completed])

  const tournaments = useMemo(() => {
    const nilai = new Set([...upcoming, ...completed].map((match) => match.tournament))

    return [...nilai].sort((a, b) => a.localeCompare(b, 'id'))
  }, [upcoming, completed])

  const jadwal = saring(upcoming, year, tournament)
  const hasil = saring(completed, year, tournament)

  return (
    <>
      <div className="mt-12">
        <MatchesFilter
          years={years}
          tournaments={tournaments}
          year={year}
          tournament={tournament}
          onYearChange={setYear}
          onTournamentChange={setTournament}
        />
      </div>
      <section className="mt-16">
        <SectionHeading title="Jadwal" />
        {jadwal.length === 0 ? (
          <EmptyState title="Belum ada jadwal" description={DESKRIPSI_KOSONG} />
        ) : (
          <div className="grid gap-3">
            {jadwal.map((match) => (
              <MatchRow key={match.id} match={match} recapHref={recapHref(match, newsEnabled)} />
            ))}
          </div>
        )}
      </section>
      <section className="mt-24">
        <SectionHeading title="Hasil" />
        {hasil.length === 0 ? (
          <EmptyState title="Belum ada hasil" description={DESKRIPSI_KOSONG} />
        ) : (
          <div className="grid gap-3">
            {hasil.map((match) => (
              <MatchRow key={match.id} match={match} recapHref={recapHref(match, newsEnabled)} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
