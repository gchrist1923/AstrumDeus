import { describe, expect, it } from 'vitest'
import { chipKalender } from '@/lib/schedule/chip-kalender'

describe('chipKalender', () => {
  it('menampilkan paling banyak 2 item dan sisa selebihnya', () => {
    expect(chipKalender([])).toEqual({ tampil: [], sisa: 0 })
    expect(chipKalender(['a', 'b'])).toEqual({ tampil: ['a', 'b'], sisa: 0 })
    expect(chipKalender(['a', 'b', 'c'])).toEqual({ tampil: ['a', 'b'], sisa: 1 })
    expect(chipKalender(['a', 'b', 'c', 'd'])).toEqual({ tampil: ['a', 'b'], sisa: 2 })
  })
})
