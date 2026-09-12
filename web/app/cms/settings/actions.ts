'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { pathDenganFlash } from '@/lib/flash'
import { adaKosong, angka, emailValid, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { releaseMediaPath } from '@/lib/media/store'

export async function saveSettings(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'situs', 'update')

  if (adaKosong(formData, ['siteName', 'defaultMetaTitle', 'contactEmail'])) {
    redirect(pathDenganFlash('/cms/settings', { kesalahan: 'isi' }))
  }

  const contactEmail = teks(formData, 'contactEmail')
  if (!emailValid(contactEmail)) {
    redirect(pathDenganFlash('/cms/settings', { kesalahan: 'email' }))
  }

  const titles = angka(formData, 'titles')
  const tournaments = angka(formData, 'tournaments')
  const wwcd = angka(formData, 'wwcd')
  if ((titles !== null && titles < 0) || (tournaments !== null && tournaments < 0) || (wwcd !== null && wwcd < 0)) {
    redirect(pathDenganFlash('/cms/settings', { kesalahan: 'angka' }))
  }

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
      contactEmail,
      contactPhone: teks(formData, 'contactPhone'),
      titles: titles ?? 0,
      tournaments: tournaments ?? 0,
      wwcd: wwcd ?? 0,
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
  redirect(pathDenganFlash('/cms/settings', { ok: 'ubah' }))
}
