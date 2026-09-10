import { notFound } from 'next/navigation'
import { PageBlocks } from '@/components/public/page-blocks'
import { prisma } from '@/lib/db'
import { isPublicCustomPage } from '@/lib/pages/public-visibility'
import { slugIsReserved } from '@/lib/pages/reserved'
import type { PageRow } from '@/lib/pages/types'

function parseLayout(raw: string): PageRow[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PageRow[]) : []
  } catch {
    return []
  }
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slugIsReserved(slug)) {
    notFound()
  }

  const page = await prisma.sitePage.findUnique({ where: { slug } })
  if (!page || !isPublicCustomPage(page)) {
    notFound()
  }

  return <PageBlocks rows={parseLayout(page.layout)} title={page.title} />
}
