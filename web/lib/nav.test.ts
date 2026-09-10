import { describe, expect, it } from 'vitest'
import { getVisibleNavItems, isMenuEnabled, mergeNav, NAV_ITEMS } from '@/lib/nav'

describe('NAV_ITEMS', () => {
  it('memuat tujuh menu sesuai spec', () => {
    expect(NAV_ITEMS).toHaveLength(7)
  })

  it('menandai hanya Home, News dan Contact sebagai wajib', () => {
    const wajib = NAV_ITEMS.filter((item) => item.mandatory).map((item) => item.key)

    expect(wajib).toEqual(['home', 'news', 'contact'])
  })

  it('menyusun menu dalam urutan tampil dari spec', () => {
    expect(NAV_ITEMS.map((item) => item.key)).toEqual([
      'home',
      'roster',
      'matches',
      'news',
      'media-kit',
      'partners',
      'contact',
    ])
  })

  it('memberi label Bahasa Indonesia atau nama halaman, tanpa string kosong', () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.trim().length).toBeGreaterThan(0)
      expect(item.href.startsWith('/')).toBe(true)
    }
  })
})

describe('getVisibleNavItems', () => {
  it('hanya menampilkan menu wajib saat tidak ada flag', () => {
    expect(getVisibleNavItems().map((item) => item.key)).toEqual(['home', 'news', 'contact'])
  })

  it('menampilkan menu opsional yang flag-nya menyala', () => {
    const terlihat = getVisibleNavItems({ roster: true, matches: true }).map((item) => item.key)

    expect(terlihat).toEqual(['home', 'roster', 'matches', 'news', 'contact'])
  })

  it('menyembunyikan menu opsional yang flag-nya mati', () => {
    expect(getVisibleNavItems({ partners: false }).map((item) => item.key)).not.toContain('partners')
  })

  it('mengabaikan usaha mematikan menu wajib', () => {
    expect(getVisibleNavItems({ home: false, news: false }).map((item) => item.key)).toEqual([
      'home',
      'news',
      'contact',
    ])
  })

  it('mempertahankan urutan spec meski flag diberikan tidak berurutan', () => {
    const terlihat = getVisibleNavItems({ partners: true, roster: true }).map((item) => item.key)

    expect(terlihat).toEqual(['home', 'roster', 'news', 'partners', 'contact'])
  })
})

describe('isMenuEnabled', () => {
  it('selalu true untuk menu wajib', () => {
    expect(isMenuEnabled('home')).toBe(true)
    expect(isMenuEnabled('contact', { contact: false })).toBe(true)
  })

  it('mengikuti flag untuk menu opsional', () => {
    expect(isMenuEnabled('roster')).toBe(false)
    expect(isMenuEnabled('roster', { roster: true })).toBe(true)
  })
})

describe('mergeNav', () => {
  it('mengembalikan base saja jika extra kosong', () => {
    const base = getVisibleNavItems()

    expect(mergeNav(base, [])).toEqual(base.map(({ label, href }) => ({ label, href })))
  })

  it('menambahkan extra setelah tujuh menu bawaan', () => {
    const base = getVisibleNavItems({ roster: true })
    const merged = mergeNav(base, [{ label: 'Academy', href: '/academy' }])

    expect(merged.map((item) => item.href)).toEqual([
      '/',
      '/roster',
      '/news',
      '/contact',
      '/academy',
    ])
    expect(merged.at(-1)).toEqual({ label: 'Academy', href: '/academy' })
  })

  it('tidak mengubah NAV_ITEMS', () => {
    expect(NAV_ITEMS).toHaveLength(7)
    mergeNav(getVisibleNavItems(), [{ label: 'Academy', href: '/academy' }])
    expect(NAV_ITEMS).toHaveLength(7)
  })
})
