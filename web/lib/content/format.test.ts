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
