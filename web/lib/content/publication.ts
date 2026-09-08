export function isPublished(status: string, publishedAt: string | Date, now = Date.now()): boolean {
  const waktu = typeof publishedAt === 'string' ? Date.parse(publishedAt) : publishedAt.getTime()
  return status === 'published' && Number.isFinite(waktu) && waktu <= now
}
