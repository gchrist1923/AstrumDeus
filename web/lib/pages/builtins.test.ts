import { describe, expect, it } from 'vitest'
import { applyBuiltinToggle, BUILTIN_PAGES } from '@/lib/pages/builtins'
import { RESERVED_SLUGS } from '@/lib/pages/reserved'

describe('BUILTIN_PAGES', () => {
  it('memuat tujuh halaman bawaan', () => {
    expect(BUILTIN_PAGES).toHaveLength(7)
    expect(BUILTIN_PAGES.filter((p) => p.mandatory).map((p) => p.menuKey)).toEqual([
      'home',
      'news',
      'contact',
    ])
  })

  it('menandai semua sebagai builtin, bukan custom', () => {
    expect(BUILTIN_PAGES.every((page) => page.kind === 'builtin')).toBe(true)
    expect(BUILTIN_PAGES.some((page) => page.kind === 'custom')).toBe(false)
  })

  it('tidak men-seed slug terlarang sebagai halaman custom', () => {
    const customSlugs = BUILTIN_PAGES.filter((page) => page.kind === 'custom').map((page) => page.slug)
    for (const slug of RESERVED_SLUGS) {
      expect(customSlugs).not.toContain(slug)
    }
  })
})

describe('applyBuiltinToggle', () => {
  it('menolak mematikan halaman wajib', () => {
    expect(() => applyBuiltinToggle(true, false)).toThrow('Menu wajib tidak bisa dimatikan.')
  })

  it('mengizinkan mengubah halaman opsional', () => {
    expect(applyBuiltinToggle(false, false)).toBe(false)
    expect(applyBuiltinToggle(false, true)).toBe(true)
  })
})
