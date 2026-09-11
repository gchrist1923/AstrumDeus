import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const kasDir = path.join(process.cwd(), 'app', 'internal', 'cash')

function baca(berkas: string): string {
  return readFileSync(path.join(kasDir, berkas), 'utf8')
}

describe('UI kas', () => {
  it('Koreksi memakai pemilik entri, bukan hak tulis form baru', () => {
    const page = baca('kas-buku.tsx')
    expect(page).toMatch(/canReverseCashEntry\(/)
    expect(page).toMatch(/entry\.recordedById/)
    expect(page).not.toMatch(/bisaTulis && !entry\.isCorrected/)
  })

  it('paging 5 entri dan saldo dari semua baris pada satu buku', () => {
    const page = baca('kas-buku.tsx')
    expect(page).toMatch(/paginate\(/)
    expect(page).toMatch(/skip: paging\.skip/)
    expect(page).toMatch(/computeBalance\(/)
    expect(page).toMatch(/entriesAll/)
    expect(page).toMatch(/requireCashBookView/)
    expect(page).toMatch(/cashBookPath/)
    expect(page).not.toMatch(/\?buku=/)
  })

  it('indeks /internal/cash mengalihkan ke rute jenis', () => {
    const indeks = baca('page.tsx')
    expect(indeks).toMatch(/redirect/)
    expect(indeks).toMatch(/cashBookPath/)
    expect(indeks).not.toMatch(/Pager/)
  })
})
