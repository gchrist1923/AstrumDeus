import { NewsForm } from '@/app/cms/news/news-form'
import { prisma } from '@/lib/db'

export default async function NewNewsPage() {
  const categories = await prisma.newsCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return <NewsForm categories={categories} />
}
