import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

    expect(screen.getByRole('dialog', { name: 'Menu utama' })).toHaveClass('md:hidden')
    expect(screen.getByRole('link', { name: 'Roster' })).toBeInTheDocument()
  })

  it('mengumumkan status buka lewat aria-expanded', async () => {
    render(<MobileMenu items={items} pathname="/" />)
    const tombol = screen.getByRole('button', { name: 'Menu' })

    expect(tombol).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(tombol)

    expect(tombol).toHaveAttribute('aria-expanded', 'true')
  })

  it('menutup dan memulihkan halaman saat breakpoint desktop mulai cocok', async () => {
    const latar = document.createElement('main')
    const breakpointSebelumnya =
      document.documentElement.style.getPropertyValue('--breakpoint-md')
    let saatBerubah: ((event: MediaQueryListEvent) => void) | undefined
    const mediaQuery = {
      matches: false,
      addEventListener: vi.fn(
        (_jenis: string, listener: (event: MediaQueryListEvent) => void) => {
          saatBerubah = listener
        },
      ),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery as unknown as MediaQueryList))
    document.documentElement.style.setProperty('--breakpoint-md', '60rem')
    document.body.append(latar)

    try {
      render(<MobileMenu items={items} pathname="/" />)
      const tombol = screen.getByRole('button', { name: 'Menu' })

      await userEvent.click(tombol)
      expect(latar).toHaveAttribute('inert')

      act(() => saatBerubah?.({ matches: true } as MediaQueryListEvent))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(latar).not.toHaveAttribute('inert')
      expect(tombol).toHaveAttribute('aria-expanded', 'false')
    } finally {
      latar.remove()
      document.documentElement.style.setProperty('--breakpoint-md', breakpointSebelumnya)
      vi.unstubAllGlobals()
    }
  })

  it('membuat saudara panel inert saat terbuka dan memulihkannya saat ditutup', async () => {
    const latar = document.createElement('main')
    const sudahInert = document.createElement('aside')
    sudahInert.setAttribute('inert', '')
    document.body.append(latar, sudahInert)

    try {
      render(<MobileMenu items={items} pathname="/" />)

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

      expect(latar).toHaveAttribute('inert')

      await userEvent.click(screen.getByRole('button', { name: 'Tutup menu' }))

      expect(latar).not.toHaveAttribute('inert')
      expect(sudahInert).toHaveAttribute('inert')

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

      expect(latar).toHaveAttribute('inert')
    } finally {
      latar.remove()
      sudahInert.remove()
    }
  })

  it('memulihkan saudara panel saat dilepas dalam keadaan terbuka', async () => {
    const latar = document.createElement('main')
    document.body.append(latar)

    try {
      const { unmount } = render(<MobileMenu items={items} pathname="/" />)

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
      expect(latar).toHaveAttribute('inert')

      unmount()

      expect(latar).not.toHaveAttribute('inert')
    } finally {
      latar.remove()
    }
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

  it('memberi setiap tautan target sentuh setinggi minimal 44px', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('link', { name: 'Roster' })).toHaveClass(
      'inline-flex',
      'min-h-11',
      'items-center',
    )
  })

  it('menandai halaman aktif dengan aria-current dan bilah aksen', async () => {
    render(<MobileMenu items={items} pathname="/roster" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    const aktif = screen.getByRole('link', { name: 'Roster' })
    const nonaktif = screen.getByRole('link', { name: 'Home' })

    expect(aktif).toHaveAttribute('aria-current', 'page')
    expect(aktif).toHaveClass('border-l-4', 'border-accent')
    expect(nonaktif).toHaveClass('border-l-4', 'border-transparent')
  })

  it('membungkus fokus dari elemen terakhir ke elemen pertama dengan Tab', async () => {
    const user = userEvent.setup()
    render(<MobileMenu items={items} pathname="/" />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const tutup = screen.getByRole('button', { name: 'Tutup menu' })
    const tautan = screen.getAllByRole('link')
    const terakhir = tautan[tautan.length - 1]
    terakhir.focus()

    await user.tab()

    expect(tutup).toHaveFocus()
  })

  it('membungkus fokus dari elemen pertama ke elemen terakhir dengan Shift+Tab', async () => {
    const user = userEvent.setup()
    render(<MobileMenu items={items} pathname="/" />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    const tutup = screen.getByRole('button', { name: 'Tutup menu' })
    const tautan = screen.getAllByRole('link')
    const terakhir = tautan[tautan.length - 1]
    tutup.focus()

    await user.tab({ shift: true })

    expect(terakhir).toHaveFocus()
  })

  it('menutup panel lewat tombol Tutup', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tutup menu' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas saat panel terbuka', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(await axe(document.body)).toHaveNoViolations()
  })
})
