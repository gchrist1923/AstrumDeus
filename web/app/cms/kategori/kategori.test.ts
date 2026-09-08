import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('UI kategori', () => {
  it('tidak menawarkan hapus keras', () => {
    const dir = path.join(process.cwd(), 'app', 'cms', 'kategori')
    const page = readFileSync(path.join(dir, 'page.tsx'), 'utf8')
    const actions = readFileSync(path.join(dir, 'actions.ts'), 'utf8')
    expect(page).not.toMatch(/Hapus/)
    expect(actions).not.toMatch(/\.delete\(/)
  })
})
