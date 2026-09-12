'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { fromDatetimeLocal } from '@/lib/datetime'
import { pathDenganFlash } from '@/lib/flash'
import { adaKosong, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { assertSelectableCategory } from '@/lib/content/active-options'
import { slugify } from '@/lib/content/slug'
import { releaseMediaPath } from '@/lib/media/store'

export async function saveNews(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  const id = teks(formData, 'id')
  requireGrant(user, 'news', id ? 'update' : 'create')
  if (adaKosong(formData, ['title', 'body', 'categoryId', 'publishedAt'])) {
    redirect(pathDenganFlash(id ? `/cms/news/${id}` : '/cms/news/new', { kesalahan: 'isi' }))
  }
  const title = teks(formData, 'title')
  const slug = teks(formData, 'slug') || slugify(title)
  const categoryId = teks(formData, 'categoryId')
  const nextCover = teks(formData, 'cover') || null
  let prevCover: string | null = null
  let previousCategoryId: string | undefined
  if (id) {
    const existing = await prisma.newsPost.findUnique({ where: { id } })
    prevCover = existing?.cover ?? null
    previousCategoryId = existing?.categoryId
  }
  const category = await prisma.newsCategory.findUnique({ where: { id: categoryId } })
  if (!category || !assertSelectableCategory(category, id ? 'update' : 'create', previousCategoryId)) {
    redirect(pathDenganFlash('/cms/news', { kesalahan: 'isi' }))
  }

  const data = {
    slug,
    title,
    excerpt: teks(formData, 'excerpt'),
    body: teks(formData, 'body'),
    cover: nextCover,
    categoryId: category.id,
    author: teks(formData, 'author') || user.name,
    publishedAt: fromDatetimeLocal(teks(formData, 'publishedAt')),
    status: teks(formData, 'status') === 'draft' ? 'draft' : 'published',
  }

  if (id) {
    await prisma.newsPost.update({ where: { id }, data })
  } else {
    await prisma.newsPost.create({ data })
  }

  await releaseMediaPath(prevCover, nextCover ?? '')

  revalidatePath('/news')
  revalidatePath('/')
  revalidatePath('/cms/news')
  redirect(pathDenganFlash('/cms/news', { ok: id ? 'ubah' : 'simpan' }))
}

export async function deleteNews(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'news', 'delete')

  const id = teks(formData, 'id')
  if (id) {
    const existing = await prisma.newsPost.findUnique({ where: { id } })
    await prisma.newsPost.delete({ where: { id } })
    await releaseMediaPath(existing?.cover, '')
  }

  revalidatePath('/news')
  revalidatePath('/cms/news')
  redirect(pathDenganFlash('/cms/news', { ok: 'hapus' }))
}
