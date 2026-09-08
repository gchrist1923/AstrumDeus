'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { fromDatetimeLocal } from '@/lib/datetime'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/content/slug'
import { releaseMediaPath } from '@/lib/media/store'

export async function saveNews(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  const title = teks(formData, 'title')
  const slug = teks(formData, 'slug') || slugify(title)
  const categoryName = teks(formData, 'category') || 'Umum'
  const nextCover = teks(formData, 'cover') || null
  let prevCover: string | null = null
  if (id) {
    const existing = await prisma.newsPost.findUnique({ where: { id } })
    prevCover = existing?.cover ?? null
  }
  const category = await prisma.newsCategory.upsert({
    where: { slug: slugify(categoryName) },
    update: { name: categoryName },
    create: { name: categoryName, slug: slugify(categoryName), description: categoryName },
  })

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
  redirect('/cms/news')
}

export async function deleteNews(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  if (id) {
    const existing = await prisma.newsPost.findUnique({ where: { id } })
    await prisma.newsPost.delete({ where: { id } })
    await releaseMediaPath(existing?.cover, '')
  }

  revalidatePath('/news')
  revalidatePath('/cms/news')
  redirect('/cms/news')
}
