import { describe, expect, it } from 'vitest'
import { fromDateInput } from '@/lib/datetime'
import { hariIniWib } from '@/lib/schedule/hari-ini'

describe('hariIniWib', () => {
  it('rentang 24 jam WIB dari instans yang diberikan', () => {
    const now = new Date('2026-09-11T10:00:00.000Z')
    const { iso, awal, akhir } = hariIniWib(now)
    expect(iso).toBe('2026-09-11')
    expect(awal).toEqual(fromDateInput('2026-09-11'))
    expect(akhir.getTime() - awal.getTime()).toBe(24 * 60 * 60 * 1000)
  })

  it('pindah tanggal setelah tengah malam WIB', () => {
    const now = new Date('2026-09-11T17:00:00.000Z')
    expect(hariIniWib(now).iso).toBe('2026-09-12')
  })
})
