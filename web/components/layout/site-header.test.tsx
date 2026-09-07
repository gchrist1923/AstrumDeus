import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { SiteHeader } from '@/components/layout/site-header'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

beforeEach(() => {
  usePathname.mockReturnValue('/')
})

describe('SiteHeader', () => {
  it('memberi nama pada navigasi utama', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('navigation', { name: 'Navigasi utama' })).toBeInTheDocument()
  })

  it('hanya menampilkan menu wajib saat tidak ada flag', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Roster' })).not.toBeInTheDocument()
  })

  it('menampilkan menu opsional yang flag-nya menyala', () => {
    render(<SiteHeader flags={{ roster: true, matches: true }} />)

    expect(screen.getByRole('link', { name: 'Roster' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Matches' })).toBeInTheDocument()
  })

  it('menandai halaman aktif dengan aria-current, bukan hanya warna', () => {
    usePathname.mockReturnValue('/news')
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current')
  })

  it('menyediakan tautan ke Home lewat logo dengan teks alternatif', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Astrum Deus' })).toHaveAttribute('href', '/')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<SiteHeader flags={{ roster: true }} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
