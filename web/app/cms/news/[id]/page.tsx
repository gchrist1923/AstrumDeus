import { notFound } from 'next/navigation'
import { NewsForm } from '@/app/cms/news/news-form'
import { prisma } from '@/lib/db'

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.newsPost.findUnique({ where: { id }, include: { category: true } })

  if (!post) {
    notFound()
  }

  return (
    <NewsForm
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        cover: post.cover ?? '',
        category: post.category.name,
        author: post.author,
        publishedAt: post.publishedAt,
        status: post.status,
      }}
    />
  )
}
