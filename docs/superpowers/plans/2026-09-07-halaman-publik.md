# Halaman Publik Astrum Deus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti halaman sementara dengan situs publik lengkap (Home, Roster, Matches, News, Media Kit, Partners, Contact) memakai konten dummy, sehingga setiap menu yang aktif bisa dibuka dan dicek di browser.

**Architecture:** Data dummy tinggal di `web/lib/content/` sebagai satu sumber angka dan salinan. Halaman App Router membaca data itu di server. Komponen kartu dan baris pertandingan tinggal di `web/components/public/`. Flag menu pindah dari konstanta di layout ke `web/lib/content/flags.ts` supaya Home, navigasi dan `notFound()` memakai nilai yang sama. CMS tidak dipilih di plan ini.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Vitest, React Testing Library, vitest-axe. Server Action untuk form Contact, tanpa database.

## Global Constraints

Nilai berikut dikutip apa adanya dari `docs/superpowers/specs/2026-09-07-ui-ux-astrum-deus-design.md` dan berlaku untuk semua task.

- Warna: `surface-base` `#171717`, `surface-raised` `#212121`, `surface-overlay` `#2A2A2A`, `border` `#383838`, `border-strong` `#7C7C7C`, `content-primary` `#FFFFFF`, `content-secondary` `#BCBCBC`, `content-muted` `#9B9B9B`, `accent` `#F0B429`, `accent-strong` `#C68A15`, `accent-soft` `#FFD166`, `danger` `#FF6369`, `danger-solid` `#C62828`, `danger-strong` `#9E1F1F`
- Huruf display Chakra Petch bobot 600 dan 700, huruf teks Barlow bobot 400 sampai 700
- Radius sudut 0 di seluruh antarmuka
- Skala spasi 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 piksel
- Breakpoint 640px, 960px dan 1240px, container maksimum 1240px, gutter 32px di desktop dan 20px di ponsel
- Bahasa antarmuka Bahasa Indonesia, atribut `lang="id"`
- Area sentuh minimal 44x44px
- Warna tidak boleh jadi satu-satunya pembawa makna
- Setiap kontrol yang bisa dijangkau keyboard punya focus state yang terlihat
- Kontras teks minimal 4,5:1, kontras batas kontrol minimal 3:1
- Gerak menghormati `prefers-reduced-motion`
- Role pemain: IGL, Assaulter, Sniper, Support, Filter
- Tanggal pertandingan memakai zona WIB
- Artikel News 19px, lebar baris 68 karakter
- Logo sponsor di atas plat putih
- Logo Astrum Deus tidak pernah diwarnai emas
- `AGENTS.md` di root repo melarang commit dan push tanpa izin Grace. Langkah commit di tiap task dijalankan karena Grace sudah meminta lanjutkan plan ini; tidak ada push kecuali diminta lagi

---

## Pembagian

