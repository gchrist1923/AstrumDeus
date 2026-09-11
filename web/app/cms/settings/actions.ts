'use server'

import { revalidatePath } from 'next/cache'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { releaseMediaPath } from '@/lib/media/store'

export async function saveSettings(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'situs', 'update')

  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } })
  const nextLogo = teks(formData, 'logo') || '/logo-astrum-deus.png'
  const nextFavicon = teks(formData, 'favicon') || '/logo-astrum-deus.png'
  const nextHero = teks(formData, 'heroImage') || '/hero.jpg'

  await prisma.siteSetting.update({
    where: { id: 'default' },
    data: {
      siteName: teks(formData, 'siteName'),
      logo: nextLogo,
      favicon: nextFavicon,
      defaultMetaTitle: teks(formData, 'defaultMetaTitle'),
      defaultMetaDesc: teks(formData, 'defaultMetaDesc'),
      contactAddress: teks(formData, 'contactAddress'),
      contactEmail: teks(formData, 'contactEmail'),
      contactPhone: teks(formData, 'contactPhone'),
      titles: angka(formData, 'titles') ?? 0,
      tournaments: angka(formData, 'tournaments') ?? 0,
      wwcd: angka(formData, 'wwcd') ?? 0,
      heroEyebrow: teks(formData, 'heroEyebrow'),
      heroTitle: teks(formData, 'heroTitle'),
      heroTagline: teks(formData, 'heroTagline'),
      heroImage: nextHero,
      heroImageAlt: teks(formData, 'heroImageAlt'),
    },
  })

  await releaseMediaPath(existing?.logo, nextLogo)
  await releaseMediaPath(existing?.favicon, nextFavicon)
  await releaseMediaPath(existing?.heroImage, nextHero)

  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/contact')
  revalidatePath('/cms/settings')
}
