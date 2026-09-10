import { slugify } from '@/lib/content/slug'

export const RESERVED_SLUGS: readonly string[] = [
  'roster',
  'matches',
  'news',
  'media-kit',
  'partners',
  'contact',
  'login',
  'cms',
  'internal',
  'media',
  'api',
  'toggle',
  '',
  'index',
]

export function normalizeSlug(raw: string): string {
  return slugify(raw)
}

export function slugIsReserved(slug: string): boolean {
  const normalized = normalizeSlug(slug)
  return (RESERVED_SLUGS as readonly string[]).includes(normalized)
}
