import { describe, expect, it } from 'vitest'
import { contrastRatio, relativeLuminance } from '@/lib/contrast'

describe('relativeLuminance', () => {
  it('mengembalikan 0 untuk hitam dan 1 untuk putih', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5)
  })

  it('menolak nilai yang bukan hex enam digit', () => {
    expect(() => relativeLuminance('#FFF')).toThrow(/hex enam digit/)
    expect(() => relativeLuminance('rgba(255,255,255,.7)')).toThrow(/hex enam digit/)
  })
})

describe('contrastRatio', () => {
  it('mengembalikan 21 untuk putih di atas hitam', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 2)
  })

  it('mengembalikan 1 untuk dua warna yang sama', () => {
    expect(contrastRatio('#212121', '#212121')).toBeCloseTo(1, 5)
  })

  it('tidak peduli urutan argumen', () => {
    expect(contrastRatio('#F0B429', '#212121')).toBeCloseTo(contrastRatio('#212121', '#F0B429'), 5)
  })

  it('menghitung aksen emas di atas surface-raised sebesar 8,6:1', () => {
    expect(contrastRatio('#F0B429', '#212121')).toBeCloseTo(8.6, 1)
  })
})
