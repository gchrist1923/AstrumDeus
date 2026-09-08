'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function saveAsset(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  const data = {
    name: teks(formData, 'name'),
    description: teks(formData, 'description'),
    groupName: teks(formData, 'groupName'),
    href: teks(formData, 'href'),
    fileType: teks(formData, 'fileType'),
    fileSize: teks(formData, 'fileSize'),
    sortOrder: angka(formData, 'sortOrder') ?? 0,
  }

  if (id) {
    await prisma.mediaKitAsset.update({ where: { id }, data })
  } else {
    await prisma.mediaKitAsset.create({ data })
  }

  revalidatePath('/media-kit')
  revalidatePath('/cms/media-kit')
  redirect('/cms/media-kit')
}

export async function deleteAsset(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  if (id) {
    await prisma.mediaKitAsset.delete({ where: { id } })
  }

  revalidatePath('/media-kit')
  revalidatePath('/cms/media-kit')
  redirect('/cms/media-kit')
}
