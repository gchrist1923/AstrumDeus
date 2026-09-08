import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    siteSetting: { findUnique: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { getSiteBranding } from '@/lib/content/branding'

const FALLBACK = '/logo-astrum-deus.png'

describe('getSiteBranding', () => {
  beforeEach(() => {
    vi.mocked(prisma.siteSetting.findUnique).mockReset()
  })

  it('mengembalikan logo dan favicon fallback bila row null', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue(null)

    await expect(getSiteBranding()).resolves.toEqual({ logo: FALLBACK, favicon: FALLBACK })
  })

  it('memakai nilai setting bila ada', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      logo: '/media/logo.png',
      favicon: '/media/icon.png',
    } as never)

    await expect(getSiteBranding()).resolves.toEqual({
      logo: '/media/logo.png',
      favicon: '/media/icon.png',
    })
  })

  it('fallback per field bila string kosong', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      logo: '',
      favicon: '/media/icon.png',
    } as never)

    await expect(getSiteBranding()).resolves.toEqual({
      logo: FALLBACK,
      favicon: '/media/icon.png',
    })
  })
})
