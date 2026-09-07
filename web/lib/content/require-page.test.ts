import { beforeEach, describe, expect, it, vi } from 'vitest'

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
}))

describe('requirePage', () => {
  beforeEach(() => {
    notFound.mockClear()
    vi.resetModules()
  })

  it('membiarkan menu wajib lewat tanpa notFound', async () => {
    const { requirePage } = await import('@/lib/content/require-page')

    expect(() => requirePage('news')).not.toThrow()
    expect(notFound).not.toHaveBeenCalled()
  })

  it('memanggil notFound saat roster dimatikan', async () => {
    vi.doMock('@/lib/content/flags', () => ({
      MENU_FLAGS: { roster: false, matches: true, 'media-kit': true, partners: true },
    }))

    const { requirePage } = await import('@/lib/content/require-page')

    expect(() => requirePage('roster')).toThrow('NEXT_NOT_FOUND')
  })
})
