import { NewsForm } from '@/app/cms/news/news-form'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function NewNewsPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'news', 'create')
  const categories = await prisma.newsCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return <NewsForm categories={categories} canSave />
}
