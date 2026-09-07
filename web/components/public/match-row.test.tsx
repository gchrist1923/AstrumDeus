import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { MatchRow } from '@/components/public/match-row'
import { formatMatchDate } from '@/lib/content/format'
import type { Match } from '@/lib/content/types'

const JUARA: Match = {
  id: 'pmsl-w3',
  tournament: 'PMSL SEA',
  stage: 'Week 3',
  scheduledAt: '2026-08-17T19:00:00+07:00',
  status: 'completed',
  placement: 1,
  points: 142,
  wwcdCount: 11,
  location: 'Online',
  recapSlug: null,
}

const JADWAL: Match = {
  id: 'pmsl-w4',
  tournament: 'PMSL SEA',
  stage: 'Week 4',
  scheduledAt: '2026-09-14T19:00:00+07:00',
  status: 'scheduled',
  placement: null,
  points: null,
  wwcdCount: null,
  location: 'Online',
  recapSlug: null,
}

const DENGAN_RECAP: Match = {
  id: 'pmnc-gf',
  tournament: 'PMNC 2026',
  stage: 'Grand Final',
  scheduledAt: '2026-08-30T18:00:00+07:00',
  status: 'completed',
  placement: 2,
  points: 128,
  wwcdCount: 9,
  location: 'Jakarta',
  recapSlug: 'lolos-grand-final-pmnc-2026',
}

describe('MatchRow', () => {
  it('tetap menampilkan teks 1 pada baris juara, bukan hanya warna', () => {
    render(<MatchRow match={JUARA} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/PMSL SEA/)).toBeInTheDocument()
    expect(screen.getByText(/Week 3/)).toBeInTheDocument()
    expect(screen.getByText(/Online/)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(formatMatchDate(JUARA.scheduledAt)))).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
    expect(screen.getByText('Poin')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('WWCD')).toBeInTheDocument()
  })

  it('menampilkan em dash dan label posisi belum ada pada pertandingan terjadwal', () => {
    render(<MatchRow match={JADWAL} />)

    expect(screen.getByLabelText('Belum ada posisi')).toHaveTextContent('—')
    expect(screen.queryByText('Poin')).not.toBeInTheDocument()
    expect(screen.queryByText('WWCD')).not.toBeInTheDocument()
  })

  it('membungkus nama turnamen sebagai tautan bila recapHref ada', () => {
    render(<MatchRow match={DENGAN_RECAP} recapHref="/news/lolos-grand-final-pmnc-2026" />)

    expect(screen.getByRole('link', { name: 'PMNC 2026' })).toHaveAttribute(
      'href',
      '/news/lolos-grand-final-pmnc-2026',
    )
  })

  it('menampilkan nama turnamen sebagai teks biasa bila recapHref tidak ada', () => {
    render(<MatchRow match={DENGAN_RECAP} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/PMNC 2026/)).toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas pada baris juara', async () => {
    const { container } = render(<MatchRow match={JUARA} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
