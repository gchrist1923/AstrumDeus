import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('UI kas', () => {
  it('Koreksi memakai pemilik entri, bukan hak tulis form baru', () => {
    const page = readFileSync(path.join(process.cwd(), 'app', 'internal', 'cash', 'page.tsx'), 'utf8')
    expect(page).toMatch(/canReverseCashEntry\(/)
    expect(page).toMatch(/entry\.recordedById/)
    expect(page).not.toMatch(/bisaTulis && !entry\.isCorrected/)
  })

  it('paging 5 entri dan saldo dari semua baris', () => {
    const page = readFileSync(path.join(process.cwd(), 'app', 'internal', 'cash', 'page.tsx'), 'utf8')
    expect(page).toMatch(/paginate\(/)
    expect(page).toMatch(/skip: paging\.skip/)
    expect(page).toMatch(/computeBalance\(/)
    expect(page).toMatch(/entriesAll/)
  })
})
