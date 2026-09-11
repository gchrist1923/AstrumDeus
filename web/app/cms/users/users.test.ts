import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(nama: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'users', nama), 'utf8')
}

describe('UI pengguna', () => {
  it('form buat di atas daftar, dengan peran multiple', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/action=\{saveUser\}/)
    expect(page).toMatch(/name=\{`role-\$\{role\.id\}`\}/)
    expect(page).toMatch(/Tambah pengguna/)
    expect(page).toMatch(/label="Nama"/)
    expect(page).toMatch(/label="Email"/)
    expect(page).toMatch(/label="Kata sandi"/)
    expect(page.indexOf('action={saveUser}')).toBeLessThan(page.indexOf('users.map'))
  })

  it('daftar ringkas tanpa Simpan peran', () => {
    const page = baca('page.tsx')
    const actions = baca('actions.ts')
    expect(page).not.toMatch(/Simpan peran/)
    expect(page).not.toMatch(/saveUserRoles/)
    expect(actions).not.toMatch(/saveUserRoles/)
    expect(page).not.toMatch(/idPrefix=\{user\.id\}/)
    expect(page).toMatch(/toggleUserActive/)
    expect(page).toMatch(/Nonaktifkan/)
    expect(page).toMatch(/namaPeran/)
  })
})