Fondasi sudah ada di `master`. Area internal milik plan terpisah. Plan ini hanya situs publik.

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/lib/content/types.ts` | Tipe Player, Match, NewsPost, Partner, MediaAsset, SiteStats, LiveEvent |
| `web/lib/content/dummy.ts` | Data dummy dan fungsi baca (published, aktif, jadwal, hasil) |
| `web/lib/content/flags.ts` | `MENU_FLAGS` satu sumber untuk layout, Home, dan guard rute |
| `web/lib/content/require-page.ts` | Memanggil `notFound()` jika menu opsional mati |
| `web/lib/content/format.ts` | Format tanggal WIB dan label role |
| `web/components/public/live-bar.tsx` | Bar live, hilang jika tidak ada event |
| `web/components/public/stat-trio.tsx` | Tiga angka kunci hero |
| `web/components/public/section-heading.tsx` | Judul section plus tautan "semua" |
| `web/components/public/match-row.tsx` | Baris jadwal atau hasil |
| `web/components/public/player-card.tsx` | Kartu roster |
| `web/components/public/article-card.tsx` | Kartu berita |
| `web/components/public/partner-plate.tsx` | Logo sponsor di plat putih |
| `web/components/public/asset-card.tsx` | Aset media kit |
| `web/components/public/contact-form.tsx` | Form kontak klien |
| `web/app/page.tsx` | Home |
| `web/app/roster/page.tsx` | Daftar roster |
| `web/app/roster/[slug]/page.tsx` | Detail pemain |
| `web/app/matches/page.tsx` | Jadwal dan hasil |
| `web/app/news/page.tsx` | Arsip berita |
| `web/app/news/[slug]/page.tsx` | Isi artikel |
| `web/app/media-kit/page.tsx` | Media kit |
| `web/app/partners/page.tsx` | Partners |
| `web/app/contact/page.tsx` | Contact |
| `web/app/contact/actions.ts` | Server Action validasi form |
| `web/public/hero.jpg` | Foto hero dummy |
| `web/public/portrait.jpg` | Foto pemain dummy |

Pola test: `<nama>.test.ts` atau `<nama>.test.tsx` di samping berkas yang diuji.

Node ada di `C:\Users\gchri\tools\node-v24.19.0-win-x64`. Perintah npm dijalankan dari `web/`.

---

### Task 1: Data dummy, flag menu, dan guard rute

**Files:**
- Create: `web/lib/content/types.ts`
- Create: `web/lib/content/dummy.ts`
- Create: `web/lib/content/flags.ts`
- Create: `web/lib/content/require-page.ts`
- Create: `web/lib/content/format.ts`
- Modify: `web/app/layout.tsx`
- Test: `web/lib/content/dummy.test.ts`
- Test: `web/lib/content/require-page.test.ts`
- Test: `web/lib/content/format.test.ts`

**Interfaces:**
- Consumes: `NavKey`, `MenuFlags`, `isMenuEnabled` dari `@/lib/nav`
- Produces:
  - `MENU_FLAGS: MenuFlags` dari `@/lib/content/flags`
  - `requirePage(key: NavKey): void` dari `@/lib/content/require-page`
  - `getPublishedNews()`, `getNewsBySlug(slug)`, `getActivePlayers()`, `getFormerPlayers()`, `getPlayerBySlug(slug)`, `getUpcomingMatches()`, `getCompletedMatches()`, `getLiveEvent()`, `getSiteStats()`, `getPartners()`, `getMediaAssets()`, `getSiteContact()` dari `@/lib/content/dummy`
  - `formatMatchDate(iso: string): string` dan `formatNewsDate(iso: string): string` dari `@/lib/content/format`

- [ ] **Step 1: Tulis test dummy yang masih gagal**

Buat `web/lib/content/dummy.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  getActivePlayers,
  getCompletedMatches,
  getFormerPlayers,
  getLiveEvent,
  getNewsBySlug,
  getPublishedNews,
  getUpcomingMatches,
} from '@/lib/content/dummy'

describe('getPublishedNews', () => {
  it('menyembunyikan draft dan artikel yang jadwalnya masih di masa depan', () => {
    const slug = getPublishedNews().map((item) => item.slug)

    expect(slug).not.toContain('draft-internal')
    expect(slug).not.toContain('jadwal-besok')
  })

  it('mengurutkan terbaru dulu', () => {
    const tanggal = getPublishedNews().map((item) => item.publishedAt)

    expect(tanggal).toEqual([...tanggal].sort((a, b) => (a < b ? 1 : -1)))
  })
})

describe('getNewsBySlug', () => {
  it('mengembalikan undefined untuk draft', () => {
    expect(getNewsBySlug('draft-internal')).toBeUndefined()
  })
})

describe('roster', () => {
  it('memisahkan pemain aktif dan mantan', () => {
    expect(getActivePlayers().every((pemain) => pemain.isActive)).toBe(true)
    expect(getFormerPlayers().every((pemain) => !pemain.isActive)).toBe(true)
    expect(getActivePlayers().some((pemain) => pemain.role === 'Filter')).toBe(true)
  })
})

