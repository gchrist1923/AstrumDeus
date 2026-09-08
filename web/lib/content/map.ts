import type { Match, MatchStatus, MediaAsset, NewsPost, NewsStatus, Partner, Player, PlayerRole } from '@/lib/content/types'

export function splitBody(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((bagian) => bagian.trim())
    .filter(Boolean)
}

export function parseSocials(raw: string): { label: string; href: string }[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is { label: string; href: string } => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof (item as { label?: unknown }).label === 'string' &&
        typeof (item as { href?: unknown }).href === 'string'
      )
    })
  } catch {
    return []
  }
}

export function mapNews(row: {
  slug: string
  title: string
  excerpt: string
  body: string
  cover: string | null
  author: string
  publishedAt: Date
  status: string
  category: { name: string }
}): NewsPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: splitBody(row.body),
    cover: row.cover,
    category: row.category.name,
    author: row.author,
    publishedAt: row.publishedAt.toISOString(),
    status: row.status as NewsStatus,
  }
}

export function mapPlayer(row: {
  slug: string
  ign: string
  realName: string
  role: string
  photo: string
  joinedAt: Date
  leftAt: Date | null
  isActive: boolean
  socials: string
  stats: { matchesPlayed: number; kills: number; averagePlacement: number; tournament: { name: string } }[]
}): Player {
  return {
    slug: row.slug,
    ign: row.ign,
    realName: row.realName,
    role: row.role as PlayerRole,
    photo: row.photo,
    joinedAt: row.joinedAt.toISOString(),
    leftAt: row.leftAt ? row.leftAt.toISOString() : null,
    isActive: row.isActive,
    socials: parseSocials(row.socials),
    stats: row.stats.map((stat) => ({
      tournament: stat.tournament.name,
      matchesPlayed: stat.matchesPlayed,
      kills: stat.kills,
      averagePlacement: stat.averagePlacement,
    })),
  }
}

export function mapMatch(row: {
  id: string
  stage: string
  scheduledAt: Date
  status: string
  placement: number | null
  points: number | null
  wwcdCount: number | null
  location: string
  map: string | null
  streamUrl: string | null
  tournament: { name: string }
  recap: { slug: string } | null
}): Match {
  return {
    id: row.id,
    tournament: row.tournament.name,
    stage: row.stage,
    scheduledAt: row.scheduledAt.toISOString(),
    status: row.status as MatchStatus,
    placement: row.placement,
    points: row.points,
    wwcdCount: row.wwcdCount,
    location: row.location,
    recapSlug: row.recap?.slug ?? null,
    map: row.map ?? undefined,
    streamUrl: row.streamUrl ?? undefined,
  }
}

export function mapPartner(row: {
  slug: string
  name: string
  tier: string
  logoText: string
  href: string | null
}): Partner {
  return {
    slug: row.slug,
    name: row.name,
    tier: row.tier,
    logoText: row.logoText,
    href: row.href,
  }
}

export function mapAsset(row: {
  id: string
  name: string
  description: string
  groupName: string
  href: string
  fileType: string
  fileSize: string
}): MediaAsset {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    group: row.groupName as MediaAsset['group'],
    href: row.href,
    fileType: row.fileType,
    fileSize: row.fileSize,
  }
}
