import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const jadwalDir = path.join(process.cwd(), 'app', 'internal', 'schedule')

function baca(berkas: string): string {
  return readFileSync(path.join(jadwalDir, berkas), 'utf8')
}

describe('jadwal kalender', () => {
  it('kisi bulan dan query hari/id mengisi panel', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/monthGrid/)
    expect(page).toMatch(/grid-cols-7/)
    expect(page).toMatch(/hari=/)
    expect(page).toMatch(/id=/)
    expect(page).toMatch(/autoFocus/)
    expect(page).toMatch(/Hari ini/)
    expect(page).not.toMatch(/Event baru/)
  })

  it('saveEvent mempertahankan bulan dan peringatan tumpang', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/peringatan.*tumpang/)
    expect(actions).toMatch(/qs\.set\('bulan'/)
  })

  it('hapus event memakai dialog konfirmasi', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/ConfirmSubmit/)
    expect(page).toMatch(/Hapus event ini\?/)
  })
})
