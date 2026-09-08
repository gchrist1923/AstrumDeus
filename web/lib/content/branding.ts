import { prisma } from '@/lib/db'

const FALLBACK = '/logo-astrum-deus.png'

export async function getSiteBranding(): Promise<{ logo: string; favicon: string }> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 'default' } })
  return {
    logo: row?.logo || FALLBACK,
    favicon: row?.favicon || FALLBACK,
  }
}
