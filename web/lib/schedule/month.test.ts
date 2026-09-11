import { describe, expect, it } from 'vitest'
import { monthGrid, parseBulan } from '@/lib/schedule/month'

describe('parseBulan', () => {
  it('memakai YYYY-MM atau jatuh ke sekarang', () => {
    expect(parseBulan('2026-09', new Date('2026-01-15T00:00:00'))).toEqual({ year: 2026, month: 9 })
    expect(parseBulan(undefined, new Date('2026-03-02T00:00:00'))).toEqual({ year: 2026, month: 3 })
  })
})

describe('monthGrid', () => {
  it('kisi Senin–Minggu; Agustus 2026 punya 31 hari dalam bulan', () => {
    const cells = monthGrid(2026, 8)
    expect(cells.length % 7).toBe(0)
    expect(cells.filter((cell) => cell.inMonth)).toHaveLength(31)
    expect(cells[0]?.iso).toBe('2026-07-27')
    expect(cells.filter((cell) => cell.inMonth).at(-1)?.iso).toBe('2026-08-31')
  })
})
