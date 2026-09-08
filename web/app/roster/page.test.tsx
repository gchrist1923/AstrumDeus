import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RosterPage from '@/app/roster/page'

describe('Roster', () => {
  it('menampilkan Reza sebagai IGL di roster aktif', async () => {
    render(await RosterPage())

    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()

    const reza = screen.getByRole('link', { name: /Reza/ })
    expect(reza).toHaveAttribute('href', '/roster/reza')
    expect(within(reza).getByText('IGL')).toBeInTheDocument()
  })

  it('menampilkan Gilang di section Mantan pemain', async () => {
    render(await RosterPage())

    const judul = screen.getByRole('heading', { name: 'Mantan pemain' })
    const section = judul.closest('section')

    expect(section).not.toBeNull()
    expect(within(section as HTMLElement).getByRole('link', { name: /Gilang/ })).toHaveAttribute(
      'href',
      '/roster/gilang',
    )
  })
})
