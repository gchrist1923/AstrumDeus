'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { releaseMediaPath } from '@/lib/media/store'

export async function savePartner(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  const id = teks(formData, 'id')
  requireGrant(user, 'partners', id ? 'update' : 'create')
  const nextLogo = teks(formData, 'logo') || null
  let prevLogo: string | null = null
  if (id) {
    const existing = await prisma.partner.findUnique({ where: { id } })
    prevLogo = existing?.logo ?? null
  }
  const data = {
    slug: teks(formData, 'slug'),
    name: teks(formData, 'name'),
    tier: teks(formData, 'tier'),
    logoText: teks(formData, 'logoText'),
    logo: nextLogo,
    href: teks(formData, 'href') || null,
    description: teks(formData, 'description'),
    sortOrder: angka(formData, 'sortOrder') ?? 0,
  }

  if (id) {
    await prisma.partner.update({ where: { id }, data })
  } else {
    await prisma.partner.create({ data })
  }

  await releaseMediaPath(prevLogo, nextLogo ?? '')

  revalidatePath('/partners')
  revalidatePath('/')
  revalidatePath('/cms/partners')
  redirect('/cms/partners')
}

export async function deletePartner(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'partners', 'delete')

  const id = teks(formData, 'id')
  if (id) {
    const existing = await prisma.partner.findUnique({ where: { id } })
    await prisma.partner.delete({ where: { id } })
    await releaseMediaPath(existing?.logo, '')
  }

  revalidatePath('/partners')
  revalidatePath('/cms/partners')
  redirect('/cms/partners')
}
