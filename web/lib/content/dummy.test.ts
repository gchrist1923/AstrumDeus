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
