import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(nama: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'inbox', nama), 'utf8')
}

describe('UI kotak masuk', () => {
  it('memakai tabel, search q, paging, cuplikan, dan hapus tanpa dibaca/selesai', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/<table/)
    expect(page).toMatch(/name="q"/)
    expect(page).toMatch(/paginate\(/)
    expect(page).toMatch(/subject: \{ contains:/)
    expect(page).toMatch(/email: \{ contains:/)
    expect(page).toMatch(/name: \{ contains:/)
    expect(page).not.toMatch(/message: \{ contains:/)
    expect(page).toMatch(/ringkasPesan/)
    expect(page).toMatch(/\/cms\/inbox\/\$\{/)
    expect(page).toMatch(/deleteInboxMessage/)
    expect(page).toMatch(/Hapus pesan ini\?/)
    expect(page).toMatch(/max-md:block/)
    expect(page).not.toMatch(/min-w-\[60rem\]/)
    expect(page).not.toMatch(/Dibaca/)
    expect(page).not.toMatch(/Selesai/)
    expect(page).not.toMatch(/updateInboxStatus/)
    const actions = baca('actions.ts')
    expect(actions).toMatch(/requireGrant\(user, 'inbox', 'delete'\)/)
    expect(actions).toMatch(/contactMessage\.delete/)
    expect(actions).toMatch(/tandaiInboxDibaca/)
    expect(actions).toMatch(/status: 'baru'/)
  })

  it('halaman detail memakai pre-wrap dan menandai dibaca', () => {
    const detail = baca('[id]/page.tsx')
    expect(detail).toMatch(/whitespace-pre-wrap/)
    expect(detail).toMatch(/tandaiInboxDibaca/)
    expect(detail).toMatch(/Hapus pesan ini\?/)
  })
})