describe('matches', () => {
  it('memisahkan jadwal dan hasil', () => {
    expect(getUpcomingMatches().every((item) => item.status === 'scheduled')).toBe(true)
    expect(getCompletedMatches().every((item) => item.status === 'completed')).toBe(true)
    expect(getCompletedMatches()[0]?.placement).toBeTypeOf('number')
  })
})

describe('getLiveEvent', () => {
  it('mengembalikan event atau null, tidak pernah string kosong', () => {
    const live = getLiveEvent()

    if (live) {
      expect(live.tournament.trim().length).toBeGreaterThan(0)
    } else {
      expect(live).toBeNull()
    }
  })
})
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- lib/content/dummy.test.ts
```

Harapan: GAGAL, modul tidak bisa di-resolve.

- [ ] **Step 3: Tulis tipe, dummy, format, flags, dan guard**

`web/lib/content/types.ts`:

```ts
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
```

`web/lib/content/format.ts`:

```ts
const WAKTU_WIB = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const WAKTU_BERITA = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatMatchDate(iso: string): string {
  return WAKTU_WIB.format(new Date(iso))
}

export function formatNewsDate(iso: string): string {
  return WAKTU_BERITA.format(new Date(iso))
}
```

`web/lib/content/flags.ts`:

```ts
import type { MenuFlags } from '@/lib/nav'

export const MENU_FLAGS: MenuFlags = {
  roster: true,
  matches: true,
  'media-kit': true,
  partners: true,
}
```

Untuk dummy UI, semua menu opsional dinyalakan supaya setiap halaman bisa dicek. Mematikan flag di berkas ini harus membuat rute terkait 404 dan section Home terkait hilang.

`web/lib/content/require-page.ts`:

```ts
import { notFound } from 'next/navigation'
import { MENU_FLAGS } from '@/lib/content/flags'
import { isMenuEnabled, type NavKey } from '@/lib/nav'

export function requirePage(key: NavKey): void {
  if (!isMenuEnabled(key, MENU_FLAGS)) {
    notFound()
  }
}
```

`web/lib/content/dummy.ts` — isi lengkap:

```ts
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
```

- [ ] **Step 4: Tulis test format dan requirePage**

`web/lib/content/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatMatchDate, formatNewsDate } from '@/lib/content/format'

describe('formatMatchDate', () => {
  it('menulis tanggal Indonesia tanpa menghilangkan tahun', () => {
    expect(formatMatchDate('2026-08-30T18:00:00+07:00')).toMatch(/2026/)
    expect(formatMatchDate('2026-08-30T18:00:00+07:00')).toMatch(/Agustus|August/i)
  })
})

describe('formatNewsDate', () => {
  it('menghasilkan string non-kosong untuk tanggal terbit', () => {
    expect(formatNewsDate('2026-09-04T09:00:00+07:00').trim().length).toBeGreaterThan(0)
  })
})
```

`web/lib/content/require-page.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
}))

