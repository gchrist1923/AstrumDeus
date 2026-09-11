import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(nama: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'menu', nama), 'utf8')
}

describe('CMS menu', () => {
  it('menampilkan halaman kustom terbit di form', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/customPagesForMenu/)
    expect(page).toMatch(/Halaman terbit/)
    expect(page).toMatch(/fieldName/)
  })

  it('saveMenuFlags menulis isEnabled halaman kustom', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/customPagesForMenu|customFieldName/)
    expect(actions).toMatch(/sitePage\.update/)
    expect(actions).toMatch(/isEnabled/)
  })
})
