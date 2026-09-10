import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(nama: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'inbox', nama), 'utf8')
}

describe('UI kotak masuk', () => {
  it('memakai tabel, search q, paging, dan hapus', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/<table/)
    expect(page).toMatch(/name="q"/)
    expect(page).toMatch(/paginate\(/)
    expect(page).toMatch(/subject: \{ contains:/)
    expect(page).toMatch(/email: \{ contains:/)
    expect(page).toMatch(/name: \{ contains:/)
    expect(page).not.toMatch(/message: \{ contains:/)
    expect(page).toMatch(/deleteInboxMessage/)
    expect(page).toMatch(/Hapus pesan ini\?/)
    expect(page).toMatch(/max-md:block/)
    expect(page).not.toMatch(/min-w-\[60rem\]/)
    const actions = baca('actions.ts')
    expect(actions).toMatch(/requireGrant\(user, 'inbox', 'delete'\)/)
    expect(actions).toMatch(/contactMessage\.delete/)
  })
})
