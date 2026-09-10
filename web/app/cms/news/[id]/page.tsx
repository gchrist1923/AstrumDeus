import { notFound } from 'next/navigation'
import { NewsForm } from '@/app/cms/news/news-form'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { activePlusCurrent } from '@/lib/content/active-options'
import { prisma } from '@/lib/db'

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsUser()
  requireGrant(user, 'news', 'view')
  const { id } = await params
  const [post, categories] = await Promise.all([
    prisma.newsPost.findUnique({ where: { id } }),
    prisma.newsCategory.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!post) {
    notFound()
  }

  return (
    <NewsForm
      categories={activePlusCurrent(categories, post.categoryId)}
      canSave={can(user.matrix, 'news', 'update')}
      canDelete={can(user.matrix, 'news', 'delete')}
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        cover: post.cover ?? '',
        categoryId: post.categoryId,
        author: post.author,
        publishedAt: post.publishedAt,
        status: post.status,
      }}
    />
  )
}