describe('requirePage', () => {
  beforeEach(() => {
    notFound.mockClear()
    vi.resetModules()
  })

  it('membiarkan menu wajib lewat tanpa notFound', async () => {
    const { requirePage } = await import('@/lib/content/require-page')

    expect(() => requirePage('news')).not.toThrow()
    expect(notFound).not.toHaveBeenCalled()
  })

  it('memanggil notFound saat roster dimatikan', async () => {
    vi.doMock('@/lib/content/flags', () => ({
      MENU_FLAGS: { roster: false, matches: true, 'media-kit': true, partners: true },
    }))

    const { requirePage } = await import('@/lib/content/require-page')

    expect(() => requirePage('roster')).toThrow('NEXT_NOT_FOUND')
  })
})
```

- [ ] **Step 5: Ganti konstanta layout**

Di `web/app/layout.tsx`, hapus `const MENU_AKTIF = { roster: true, matches: true } as const` dan impor `MENU_FLAGS` dari `@/lib/content/flags`. Oper `flags={MENU_FLAGS}` ke `SiteHeader` dan `SiteFooter`.

- [ ] **Step 6: Jalankan test**

```powershell
npm test -- lib/content
```

Harapan: LOLOS.

- [ ] **Step 7: Commit**

```powershell
cd ..
git add web/lib/content web/app/layout.tsx
git commit -m "feat: tambah data dummy dan guard menu publik"
cd web
```

---

### Task 2: Aset foto, LiveBar, StatTrio, SectionHeading

**Files:**
- Create: `web/public/hero.jpg` (salin dari `docs/superpowers/specs/mockups/assets/hero.jpg`)
- Create: `web/public/portrait.jpg` (salin dari `docs/superpowers/specs/mockups/assets/portrait.jpg`)
- Create: `web/components/public/live-bar.tsx`
- Create: `web/components/public/stat-trio.tsx`
- Create: `web/components/public/section-heading.tsx`
- Test: `web/components/public/live-bar.test.tsx`
- Test: `web/components/public/stat-trio.test.tsx`
- Test: `web/components/public/section-heading.test.tsx`

**Interfaces:**
- Consumes: `LiveEvent`, `SiteStats` dari Task 1
- Produces:
  - `LiveBar({ event }: { event: LiveEvent | null })`
  - `StatTrio({ stats }: { stats: SiteStats })`
  - `SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string })`

- [ ] **Step 1: Salin aset**

Dari root repo:

```powershell
Copy-Item docs/superpowers/specs/mockups/assets/hero.jpg web/public/hero.jpg
Copy-Item docs/superpowers/specs/mockups/assets/portrait.jpg web/public/portrait.jpg
```

- [ ] **Step 2: Tulis test LiveBar yang gagal**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiveBar } from '@/components/public/live-bar'

describe('LiveBar', () => {
  it('tidak merender apa pun bila tidak ada event', () => {
    const { container } = render(<LiveBar event={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('menulis label Live selain warna, plus nama turnamen', () => {
    render(
      <LiveBar
        event={{ tournament: 'PMSL SEA', stage: 'Group Stage', map: 'Erangel', href: '/matches' }}
      />,
    )

    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByText(/PMSL SEA/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tonton stream' })).toHaveAttribute('href', '/matches')
  })
})
```

- [ ] **Step 3: Implementasi LiveBar, StatTrio, SectionHeading**

`live-bar.tsx`:

```tsx
import Link from 'next/link'
import type { LiveEvent } from '@/lib/content/types'

export function LiveBar({ event }: { event: LiveEvent | null }) {
  if (!event) {
    return null
  }

  return (
    <div className="bg-accent text-surface-raised">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-4 px-5 py-3 font-display text-small font-bold uppercase tracking-wide md:px-8">
        <span className="inline-block size-2 bg-surface-raised" aria-hidden="true" />
        <span>Live</span>
        <span className="text-surface-raised/70" aria-hidden="true">
          ·
        </span>
        <span>
          {event.tournament} {event.stage}
          {event.map ? ` · ${event.map}` : ''}
        </span>
        <Link
          href={event.href}
          className="ml-auto min-h-11 border-b-2 border-surface-raised font-display text-label uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-raised"
        >
          Tonton stream
        </Link>
      </div>
    </div>
  )
}
```

Titik live memakai kotak, bukan hanya warna. Teks "Live" wajib ada.

`stat-trio.tsx`:

```tsx
import type { SiteStats } from '@/lib/content/types'

export function StatTrio({ stats }: { stats: SiteStats }) {
  const item = [
    { value: stats.titles, label: 'Gelar' },
    { value: stats.tournaments, label: 'Turnamen' },
    { value: stats.wwcd, label: 'WWCD' },
  ]

  return (
    <dl className="mt-12 flex flex-wrap gap-10">
      {item.map((angka) => (
        <div key={angka.label} className="border-l-2 border-accent pl-4">
          <dt className="font-display text-label uppercase text-content-muted">{angka.label}</dt>
          <dd className="font-display text-[38px] font-bold leading-none tabular-nums">{angka.value}</dd>
        </div>
      ))}
    </dl>
  )
}
```

