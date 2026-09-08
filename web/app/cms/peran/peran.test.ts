import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const peranDir = path.join(process.cwd(), 'app', 'cms', 'peran')

function baca(berkas: string): string {
  return readFileSync(path.join(peranDir, berkas), 'utf8')
}

describe('UI peran', () => {
  it('daftar menautkan nama peran dan tombol salin templat', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/\/cms\/peran\/\$\{/)
    expect(page).toMatch(/Salin Editor/)
    expect(page).toMatch(/Salin Team/)
    expect(page).toMatch(/Salin Finance/)
    expect(page).toMatch(/copyTemplate\.bind\(null, 'editor'\)/)
    expect(page).not.toMatch(/name="template"/)
  })

  it('daftar menampilkan slug di samping nama', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/role\.slug/)
    expect(page).toMatch(/text-small text-content-muted/)
  })

  it('tidak menawarkan Hapus pada peran Admin', () => {
    const page = baca('page.tsx')
    const detail = baca('[id]/page.tsx')
    expect(page).toMatch(/!role\.isAdmin/)
    expect(detail).toMatch(/!role\.isAdmin/)
    expect(page).toMatch(/Hapus/)
    expect(detail).toMatch(/Hapus/)
  })

  it('matriks adalah table dengan checkbox 44px', () => {
    const detail = baca('[id]/page.tsx')
    expect(detail).toMatch(/<table/)
    expect(detail).toMatch(/<th/)
    expect(detail).toMatch(/Lihat/)
    expect(detail).toMatch(/Tambah/)
    expect(detail).toMatch(/Ubah/)
    expect(detail).toMatch(/Hapus/)
    expect(detail).toMatch(/min-h-11 min-w-11/)
    expect(detail).toMatch(/type="checkbox"/)
    expect(detail).not.toMatch(/rounded-/)
  })
})

describe('UI penugasan pengguna', () => {
  it('checkbox peran dari AccessRole bukan ROLES hardcoded', () => {
    const page = readFileSync(path.join(process.cwd(), 'app', 'cms', 'users', 'page.tsx'), 'utf8')
    expect(page).not.toMatch(/ROLES\.map/)
    expect(page).toMatch(/accessRole/)
    expect(page).toMatch(/saveUserRoles/)
  })
})

describe('hapus peran', () => {
  it('sinkron JSON leftover setelah hapus AccessRole', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/userAccessRole\.findMany/)
    expect(actions).toMatch(/rewriteLegacyRolesForUsers/)
  })
})
