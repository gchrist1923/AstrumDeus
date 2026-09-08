import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayerCard } from '@/components/public/player-card'
import type { Player } from '@/lib/content/types'

const REZA: Player = {
  slug: 'reza',
  ign: 'Reza',
  realName: 'Reza Pratama',
  role: 'IGL',
  photo: '/portrait.jpg',
  joinedAt: '2024-02-01',
  leftAt: null,
  isActive: true,
  socials: [],
  stats: [],
}

describe('PlayerCard', () => {
  it('menautkan ke halaman roster, foto dengan alt, IGN, dan role sebagai teks', () => {
    render(<PlayerCard player={REZA} />)

    expect(screen.getByRole('link', { name: /Reza/ })).toHaveAttribute('href', '/roster/reza')
    expect(screen.getByRole('img', { name: 'Pemain Reza' })).toHaveAttribute('src', '/portrait.jpg')
    expect(screen.getByText('Reza')).toBeInTheDocument()
    expect(screen.getByText('IGL')).toBeInTheDocument()
  })
})
