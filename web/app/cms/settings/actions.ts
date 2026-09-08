'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canManageSettings } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { releaseMediaPath } from '@/lib/media/store'

export async function saveSettings(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canManageSettings(user.roles)) {
    redirect('/cms')
  }

  const existing = await prisma.siteSetting.findUnique({ where: { id: 'default' } })
  const nextLogo = teks(formData, 'logo') || '/logo-astrum-deus.png'
  const nextFavicon = teks(formData, 'favicon') || '/logo-astrum-deus.png'

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
    },
  })

  await releaseMediaPath(existing?.logo, nextLogo)
  await releaseMediaPath(existing?.favicon, nextFavicon)

  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/contact')
  revalidatePath('/cms/settings')
}
