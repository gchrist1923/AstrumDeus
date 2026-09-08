'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { releaseMediaPath } from '@/lib/media/store'

export async function saveAsset(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  const id = teks(formData, 'id')
  requireGrant(user, 'media-kit', id ? 'update' : 'create')
  const nextHref = teks(formData, 'href')
  let prevHref: string | null = null
  if (id) {
    const existing = await prisma.mediaKitAsset.findUnique({ where: { id } })
    prevHref = existing?.href ?? null
  }
  const data = {
    name: teks(formData, 'name'),
    description: teks(formData, 'description'),
    groupName: teks(formData, 'groupName'),
    href: nextHref,
    fileType: teks(formData, 'fileType'),
    fileSize: teks(formData, 'fileSize'),
    sortOrder: angka(formData, 'sortOrder') ?? 0,
  }

  if (id) {
    await prisma.mediaKitAsset.update({ where: { id }, data })
  } else {
    await prisma.mediaKitAsset.create({ data })
  }

  await releaseMediaPath(prevHref, nextHref)

  revalidatePath('/media-kit')
  revalidatePath('/cms/media-kit')
  redirect('/cms/media-kit')
}

export async function deleteAsset(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'media-kit', 'delete')

  const id = teks(formData, 'id')
  if (id) {
    const existing = await prisma.mediaKitAsset.findUnique({ where: { id } })
    await prisma.mediaKitAsset.delete({ where: { id } })
    await releaseMediaPath(existing?.href, '')
  }

  revalidatePath('/media-kit')
  revalidatePath('/cms/media-kit')
  redirect('/cms/media-kit')
}
