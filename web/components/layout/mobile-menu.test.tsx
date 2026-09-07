import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { NAV_ITEMS } from '@/lib/nav'

const items = [...NAV_ITEMS]

describe('MobileMenu', () => {
  it('memakai tombol berlabel teks, bukan ikon tanpa nama', () => {
    render(<MobileMenu items={items} pathname="/" />)

    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  it('menyembunyikan panel sebelum tombol ditekan', () => {
    render(<MobileMenu items={items} pathname="/" />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('membuka panel berisi seluruh menu saat tombol ditekan', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('dialog', { name: 'Menu utama' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Roster' })).toBeInTheDocument()
  })

  it('mengumumkan status buka lewat aria-expanded', async () => {
    render(<MobileMenu items={items} pathname="/" />)
    const tombol = screen.getByRole('button', { name: 'Menu' })

    expect(tombol).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(tombol)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('menutup panel dengan tombol Escape', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mengembalikan fokus ke tombol pemicu setelah ditutup', async () => {
    render(<MobileMenu items={items} pathname="/" />)
    const tombol = screen.getByRole('button', { name: 'Menu' })

    await userEvent.click(tombol)
    await userEvent.keyboard('{Escape}')

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
  })

  it('memindahkan fokus ke dalam panel saat dibuka', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('menandai halaman aktif dengan aria-current', async () => {
    render(<MobileMenu items={items} pathname="/roster" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('link', { name: 'Roster' })).toHaveAttribute('aria-current', 'page')
  })

  it('menutup panel lewat tombol Tutup', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tutup menu' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas saat panel terbuka', async () => {
    const { container } = render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(await axe(container)).toHaveNoViolations()
  })
})
