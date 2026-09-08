import type { LiveEvent, Match, MediaAsset, NewsPost, Partner, Player, SiteStats } from '@/lib/content/types'

const SEKARANG = Date.parse('2026-09-07T15:00:00+07:00')

const PEMANIN: Player[] = [
  {
    slug: 'reza',
    ign: 'Reza',
    realName: 'Reza Pratama',
    role: 'IGL',
    photo: '/portrait.jpg',
    joinedAt: '2024-02-01',
    leftAt: null,
    isActive: true,
    socials: [{ label: 'Instagram', href: 'https://instagram.com/astrumdeus' }],
    stats: [{ tournament: 'PMNC 2026', matchesPlayed: 18, kills: 42, averagePlacement: 4.2 }],
  },
  {
    slug: 'bagas',
    ign: 'Bagas',
    realName: 'Bagas Wibowo',
    role: 'Assaulter',
    photo: '/portrait.jpg',
    joinedAt: '2024-02-01',
    leftAt: null,
    isActive: true,
    socials: [],
    stats: [{ tournament: 'PMNC 2026', matchesPlayed: 18, kills: 61, averagePlacement: 4.2 }],
  },
  {
    slug: 'dimas',
    ign: 'Dimas',
    realName: 'Dimas Putra',
    role: 'Sniper',
    photo: '/portrait.jpg',
    joinedAt: '2024-06-12',
    leftAt: null,
    isActive: true,
    socials: [],
    stats: [{ tournament: 'PMNC 2026', matchesPlayed: 18, kills: 39, averagePlacement: 4.2 }],
  },
  {
    slug: 'arya',
    ign: 'Arya',
    realName: 'Arya Nugraha',
    role: 'Support',
    photo: '/portrait.jpg',
    joinedAt: '2025-01-08',
    leftAt: null,
    isActive: true,
    socials: [],
    stats: [{ tournament: 'PMNC 2026', matchesPlayed: 18, kills: 28, averagePlacement: 4.2 }],
  },
  {
    slug: 'naufal',
    ign: 'Naufal',
    realName: 'Naufal Hidayat',
    role: 'Filter',
    photo: '/portrait.jpg',
    joinedAt: '2026-01-15',
    leftAt: null,
    isActive: true,
    socials: [],
    stats: [{ tournament: 'PMSL SEA 2026', matchesPlayed: 12, kills: 21, averagePlacement: 5.1 }],
  },
  {
    slug: 'gilang',
    ign: 'Gilang',
    realName: 'Gilang Saputra',
    role: 'Filter',
    photo: '/portrait.jpg',
    joinedAt: '2023-11-01',
    leftAt: '2025-12-20',
    isActive: false,
    socials: [],
    stats: [{ tournament: 'PMPL ID S7', matchesPlayed: 24, kills: 44, averagePlacement: 6.0 }],
  },
]

const PERTANDINGAN: Match[] = [
  {
    id: 'live-pmsl',
    tournament: 'PMSL SEA',
    stage: 'Group Stage',
    scheduledAt: '2026-09-07T14:00:00+07:00',
    status: 'live',
    placement: null,
    points: null,
    wwcdCount: null,
    location: 'Online',
    recapSlug: null,
    map: 'Erangel',
    streamUrl: 'https://www.youtube.com/@AstrumDeus',
  },
  {
    id: 'pmnc-gf',
    tournament: 'PMNC 2026',
    stage: 'Grand Final',
    scheduledAt: '2026-08-30T18:00:00+07:00',
    status: 'completed',
    placement: 2,
    points: 128,
    wwcdCount: 9,
    location: 'Jakarta',
    recapSlug: 'lolos-grand-final-pmnc-2026',
  },
  {
    id: 'pmsl-w3',
    tournament: 'PMSL SEA',
    stage: 'Week 3',
    scheduledAt: '2026-08-17T19:00:00+07:00',
    status: 'completed',
    placement: 1,
    points: 142,
    wwcdCount: 11,
    location: 'Online',
    recapSlug: null,
  },
  {
    id: 'pmpl-s8',
    tournament: 'PMPL ID Season 8',
    stage: 'League',
    scheduledAt: '2026-07-26T18:00:00+07:00',
    status: 'completed',
    placement: 5,
    points: 96,
    wwcdCount: 5,
    location: 'Bandung',
    recapSlug: null,
  },
  {
    id: 'pmsl-w4',
    tournament: 'PMSL SEA',
    stage: 'Week 4',
    scheduledAt: '2026-09-14T19:00:00+07:00',
    status: 'scheduled',
    placement: null,
    points: null,
    wwcdCount: null,
    location: 'Online',
    recapSlug: null,
  },
]

