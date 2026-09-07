import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MatchesBoard } from '@/components/public/matches-board'
import { tahunWib } from '@/components/public/matches-filter'
import type { Match } from '@/lib/content/types'

const JADWAL_2026: Match = {
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

const HASIL_2026: Match = {
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

const HASIL_2025: Match = {
  id: 'pmpl-s7',
  tournament: 'PMPL ID Season 7',
  stage: 'League',
  scheduledAt: '2025-07-26T18:00:00+07:00',
  status: 'completed',
  placement: 4,
  points: 80,
  wwcdCount: 3,
  location: 'Jakarta',
  recapSlug: null,
}

describe('tahunWib', () => {
  it('mengambil tahun dari scheduledAt di zona Asia/Jakarta', () => {
    expect(tahunWib('2025-12-31T22:00:00+00:00')).toBe('2026')
    expect(tahunWib('2026-09-14T19:00:00+07:00')).toBe('2026')
  })
})

describe('MatchesBoard', () => {
  it('default menampilkan semua jadwal dan hasil', () => {
    render(
      <MatchesBoard upcoming={[JADWAL_2026]} completed={[HASIL_2026, HASIL_2025]} newsEnabled />,
    )

    const jadwal = screen.getByRole('heading', { name: 'Jadwal' }).closest('section') as HTMLElement
    const hasil = screen.getByRole('heading', { name: 'Hasil' }).closest('section') as HTMLElement

    expect(within(jadwal).getByText(/Week 4/)).toBeInTheDocument()
    expect(within(hasil).getByText(/PMNC 2026/)).toBeInTheDocument()
    expect(within(hasil).getByText(/PMPL ID Season 7/)).toBeInTheDocument()
  })

  it('menyaring pertandingan berdasarkan tahun', async () => {
    render(
      <MatchesBoard upcoming={[JADWAL_2026]} completed={[HASIL_2026, HASIL_2025]} newsEnabled />,
    )

    await userEvent.selectOptions(screen.getByLabelText('Tahun'), '2026')

    const hasil = screen.getByRole('heading', { name: 'Hasil' }).closest('section') as HTMLElement

    expect(within(hasil).getByText(/PMNC 2026/)).toBeInTheDocument()
    expect(within(hasil).queryByText(/PMPL ID Season 7/)).not.toBeInTheDocument()
  })

  it('menyaring pertandingan berdasarkan turnamen', async () => {
    render(
      <MatchesBoard upcoming={[JADWAL_2026]} completed={[HASIL_2026]} newsEnabled />,
    )

    await userEvent.selectOptions(screen.getByLabelText('Turnamen'), 'PMNC 2026')

    expect(screen.getByText(/Grand Final/)).toBeInTheDocument()
    expect(screen.queryByText(/Week 4/)).not.toBeInTheDocument()
    expect(screen.getByText('Belum ada jadwal')).toBeInTheDocument()
  })

  it('menampilkan EmptyState bila section kosong', () => {
    render(<MatchesBoard upcoming={[]} completed={[]} newsEnabled={false} />)

    expect(screen.getByRole('heading', { name: 'Belum ada jadwal' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Belum ada hasil' })).toBeInTheDocument()
    expect(
      screen.getAllByText('Jadwal akan tampil di sini setelah Editor menambahkannya dari CMS.'),
    ).toHaveLength(2)
  })

  it('mengisi recapHref hanya bila news nyala dan recapSlug ada', () => {
    const { rerender } = render(
      <MatchesBoard upcoming={[]} completed={[HASIL_2026]} newsEnabled />,
    )

    expect(screen.getByRole('link', { name: 'PMNC 2026' })).toHaveAttribute(
      'href',
      '/news/lolos-grand-final-pmnc-2026',
    )

    rerender(<MatchesBoard upcoming={[]} completed={[HASIL_2026]} newsEnabled={false} />)

    expect(screen.queryByRole('link', { name: 'PMNC 2026' })).not.toBeInTheDocument()
  })
})
