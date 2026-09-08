import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomeSections } from '@/components/public/home-sections'
import type { MenuFlags } from '@/lib/nav'

const FLAGS_TANPA_HASIL_DAN_PARTNER: MenuFlags = {
  roster: true,
  matches: false,
  'media-kit': true,
  partners: false,
}

describe('HomeSections toggle menu', () => {
  it('menyembunyikan heading Hasil dan Partner saat matches dan partners mati', () => {
    render(<HomeSections flags={FLAGS_TANPA_HASIL_DAN_PARTNER} />)

    expect(screen.queryByRole('heading', { name: 'Hasil' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Partner' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Jadwal pertandingan' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Roster' })).toBeInTheDocument()
  })
})

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
}))

describe('requirePage media-kit', () => {
  beforeEach(() => {
    notFound.mockClear()
    vi.resetModules()
  })

  it('memanggil notFound saat media-kit dimatikan', async () => {
    vi.doMock('@/lib/content/flags', () => ({
      MENU_FLAGS: { roster: true, matches: true, 'media-kit': false, partners: true },
    }))

    const { requirePage } = await import('@/lib/content/require-page')

    expect(() => requirePage('media-kit')).toThrow('NEXT_NOT_FOUND')
  })
})
