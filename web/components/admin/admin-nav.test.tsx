import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdminNav } from '@/components/admin/admin-nav'

vi.mock('next/navigation', () => ({
  usePathname: () => '/cms/news/new',
}))

const tautan = [
  { href: '/cms', label: 'Ringkasan' },
  { href: '/cms/news', label: 'Berita' },
  { href: '/cms/players', label: 'Roster' },
]

describe('AdminNav', () => {
  it('tombol Menu hanya untuk layar sempit', () => {
    render(<AdminNav tautan={tautan} name="Admin" />)
    const menu = screen.getByRole('button', { name: 'Menu' })
    expect(menu.closest('div')).toHaveClass('md:hidden')
  })

  it('sidebar desktop tersembunyi di HP', () => {
    render(<AdminNav tautan={tautan} name="Admin" />)
    expect(screen.getByRole('navigation', { name: 'Navigasi admin' })).toHaveClass('hidden', 'md:flex')
  })

  it('panel HP menandai rute turunan sebagai halaman aktif', async () => {
    render(<AdminNav tautan={tautan} name="Admin" />)
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    const panel = screen.getByRole('dialog', { name: 'Navigasi admin' })
    expect(within(panel).getByRole('link', { name: 'Berita' })).toHaveAttribute('aria-current', 'page')
    expect(within(panel).getByRole('link', { name: 'Ringkasan' })).not.toHaveAttribute('aria-current')
  })

  it('Keluar ada di bawah tautan menu, bukan di samping tombol Menu', async () => {
    render(<AdminNav tautan={tautan} name="Admin" />)
    expect(screen.queryByRole('button', { name: 'Keluar' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    const panel = screen.getByRole('dialog', { name: 'Navigasi admin' })
    const keluar = within(panel).getByRole('button', { name: 'Keluar' })
    const berita = within(panel).getByRole('link', { name: 'Berita' })
    expect(keluar.compareDocumentPosition(berita) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(0)
    expect(berita.compareDocumentPosition(keluar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
