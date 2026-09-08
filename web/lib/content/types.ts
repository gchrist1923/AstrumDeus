export type PlayerRole = 'IGL' | 'Assaulter' | 'Sniper' | 'Support' | 'Filter'

export interface Player {
  slug: string
  ign: string
  realName: string
  role: PlayerRole
  photo: string
  joinedAt: string
  leftAt: string | null
  isActive: boolean
  socials: { label: string; href: string }[]
  stats: { tournament: string; matchesPlayed: number; kills: number; averagePlacement: number }[]
}

export type MatchStatus = 'scheduled' | 'completed' | 'live'

export interface Match {
  id: string
  tournament: string
  stage: string
  scheduledAt: string
  status: MatchStatus
  placement: number | null
  points: number | null
  wwcdCount: number | null
  location: string
  recapSlug: string | null
  map?: string
  streamUrl?: string
}

export type NewsStatus = 'draft' | 'published'

export interface NewsPost {
  slug: string
  title: string
  excerpt: string
  body: string[]
  cover: string | null
  category: string
  author: string
  publishedAt: string
  status: NewsStatus
}

export interface Partner {
  slug: string
  name: string
  tier: string
  logoText: string
  href: string | null
}

export interface MediaAsset {
  id: string
  name: string
  description: string
  group: 'logo' | 'warna' | 'foto' | 'tipografi'
  href: string
  fileType: string
  fileSize: string
}

export interface SiteStats {
  titles: number
  tournaments: number
  wwcd: number
}

export interface LiveEvent {
  tournament: string
  stage: string
  map?: string
  href: string
}
