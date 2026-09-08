import { describe, expect, it } from 'vitest'
import { isPublished } from '@/lib/content/publication'

const SEKARANG = Date.parse('2026-09-07T15:00:00+07:00')

describe('isPublished', () => {
  it('menyembunyikan draft', () => {
    expect(isPublished('draft', '2026-09-01T09:00:00+07:00', SEKARANG)).toBe(false)
  })

  it('menyembunyikan terbit yang jadwalnya masih di masa depan', () => {
    expect(isPublished('published', '2026-12-01T09:00:00+07:00', SEKARANG)).toBe(false)
  })

  it('menampilkan terbit yang waktunya sudah lewat', () => {
    expect(isPublished('published', '2026-09-04T09:00:00+07:00', SEKARANG)).toBe(true)
  })
})
