import { describe, expect, it } from 'vitest'
import { DEFAULT_PER_PAGE, pageFromQuery, paginate } from '@/lib/admin/paginate'

describe('paginate', () => {
  it('20 item jadi 4 halaman isi 5', () => {
    const hasil = paginate({ total: 20, page: 1 })
    expect(DEFAULT_PER_PAGE).toBe(5)
    expect(hasil.pageCount).toBe(4)
    expect(hasil.take).toBe(5)
    expect(hasil.skip).toBe(0)
    expect(hasil.hasPrev).toBe(false)
    expect(hasil.hasNext).toBe(true)
  })

  it('halaman 2 skip 5', () => {
    const hasil = paginate({ total: 20, page: 2 })
    expect(hasil.page).toBe(2)
    expect(hasil.skip).toBe(5)
  })

  it('mengklem hal di bawah 1 dan di atas last', () => {
    expect(paginate({ total: 20, page: 0 }).page).toBe(1)
    expect(paginate({ total: 20, page: 99 }).page).toBe(4)
  })

  it('total 0 tetap satu halaman kosong', () => {
    const hasil = paginate({ total: 0, page: 3 })
    expect(hasil.pageCount).toBe(1)
    expect(hasil.page).toBe(1)
    expect(hasil.skip).toBe(0)
  })

  it('pageFromQuery baca angka atau 1', () => {
    expect(pageFromQuery('3')).toBe(3)
    expect(pageFromQuery(undefined)).toBe(1)
    expect(pageFromQuery('x')).toBe(1)
  })
})