`section-heading.tsx`:

```tsx
import Link from 'next/link'

export function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="font-display text-section uppercase">{title}</h2>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      {href && linkLabel ? (
        <Link
          href={href}
          className="min-h-11 font-display text-label uppercase text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Test StatTrio dan SectionHeading**

StatTrio harus menampilkan teks Gelar, Turnamen, WWCD dan ketiga angka. SectionHeading merender heading dan tautan opsional. Sertakan axe pada LiveBar dengan event.

- [ ] **Step 5: Jalankan test, lalu commit**

```powershell
npm test -- components/public
cd ..
git add web/public/hero.jpg web/public/portrait.jpg web/components/public
git commit -m "feat: tambah LiveBar, angka kunci, dan heading section"
cd web
```

---

### Task 3: MatchRow, PlayerCard, ArticleCard, PartnerPlate, AssetCard

**Files:**
- Create: `web/components/public/match-row.tsx`
- Create: `web/components/public/player-card.tsx`
- Create: `web/components/public/article-card.tsx`
- Create: `web/components/public/partner-plate.tsx`
- Create: `web/components/public/asset-card.tsx`
- Test: masing-masing `*.test.tsx`

**Interfaces:**
- Consumes: tipe Task 1, `formatMatchDate`, `formatNewsDate`, `MENU_FLAGS`, `isMenuEnabled`
- Produces komponen presentasi murni dengan props data

- [ ] **Step 1: MatchRow**

Baris hasil: grid `86px 1fr auto auto` di desktop, `60px 1fr` di bawah 960px. Posisi 1 menambah `border-l-accent` plus teks angka tetap. Jangan andalkan warna saja.

Untuk jadwal (`status === 'scheduled'`), kolom posisi menampilkan em dash "—" dan `aria-label="Belum ada posisi"`.

Jika `recapSlug` ada dan `isMenuEnabled('news', MENU_FLAGS)`, bungkus nama turnamen sebagai `Link` ke `/news/${recapSlug}`. Jika News mati, tampilkan teks biasa.

Test wajib: juara tetap punya teks "1"; recap jadi teks saat flag news dimatikan (oper prop `newsEnabled: boolean` dari pemanggil, jangan baca flag di dalam kartu jika itu mempersulit test — lebih jelas: `MatchRow` menerima `recapHref?: string | null`. Pemanggil yang memutuskan).

Jadi: `MatchRow({ match, recapHref }: { match: Match; recapHref?: string | null })`.

- [ ] **Step 2: PlayerCard**

Tautan ke `/roster/${slug}`, foto grayscale, IGN uppercase, role sebagai teks (IGL dll), `alt={`Pemain ${ign}`}`.

- [ ] **Step 3: ArticleCard**

Waktu, judul 24px, excerpt. Tautan `/news/${slug}`.

- [ ] **Step 4: PartnerPlate**

Latar putih, teks/logo gelap `text-surface-raised`. Jika `href` null, `div` bukan tautan mati.

- [ ] **Step 5: AssetCard**

Menampilkan `fileType` dan `fileSize` sebelum tautan unduh. Grup sebagai heading visual.

- [ ] **Step 6: Commit**

```powershell
git add web/components/public
git commit -m "feat: tambah kartu roster, baris pertandingan, berita dan aset"
```

Tulis test axe untuk MatchRow juara dan PartnerPlate tanpa tautan.

---

### Task 4: Home

**Files:**
- Modify: `web/app/page.tsx`
- Test: `web/app/page.test.tsx`

**Interfaces:**
- Consumes: dummy, flags, LiveBar, StatTrio, SectionHeading, MatchRow, PlayerCard, ArticleCard, PartnerPlate

Urutan section: LiveBar, hero, hasil, roster, berita, partner.

Hero: foto `/hero.jpg` alt "Lima pemain Astrum Deus berdiri berjajar memegang ponsel", eyebrow "PUBG Mobile · Indonesia", h1 "Astrum Deus" (boleh `<br />` antara kata), lede dari mockup, tombol Lihat roster (`/roster`) dan Jadwal pertandingan (`/matches`) memakai `Button` primary dan secondary sebagai `Link` dengan class yang sama — atau `Link` bergaya seperti mockup. Pakai `Link` plus kelas token, karena `Button` tidak punya href. Primary: `bg-accent text-surface-raised`, secondary: `border-2 border-border-strong`.

Section hasil hanya jika `isMenuEnabled('matches', MENU_FLAGS)`. Roster hanya jika roster nyala. Partner hanya jika partners nyala. Berita selalu, memakai tiga terbaru.

Jika matches mati, CTA hero "Jadwal pertandingan" menjadi teks biasa atau disembunyikan. Sembunyikan tombol yang menuju rute mati.

- [ ] **Step 1: Test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from '@/app/page'

describe('Home', () => {
  it('membuka dengan nama tim dan tiga angka kunci', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: /Astrum/i })).toBeInTheDocument()
    expect(screen.getByText('Gelar')).toBeInTheDocument()
    expect(screen.getByText('WWCD')).toBeInTheDocument()
  })

  it('menampilkan bar Live saat ada pertandingan berlangsung', () => {
    render(<Home />)

    expect(screen.getByText('Live')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Implementasikan Home sesuai mockup `home-arah-c.html`, memakai token bukan hex mockup.**

Foto hero: `object-fit cover`, grayscale, overlay `bg-surface-base/80` via gradient Tailwind. Clip diagonal 6% di bawah foto: `clip-path: polygon(0 0, 100% 0, 100% 94%, 0 100%)`.

- [ ] **Step 3: `npm test -- app/page.test.tsx` lalu `npm run build`**

- [ ] **Step 4: Commit**

```powershell
git commit -am "feat: bangun halaman Home dengan konten dummy"
```

---

### Task 5: Roster dan detail pemain

**Files:**
- Create: `web/app/roster/page.tsx`
- Create: `web/app/roster/[slug]/page.tsx`
- Test: `web/app/roster/page.test.tsx`
- Test: `web/app/roster/player-page.test.tsx`

**Interfaces:**
- Consumes: `requirePage('roster')`, `getActivePlayers`, `getFormerPlayers`, `getPlayerBySlug`, `PlayerCard`

Halaman daftar: `requirePage('roster')` di awal. Heading "Roster". Grid 4 kolom desktop, 2 di bawah 960px. Section "Mantan pemain" di bawah jika ada.

Detail: jika slug tidak ketemu, `notFound()`. Tampilkan IGN, role, tanggal gabung, statistik per turnamen (tabel, bukan kartu), tautan sosial. `generateStaticParams` dari semua pemain dummy.

Test: halaman memuat Reza sebagai IGL; Gilang ada di mantan; slug `tidak-ada` memanggil notFound (mock).

Commit: `feat: tambah roster dan halaman detail pemain`

---

### Task 6: Matches

**Files:**
- Create: `web/app/matches/page.tsx`
- Test: `web/app/matches/page.test.tsx`

`requirePage('matches')`. Dua section: Jadwal (`getUpcomingMatches`) lalu Hasil (`getCompletedMatches`). Filter tahun dan turnamen: `<select>` native, state klien `MatchesFilter` yang menerima daftar lengkap sebagai props. Default tampilkan semua.

EmptyState jika satu section kosong: "Belum ada jadwal" / "Belum ada hasil" dengan deskripsi "Jadwal akan tampil di sini setelah Editor menambahkannya dari CMS."

`recapHref` diisi hanya jika news enabled dan `recapSlug` ada.

Commit: `feat: tambah halaman jadwal dan hasil pertandingan`

---

### Task 7: News

**Files:**
- Create: `web/app/news/page.tsx`
- Create: `web/app/news/[slug]/page.tsx`
- Test: `web/app/news/page.test.tsx`
- Test: `web/app/news/article-page.test.tsx`

Daftar: pagination sederhana, 9 per halaman via searchParam `?halaman=`. Artikel `prose` tidak dipakai jika itu menarik gaya generik; pakai `text-article max-w-[68ch]`. Draft dan jadwal masa depan 404.

Test: draft-internal 404; lolos-grand-final tampil; arsip tidak memuat judul draft.

Commit: `feat: tambah arsip dan halaman detail berita`

---

### Task 8: Media Kit dan Partners

**Files:**
- Create: `web/app/media-kit/page.tsx`
- Create: `web/app/partners/page.tsx`
- Test: kedua `page.test.tsx`

Media Kit: `requirePage('media-kit')`. Kelompokkan aset. Sertakan paragraf aturan: logo tidak boleh diwarnai emas. AssetCard menampilkan jenis dan ukuran.

Partners: `requirePage('partners')`. Kelompok per `tier`. PartnerPlate putih.

Commit: `feat: tambah halaman Media Kit dan Partners`

---

### Task 9: Contact

**Files:**
- Create: `web/app/contact/actions.ts`
- Create: `web/components/public/contact-form.tsx`
- Create: `web/app/contact/page.tsx`
- Test: `web/app/contact/actions.test.ts`
- Test: `web/components/public/contact-form.test.tsx`

Tujuan: `sponsor` | `media` | `tryout` | `lainnya` dengan label "Kerja sama sponsor", "Media dan pers", "Tryout pemain", "Lainnya".

`kirimPesan(formData: FormData)` mengembalikan `{ ok: true } | { ok: false; errors: Record<string, string> }`.

Validasi: nama wajib, email harus mengandung `@`, tujuan wajib salah satu enum, pesan minimal 10 karakter. Jangan persist. Jangan sebutkan apakah "email terdaftar".

Form klien: tampilkan error per field, pertahankan value. Sukses: teks "Pesan terkirim. Kami baca kotak masuk secara berkala." `role="status"`.

Halaman juga menampilkan email `halo@astrumdeus.id` sebagai `SiteSetting` dummy di `dummy.ts` fungsi `getSiteContact()`.

Commit: `feat: tambah form kontak dengan validasi server`

---

### Task 10: Verifikasi toggle, build, dan browser

**Files:**
- Test: `web/app/toggle.test.tsx` — render Home dengan mock `MENU_FLAGS` partners false dan pastikan heading Partner tidak ada. Cara yang lebih andal: ekstrak `HomeSections({ flags }: { flags: MenuFlags })` di `web/components/public/home-sections.tsx` pada task ini jika Task 4 masih baca flags langsung. Lebih baik Task 4 sudah menerima flags sebagai argumen `getHomeModel(flags)`.

Jika Task 4 membaca `MENU_FLAGS` langsung, test toggle dilakukan dengan `vi.mock('@/lib/content/flags')`.

Langkah:
1. Test Home tanpa matches: tidak ada heading Hasil, tidak ada tautan Jadwal pertandingan.
2. Test requirePage media-kit sudah ada di Task 1.
3. `npm test` penuh.
4. `npm run build`.
5. Browser: buka `/`, `/roster`, `/roster/reza`, `/matches`, `/news`, `/news/lolos-grand-final-pmnc-2026`, `/media-kit`, `/partners`, `/contact`. Cek keyboard Tab, 320px, LiveBar, plat putih partner.

Commit hanya jika ada perbaikan yang muncul dari verifikasi.

---

## Catatan self-review

Coverage spec: Home, Roster+detail, Matches, News+detail, Media Kit, Partners, Contact, toggle 404, section Home hilang, dummy draft tersembunyi, role PUBG, WIB, plat putih, larangan emas pada logo, empty states, LiveBar hilang jika null.

Tidak dikerjakan: CMS, sitemap XML (boleh ditambah di task 10 jika sempat; tidak wajib), area internal, foto asli.

`MENU_FLAGS` menyalakan semua opsional agar UI bisa dicek utuh. Mematikan satu flag di `flags.ts` adalah cara mengetes 404 tanpa CMS.
