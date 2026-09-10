import { slugIsReserved } from '@/lib/pages/reserved'
import type { ExtraNavItem } from '@/lib/nav'

export function isPublicCustomPage(page: {
  kind: string
  status: string
  isEnabled: boolean
}): boolean {
  return page.kind === 'custom' && page.status === 'published' && page.isEnabled
}

export function customSlugError(raw: string): string | null {
  return slugIsReserved(raw) ? 'Slug tidak tersedia.' : null
}

export function extraNavFromPages(
  pages: {
    title: string
    slug: string
    kind: string
    status: string
    isEnabled: boolean
    showInNav: boolean
  }[],
): ExtraNavItem[] {
  return pages
    .filter((page) => isPublicCustomPage(page) && page.showInNav)
    .map((page) => ({ label: page.title, href: `/${page.slug}` }))
}
