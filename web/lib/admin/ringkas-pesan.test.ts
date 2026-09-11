import { describe, expect, it } from 'vitest'
import { ringkasPesan } from '@/lib/admin/ringkas-pesan'

describe('ringkasPesan', () => {
  it('mengembalikan string kosong', () => {
    expect(ringkasPesan('')).toBe('')
    expect(ringkasPesan('   ')).toBe('')
  })

  it('tidak memotong di bawah atau sama dengan 10 kata', () => {
    expect(ringkasPesan('satu dua')).toBe('satu dua')
    expect(ringkasPesan('satu dua tiga empat lima enam tujuh delapan sembilan sepuluh')).toBe(
      'satu dua tiga empat lima enam tujuh delapan sembilan sepuluh',
    )
  })

  it('memotong 11 kata dan menambah ...', () => {
    expect(
      ringkasPesan('satu dua tiga empat lima enam tujuh delapan sembilan sepuluh sebelas'),
    ).toBe('satu dua tiga empat lima enam tujuh delapan sembilan sepuluh...')
  })

  it('memakai newline sebagai pemisah kata', () => {
    expect(ringkasPesan('satu\ndua tiga empat lima enam tujuh delapan sembilan sepuluh sebelas')).toBe(
      'satu dua tiga empat lima enam tujuh delapan sembilan sepuluh...',
    )
  })
})
