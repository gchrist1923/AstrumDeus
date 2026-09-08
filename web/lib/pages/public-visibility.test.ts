import { describe, expect, it } from 'vitest'
import {
  customSlugError,
  extraNavFromPages,
  isPublicCustomPage,
} from '@/lib/pages/public-visibility'

describe('isPublicCustomPage', () => {
  it('hanya custom terbit dan nyala yang publik', () => {
    expect(
      isPublicCustomPage({ kind: 'custom', status: 'published', isEnabled: true }),
    ).toBe(true)
  })

  it('draft bukan publik', () => {
    expect(
      isPublicCustomPage({ kind: 'custom', status: 'draft', isEnabled: true }),
    ).toBe(false)
  })

  it('isEnabled false bukan publik', () => {
    expect(
      isPublicCustomPage({ kind: 'custom', status: 'published', isEnabled: false }),
    ).toBe(false)
  })

  it('halaman bawaan bukan rute custom publik', () => {
    expect(
      isPublicCustomPage({ kind: 'builtin', status: 'published', isEnabled: true }),
    ).toBe(false)
  })
})

describe('customSlugError', () => {
  it('menolak slug terlarang dengan pesan tetap', () => {
    expect(customSlugError('news')).toBe('Slug tidak tersedia.')
    expect(customSlugError('CMS')).toBe('Slug tidak tersedia.')
    expect(customSlugError('')).toBe('Slug tidak tersedia.')
  })

  it('menerima slug custom', () => {
    expect(customSlugError('academy')).toBeNull()
  })
})

describe('extraNavFromPages', () => {
  const academy = {
    title: 'Academy',
    slug: 'academy',
    kind: 'custom',
    status: 'published',
    isEnabled: true,
    showInNav: true,
  }

  it('hanya halaman publik yang showInNav', () => {
    expect(
      extraNavFromPages([
        academy,
        { ...academy, slug: 'draft', title: 'Draf', status: 'draft' },
        { ...academy, slug: 'off', title: 'Mati', isEnabled: false },
        { ...academy, slug: 'sembunyi', title: 'Sembunyi', showInNav: false },
      ]),
    ).toEqual([{ label: 'Academy', href: '/academy' }])
  })
})
