import { describe, expect, it } from 'vitest'
import { buildReversal, computeBalance, reportForPeriod, signedAmount } from '@/lib/finance/report'

describe('signedAmount', () => {
  it('masuk positif, keluar negatif', () => {
    expect(signedAmount('masuk', 1000)).toBe(1000)
    expect(signedAmount('keluar', 400)).toBe(-400)
  })
})

describe('computeBalance', () => {
  it('menjumlahkan opening plus semua entri, termasuk pembalik', () => {
    const saldo = computeBalance(10_000, [
      { direction: 'masuk', amount: 5_000 },
      { direction: 'keluar', amount: 2_000 },
      { direction: 'keluar', amount: 5_000 },
    ])

    expect(saldo).toBe(8_000)
  })
})

describe('buildReversal', () => {
  it('membuat entri lawan dengan jumlah sama', () => {
    expect(buildReversal({ id: 'e1', direction: 'keluar', amount: 2500 })).toEqual({
      direction: 'masuk',
      amount: 2500,
      correctsEntryId: 'e1',
    })
  })
})

describe('reportForPeriod', () => {
  it('menghitung masuk, keluar, dan neto di rentang tanggal', () => {
    const laporan = reportForPeriod(
      [
        { date: '2026-09-07T00:00:00.000Z', direction: 'masuk', amount: 8000 },
        { date: '2026-09-07T03:00:00.000Z', direction: 'keluar', amount: 3000 },
        { date: '2026-09-08T00:00:00.000Z', direction: 'masuk', amount: 1000 },
      ],
      '2026-09-07T00:00:00.000Z',
      '2026-09-08T00:00:00.000Z',
    )

    expect(laporan).toEqual({ masuk: 8000, keluar: 3000, net: 5000, count: 2 })
  })
})
