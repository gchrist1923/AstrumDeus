import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    siteSetting: { findUnique: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { getPublicSiteSettings } from '@/lib/content/public-site'
import { pecahJudulHero } from '@/lib/content/hero-title'

const LOGO = '/logo-astrum-deus.png'
const META_DESC =
  'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.'
const HERO_EYEBROW = 'PUBG Mobile · Indonesia'
const HERO_TITLE = 'Astrum Deus'
const HERO_TAGLINE =
  'Tim PUBG Mobile yang berlatih terjadwal dan membuka hasilnya, dari klasemen sampai catatan scrim.'
const HERO_IMAGE = '/hero.jpg'

describe('pecahJudulHero', () => {
  it('memecah di spasi pertama', () => {
    expect(pecahJudulHero('Astrum Deus')).toEqual({ pertama: 'Astrum', kedua: 'Deus' })
    expect(pecahJudulHero('AD Esports Team')).toEqual({ pertama: 'AD', kedua: 'Esports Team' })
  })

  it('tanpa spasi tetap satu baris', () => {
    expect(pecahJudulHero('Solo')).toEqual({ pertama: 'Solo', kedua: null })
  })
})

describe('getPublicSiteSettings', () => {
  beforeEach(() => {
    vi.mocked(prisma.siteSetting.findUnique).mockReset()
  })

  it('memakai fallback lengkap bila row null', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue(null)

    await expect(getPublicSiteSettings()).resolves.toEqual({
      siteName: 'Astrum Deus',
      logo: LOGO,
      favicon: LOGO,
      metaTitle: 'Astrum Deus',
      metaDescription: META_DESC,
      contactEmail: 'halo@astrumdeus.id',
      contactAddress: '',
      contactPhone: '',
      heroEyebrow: HERO_EYEBROW,
      heroTitle: HERO_TITLE,
      heroTagline: HERO_TAGLINE,
      heroImage: HERO_IMAGE,
      heroImageAlt: HERO_TITLE,
    })
  })

  it('memakai nilai CMS bila terisi', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      siteName: 'AD Esports',
      logo: '/media/logo.png',
      favicon: '/media/icon.png',
      defaultMetaTitle: 'AD | PUBGM',
      defaultMetaDesc: 'Deskripsi CMS',
      contactEmail: 'halo@ad.id',
      contactAddress: 'Jakarta',
      contactPhone: '0812 000',
      heroEyebrow: 'MLBB · Jakarta',
      heroTitle: 'AD Esports',
      heroTagline: 'Paragraf hero CMS',
      heroImage: '/media/hero.png',
      heroImageAlt: 'Foto roster',
    } as never)

    await expect(getPublicSiteSettings()).resolves.toEqual({
      siteName: 'AD Esports',
      logo: '/media/logo.png',
      favicon: '/media/icon.png',
      metaTitle: 'AD | PUBGM',
      metaDescription: 'Deskripsi CMS',
      contactEmail: 'halo@ad.id',
      contactAddress: 'Jakarta',
      contactPhone: '0812 000',
      heroEyebrow: 'MLBB · Jakarta',
      heroTitle: 'AD Esports',
      heroTagline: 'Paragraf hero CMS',
      heroImage: '/media/hero.png',
      heroImageAlt: 'Foto roster',
    })
  })

  it('judul meta kosong jatuh ke nama situs; alamat/telepon kosong tetap kosong', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      siteName: 'Nama Baru',
      logo: '',
      favicon: '  ',
      defaultMetaTitle: '',
      defaultMetaDesc: '   ',
      contactEmail: '',
      contactAddress: '   ',
      contactPhone: '',
      heroEyebrow: '',
      heroTitle: '',
      heroTagline: '  ',
      heroImage: '',
      heroImageAlt: '',
    } as never)

    await expect(getPublicSiteSettings()).resolves.toEqual({
      siteName: 'Nama Baru',
      logo: LOGO,
      favicon: LOGO,
      metaTitle: 'Nama Baru',
      metaDescription: META_DESC,
      contactEmail: 'halo@astrumdeus.id',
      contactAddress: '',
      contactPhone: '',
      heroEyebrow: HERO_EYEBROW,
      heroTitle: HERO_TITLE,
      heroTagline: HERO_TAGLINE,
      heroImage: HERO_IMAGE,
      heroImageAlt: HERO_TITLE,
    })
  })

  it('alt foto kosong jatuh ke judul hero CMS', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      heroTitle: 'AD Esports',
      heroImageAlt: '  ',
    } as never)

    const situs = await getPublicSiteSettings()
    expect(situs.heroTitle).toBe('AD Esports')
    expect(situs.heroImageAlt).toBe('AD Esports')
  })
})
