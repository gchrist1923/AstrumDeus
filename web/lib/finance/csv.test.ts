import { describe, expect, it } from 'vitest'
import { cashEntriesToCsv } from '@/lib/finance/csv'

describe('cashEntriesToCsv', () => {
  it('menghasilkan header dan baris ter-escape', () => {
    const csv = cashEntriesToCsv([
      {
        date: '2026-09-07',
        direction: 'masuk',
        amount: 15000,
        category: 'Sponsor',
        description: 'Dana "utama", Q3',
      },
    ])

    expect(csv).toBe(
      'tanggal,arah,jumlah,kategori,uraian\n2026-09-07,masuk,15000,Sponsor,"Dana ""utama"", Q3"',
    )
  })
})
