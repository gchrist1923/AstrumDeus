import { pecahJudulHero } from '@/lib/content/hero-title'
import { prisma } from '@/lib/db'

const LOGO = '/logo-astrum-deus.png'
const META_DESC =
  'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.'
const HERO_EYEBROW = 'PUBG Mobile · Indonesia'
const HERO_TITLE = 'Astrum Deus'
const HERO_TAGLINE =
  'Tim PUBG Mobile yang berlatih terjadwal dan membuka hasilnya, dari klasemen sampai catatan scrim.'
const HERO_IMAGE = '/hero.jpg'

export type PublicSiteSettings = {
  siteName: string
  logo: string
  favicon: string
  metaTitle: string
  metaDescription: string
  contactEmail: string
  contactAddress: string
  contactPhone: string
  heroEyebrow: string
  heroTitle: string
  heroTagline: string
  heroImage: string
  heroImageAlt: string
}

function terisi(nilai: string | undefined): string {
  return nilai?.trim() ?? ''
}

function atau(nilai: string | undefined, fallback: string): string {
  return terisi(nilai) || fallback
}

export { pecahJudulHero }

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 'default' } })
  const siteName = atau(row?.siteName, 'Astrum Deus')
  const heroTitle = atau(row?.heroTitle, HERO_TITLE)

  return {
    siteName,
    logo: atau(row?.logo, LOGO),
    favicon: atau(row?.favicon, LOGO),
    metaTitle: atau(row?.defaultMetaTitle, siteName),
    metaDescription: atau(row?.defaultMetaDesc, META_DESC),
    contactEmail: atau(row?.contactEmail, 'halo@astrumdeus.id'),
    contactAddress: terisi(row?.contactAddress),
    contactPhone: terisi(row?.contactPhone),
    heroEyebrow: atau(row?.heroEyebrow, HERO_EYEBROW),
    heroTitle,
    heroTagline: atau(row?.heroTagline, HERO_TAGLINE),
    heroImage: atau(row?.heroImage, HERO_IMAGE),
    heroImageAlt: atau(row?.heroImageAlt, heroTitle),
  }
}
