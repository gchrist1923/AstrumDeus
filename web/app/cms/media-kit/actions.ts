'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { describeImageMeta } from '@/lib/media/meta'
import { filenameFromPublicPath, isManagedMediaPath, readMediaFile, releaseMediaPath } from '@/lib/media/store'

async function metaDariBerkas(
  href: string,
  fallback: { fileType: string; fileSize: string },
): Promise<{ fileType: string; fileSize: string }> {
  if (!isManagedMediaPath(href)) {
    return fallback
  }
  const filename = filenameFromPublicPath(href)
  const file = filename ? await readMediaFile(filename) : null
  if (!file) {
    return fallback
  }
  return describeImageMeta(file.bytes) ?? fallback
}

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
  const meta = await metaDariBerkas(nextHref, {
    fileType: teks(formData, 'fileType'),
    fileSize: teks(formData, 'fileSize'),
  })
  const data = {
    name: teks(formData, 'name'),
    description: teks(formData, 'description'),
    groupName: teks(formData, 'groupName'),
    href: nextHref,
    fileType: meta.fileType,
    fileSize: meta.fileSize,
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
