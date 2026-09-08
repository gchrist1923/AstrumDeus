'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function savePartner(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  const data = {
    slug: teks(formData, 'slug'),
    name: teks(formData, 'name'),
    tier: teks(formData, 'tier'),
    logoText: teks(formData, 'logoText'),
    href: teks(formData, 'href') || null,
    description: teks(formData, 'description'),
    sortOrder: angka(formData, 'sortOrder') ?? 0,
  }

  if (id) {
    await prisma.partner.update({ where: { id }, data })
  } else {
    await prisma.partner.create({ data })
  }

  revalidatePath('/partners')
  revalidatePath('/')
  revalidatePath('/cms/partners')
  redirect('/cms/partners')
}

export async function deletePartner(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  if (id) {
    await prisma.partner.delete({ where: { id } })
  }

  revalidatePath('/partners')
  revalidatePath('/cms/partners')
  redirect('/cms/partners')
}
