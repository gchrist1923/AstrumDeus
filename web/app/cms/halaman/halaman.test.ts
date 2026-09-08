import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const halamanDir = path.join(process.cwd(), 'app', 'cms', 'halaman')

function baca(berkas: string): string {
  return readFileSync(path.join(halamanDir, berkas), 'utf8')
}

describe('UI daftar halaman', () => {
  it('memakai table bukan tumpukan kartu', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/<table/)
    expect(page).toMatch(/Judul/)
    expect(page).toMatch(/Slug/)
    expect(page).toMatch(/Jenis/)
    expect(page).toMatch(/Bawaan/)
    expect(page).toMatch(/Kustom/)
    expect(page).toMatch(/Status/)
    expect(page).not.toMatch(/rounded-/)
    expect(page).toMatch(/border-2 border-border-strong/)
    expect(page).toMatch(/min-h-11/)
    expect(page).toMatch(/KELAS_FOKUS/)
    expect(page).toMatch(/font-display/)
  })

  it('mengunci toggle halaman wajib dan menampilkan Y/N', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/toggleBuiltinEnabled/)
    expect(page).toMatch(/disabled/)
    expect(page).toMatch(/mandatory/)
    expect(page).toMatch(/['"]Y['"]/)
    expect(page).toMatch(/['"]N['"]/)
  })

  it('tombol Kanvas hanya untuk kustom; bawaan Ubah isi ke form CMS', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/kind === 'custom'/)
    expect(page).toMatch(/Kanvas/)
    expect(page).toMatch(/Ubah isi/)
    expect(page).toMatch(/editHref/)
    expect(page).toMatch(/bukan kanvas/)
  })

  it('memerlukan grant halaman view', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/requireGrant\(user, 'halaman', 'view'\)/)
  })
})

describe('toggleBuiltinEnabled', () => {
  it('memakai aturan menu, sinkron SitePage dan MenuItem, menolak wajib', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/requireGrant\(user, 'menu', 'update'\)/)
    expect(actions).toMatch(/applyBuiltinToggle/)
    expect(actions).toMatch(/syncBuiltinEnabled/)
  })
})
