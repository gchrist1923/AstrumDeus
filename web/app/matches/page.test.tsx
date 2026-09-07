import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MatchesPage from '@/app/matches/page'

describe('Matches', () => {
  it('menampilkan PMSL SEA Week 4 di jadwal dan PMNC 2026 di hasil', () => {
    render(<MatchesPage />)

    expect(screen.getByRole('heading', { name: 'Matches' })).toBeInTheDocument()

    const jadwal = screen.getByRole('heading', { name: 'Jadwal' }).closest('section')
    expect(jadwal).not.toBeNull()
    expect(within(jadwal as HTMLElement).getByText(/PMSL SEA/)).toBeInTheDocument()
    expect(within(jadwal as HTMLElement).getByText(/Week 4/)).toBeInTheDocument()

    const hasil = screen.getByRole('heading', { name: 'Hasil' }).closest('section')
    expect(hasil).not.toBeNull()
    expect(within(hasil as HTMLElement).getByText(/PMNC 2026/)).toBeInTheDocument()
  })

  it('tetap menampilkan teks 1 pada baris juara', () => {
    render(<MatchesPage />)

    const hasil = screen.getByRole('heading', { name: 'Hasil' }).closest('section') as HTMLElement

    expect(within(hasil).getByText('1')).toBeInTheDocument()
  })
})
