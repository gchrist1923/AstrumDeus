import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/content/slug'

describe('slugify', () => {
  it('membuat slug unik-siap dari nama', () => {
    expect(slugify('Grand Final PMNC')).toBe('grand-final-pmnc')
    expect(slugify('  Recap!!! ')).toBe('recap')
  })
})
