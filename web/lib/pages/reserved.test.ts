import { describe, expect, it } from 'vitest'
import {
  normalizeSlug,
  RESERVED_SLUGS,
  slugIsReserved,
} from '@/lib/pages/reserved'

describe('RESERVED_SLUGS', () => {
  it('memuat slug bawaan dan sistem', () => {
    expect(RESERVED_SLUGS).toContain('news')
    expect(RESERVED_SLUGS).toContain('cms')
    expect(RESERVED_SLUGS).toContain('login')
    expect(RESERVED_SLUGS).toContain('')
    expect(RESERVED_SLUGS).toContain('index')
  })
})

describe('normalizeSlug', () => {
  it('mendelegasikan ke slugify', () => {
    expect(normalizeSlug('Grand Final')).toBe('grand-final')
    expect(normalizeSlug('  /news ')).toBe('news')
  })
})

describe('slugIsReserved', () => {
  it('menolak slug news', () => {
    expect(slugIsReserved('news')).toBe(true)
    expect(slugIsReserved('academy')).toBe(false)
  })

  it('menormalisasi sebelum cek', () => {
    expect(slugIsReserved('News')).toBe(true)
    expect(slugIsReserved(' /news ')).toBe(true)
    expect(slugIsReserved('CMS')).toBe(true)
  })

  it('menolak slug cms, login, kosong, dan index', () => {
    expect(slugIsReserved('cms')).toBe(true)
    expect(slugIsReserved('login')).toBe(true)
    expect(slugIsReserved('')).toBe(true)
    expect(slugIsReserved('index')).toBe(true)
  })

  it('menerima slug custom', () => {
    expect(slugIsReserved('about-us')).toBe(false)
    expect(slugIsReserved('academy')).toBe(false)
  })
})
