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

describe('buat halaman custom', () => {
  it('menawarkan Halaman baru hanya dengan grant create', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/can\(user.matrix, 'halaman', 'create'\)/)
    expect(page).toMatch(/Halaman baru/)
    expect(page).toMatch(/\/cms\/halaman\/new/)
  })

  it('createPage menolak slug terlarang dan memakai slug ternormalisasi', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/export async function createPage/)
    expect(actions).toMatch(/requireGrant\(user, 'halaman', 'create'\)/)
    expect(actions).toMatch(/customSlugError/)
    expect(actions).toMatch(/Slug tidak tersedia\./)
    expect(actions).toMatch(/normalizeSlug/)
    expect(actions).toMatch(/kind:\s*['"]custom['"]/)
    expect(actions).toMatch(/layout:\s*['"]\[]['"]/)
  })

  it('form baru meminta judul, slug, status, dan nav', () => {
    const page = baca(path.join('new', 'page.tsx'))
    expect(page).toMatch(/requireGrant\(user, 'halaman', 'create'\)/)
    expect(page).toMatch(/createPage/)
    expect(page).toMatch(/Field/)
    expect(page).toMatch(/KELAS_KONTROL/)
    expect(page).toMatch(/name="title"/)
    expect(page).toMatch(/name="slug"/)
    expect(page).toMatch(/name="status"/)
    expect(page).toMatch(/name="showInNav"/)
    expect(page).toMatch(/Draf|draf/)
    expect(page).toMatch(/Terbit|terbit/)
    expect(page).not.toMatch(/rounded-/)
  })
})

describe('saveLayout', () => {
  it('memvalidasi kisi dan memerlukan grant update', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/export async function saveLayout/)
    expect(actions).toMatch(/requireGrant\(user, 'halaman', 'update'\)/)
    expect(actions).toMatch(/assertValidLayout/)
  })
})

describe('halaman [id]', () => {
  it('bawaan bukan kanvas; kustom memakai PageCanvas', () => {
    const page = baca(path.join('[id]', 'page.tsx'))
    expect(page).toMatch(/shouldEditOnCanvas/)
    expect(page).toMatch(/Isi halaman ini diubah lewat form CMS, bukan kanvas\./)
    expect(page).toMatch(/Ubah isi/)
    expect(page).toMatch(/PageCanvas/)
    expect(page).toMatch(/saveLayout/)
    expect(page).toMatch(/updateCustomPage/)
    expect(page).toMatch(/defaultChecked/)
    expect(page).not.toMatch(/rounded-/)
  })
})
