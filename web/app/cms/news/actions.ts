'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { fromDatetimeLocal } from '@/lib/datetime'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function saveNews(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  const title = teks(formData, 'title')
  const slug = teks(formData, 'slug') || slugify(title)
  const categoryName = teks(formData, 'category') || 'Umum'
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
    cover: teks(formData, 'cover') || null,
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
    await prisma.newsPost.delete({ where: { id } })
  }

  revalidatePath('/news')
  revalidatePath('/cms/news')
  redirect('/cms/news')
}
