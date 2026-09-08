'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canManageSettings } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function saveSettings(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canManageSettings(user.roles)) {
    redirect('/cms')
  }

  await prisma.siteSetting.update({
    where: { id: 'default' },
    data: {
      siteName: teks(formData, 'siteName'),
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

  revalidatePath('/')
  revalidatePath('/contact')
  revalidatePath('/cms/settings')
}
