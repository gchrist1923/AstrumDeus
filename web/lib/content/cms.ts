import { prisma } from '@/lib/db'
import { mapAsset, mapMatch, mapNews, mapPartner, mapPlayer } from '@/lib/content/map'
import { isPublished } from '@/lib/content/publication'
import type { LiveEvent, Match, MediaAsset, NewsPost, Partner, Player, SiteStats } from '@/lib/content/types'

export async function getPublishedNews(now = Date.now()): Promise<NewsPost[]> {
  const rows = await prisma.newsPost.findMany({
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
  })

  return rows.filter((row) => isPublished(row.status, row.publishedAt, now)).map(mapNews)
}

export async function getNewsBySlug(slug: string, now = Date.now()): Promise<NewsPost | undefined> {
  const row = await prisma.newsPost.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!row || !isPublished(row.status, row.publishedAt, now)) {
    return undefined
  }

  return mapNews(row)
}

export async function getActivePlayers(): Promise<Player[]> {
  const rows = await prisma.player.findMany({
    where: { isActive: true },
    include: { stats: { include: { tournament: true } } },
    orderBy: { sortOrder: 'asc' },
  })

  return rows.map(mapPlayer)
}

export async function getFormerPlayers(): Promise<Player[]> {
  const rows = await prisma.player.findMany({
    where: { isActive: false },
    include: { stats: { include: { tournament: true } } },
    orderBy: { sortOrder: 'asc' },
  })

  return rows.map(mapPlayer)
}

export async function getPlayerBySlug(slug: string): Promise<Player | undefined> {
  const row = await prisma.player.findUnique({
    where: { slug },
    include: { stats: { include: { tournament: true } } },
  })

  return row ? mapPlayer(row) : undefined
}

export async function getUpcomingMatches(): Promise<Match[]> {
  const rows = await prisma.match.findMany({
    where: { status: 'scheduled' },
    include: { tournament: true, recap: true },
    orderBy: { scheduledAt: 'asc' },
  })

  return rows.map(mapMatch)
}

export async function getCompletedMatches(): Promise<Match[]> {
  const rows = await prisma.match.findMany({
    where: { status: 'completed' },
    include: { tournament: true, recap: true },
    orderBy: { scheduledAt: 'desc' },
  })

  return rows.map(mapMatch)
}

export async function getLiveEvent(): Promise<LiveEvent | null> {
  const live = await prisma.match.findFirst({
    where: { status: 'live' },
    include: { tournament: true },
  })

  if (!live) {
    return null
  }

  return {
    tournament: live.tournament.name,
    stage: live.stage,
    map: live.map ?? undefined,
    href: live.streamUrl ?? '/matches',
  }
}

export async function getSiteStats(): Promise<SiteStats> {
  const setting = await prisma.siteSetting.findUnique({ where: { id: 'default' } })

  return {
    titles: setting?.titles ?? 0,
    tournaments: setting?.tournaments ?? 0,
    wwcd: setting?.wwcd ?? 0,
  }
}

export async function getPartners(): Promise<Partner[]> {
  const rows = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } })
  return rows.map(mapPartner)
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const rows = await prisma.mediaKitAsset.findMany({ orderBy: { sortOrder: 'asc' } })
  return rows.map(mapAsset)
}

export async function getSiteContact(): Promise<{ email: string; note: string }> {
  const setting = await prisma.siteSetting.findUnique({ where: { id: 'default' } })

  return {
    email: setting?.contactEmail || 'halo@astrumdeus.id',
    note: 'Pilih tujuan di form supaya pesan sponsor tidak tercampur dengan tryout.',
  }
}