const BERITA: NewsPost[] = [
  {
    slug: 'lolos-grand-final-pmnc-2026',
    title: 'Lolos ke Grand Final PMNC 2026',
    excerpt: 'Tiga hari klasemen berturut-turut di empat besar mengunci slot Grand Final.',
    body: [
      'Tiga hari di empat besar sudah cukup untuk mengunci slot. Yang berubah di hari terakhir bukan komposisi, melainkan kecepatan rotasi ke zona akhir.',
      'Rata-rata placement 3,8 di hari ketiga. WWCD tetap dua, sama seperti hari kedua, jadi yang naik adalah konsistensi, bukan keajaiban satu map.',
    ],
    cover: '/hero.jpg',
    category: 'Turnamen',
    author: 'Tim Astrum Deus',
    publishedAt: '2026-09-04T09:00:00+07:00',
    status: 'published',
  },
  {
    slug: 'rotasi-roster-pmsl-sea',
    title: 'Rotasi roster musim PMSL SEA',
    excerpt: 'Satu posisi filter bergeser, alasan dan datanya kami buka di sini.',
    body: [
      'Naufal masuk sebagai Filter mulai block Januari. Gilang selesai kontrak Desember 2025 dan tetap tercatat di halaman roster sebagai mantan pemain.',
    ],
    cover: null,
    category: 'Roster',
    author: 'Tim Astrum Deus',
    publishedAt: '2026-08-28T09:00:00+07:00',
    status: 'published',
  },
  {
    slug: 'catatan-scrim-agustus',
    title: 'Catatan scrim block Agustus',
    excerpt: '42 scrim, rata-rata placement 4,1, dan apa yang kami perbaiki.',
    body: ['Scrim Agustus dipakai untuk mengetes drop Erangel utara. Angka lengkapnya menyusul di laporan internal.'],
    cover: null,
    category: 'Latihan',
    author: 'Tim Astrum Deus',
    publishedAt: '2026-08-14T09:00:00+07:00',
    status: 'published',
  },
  {
    slug: 'draft-internal',
    title: 'Catatan pelatih yang belum terbit',
    excerpt: 'Draft.',
    body: ['Tidak boleh tampil di publik.'],
    cover: null,
    category: 'Internal',
    author: 'Tim Astrum Deus',
    publishedAt: '2026-09-01T09:00:00+07:00',
    status: 'draft',
  },
  {
    slug: 'jadwal-besok',
    title: 'Pengumuman yang dijadwalkan nanti',
    excerpt: 'Belum waktunya.',
    body: ['Jangan tampil sebelum publishedAt.'],
    cover: null,
    category: 'Turnamen',
    author: 'Tim Astrum Deus',
    publishedAt: '2026-12-01T09:00:00+07:00',
    status: 'published',
  },
]

const MITRA: Partner[] = [
  { slug: 'sponsor-utama', name: 'Sponsor Utama', tier: 'Title', logoText: 'TITLE', href: 'https://example.com' },
  { slug: 'peralatan', name: 'Peralatan', tier: 'Official', logoText: 'GEAR', href: null },
  { slug: 'minuman', name: 'Minuman', tier: 'Official', logoText: 'DRINK', href: 'https://example.com' },
  { slug: 'media', name: 'Media Partner', tier: 'Media', logoText: 'MEDIA', href: null },
]

const ASET: MediaAsset[] = [
  {
    id: 'logo-terang',
    name: 'Logo terang',
    description: 'Versi putih untuk latar gelap. Jangan diwarnai emas.',
    group: 'logo',
    href: '/logo-astrum-deus.png',
    fileType: 'PNG',
    fileSize: '16 KB',
  },
  {
    id: 'warna-brand',
    name: 'Nilai warna brand',
    description: 'Hitam #212121 dan putih #FFFFFF. Emas hanya aksen UI, bukan warna logo.',
    group: 'warna',
    href: '/logo-astrum-deus.png',
    fileType: 'PNG',
    fileSize: '16 KB',
  },
  {
    id: 'foto-tim',
    name: 'Foto tim placeholder',
    description: 'Foto dummy sampai foto asli diunggah dari CMS.',
    group: 'foto',
    href: '/hero.jpg',
    fileType: 'JPG',
    fileSize: '—',
  },
  {
    id: 'tipografi',
    name: 'Pasangan huruf',
    description: 'Chakra Petch untuk judul, Barlow untuk isi.',
    group: 'tipografi',
    href: '/logo-astrum-deus.png',
    fileType: 'PNG',
    fileSize: '16 KB',
  },
]

function sudahTerbit(post: NewsPost): boolean {
  return post.status === 'published' && Date.parse(post.publishedAt) <= SEKARANG
}

export function getPublishedNews(): NewsPost[] {
  return BERITA.filter(sudahTerbit).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return getPublishedNews().find((item) => item.slug === slug)
}

export function getActivePlayers(): Player[] {
  return PEMANIN.filter((pemain) => pemain.isActive)
}

export function getFormerPlayers(): Player[] {
  return PEMANIN.filter((pemain) => !pemain.isActive)
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return PEMANIN.find((pemain) => pemain.slug === slug)
}

export function getUpcomingMatches(): Match[] {
  return PERTANDINGAN.filter((item) => item.status === 'scheduled').sort((a, b) =>
    a.scheduledAt > b.scheduledAt ? 1 : -1,
  )
}

export function getCompletedMatches(): Match[] {
  return PERTANDINGAN.filter((item) => item.status === 'completed').sort((a, b) =>
    a.scheduledAt < b.scheduledAt ? 1 : -1,
  )
}

export function getLiveEvent(): LiveEvent | null {
  const live = PERTANDINGAN.find((item) => item.status === 'live')

  if (!live) {
    return null
  }

  return {
    tournament: live.tournament,
    stage: live.stage,
    map: live.map,
    href: live.streamUrl ?? '/matches',
  }
}

export function getSiteStats(): SiteStats {
  return { titles: 4, tournaments: 12, wwcd: 68 }
}

export function getPartners(): Partner[] {
  return MITRA
}

export function getMediaAssets(): MediaAsset[] {
  return ASET
}

export function getSiteContact(): { email: string; note: string } {
  return {
    email: 'halo@astrumdeus.id',
    note: 'Pilih tujuan di form supaya pesan sponsor tidak tercampur dengan tryout.',
  }
}

export const DUMMY_PLAYERS = PEMANIN
export const DUMMY_MATCHES = PERTANDINGAN
export const DUMMY_NEWS = BERITA
export const DUMMY_PARTNERS = MITRA
export const DUMMY_ASSETS = ASET

export function getHomeContent() {
  return {
    live: getLiveEvent(),
    stats: getSiteStats(),
    matches: getCompletedMatches(),
    players: getActivePlayers(),
    news: getPublishedNews(),
    partners: getPartners(),
  }
}
