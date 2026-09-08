import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const sumber = readFileSync(path.join(process.cwd(), 'app', '[slug]', 'page.tsx'), 'utf8')

describe('rute publik [slug]', () => {
  it('bukan catch-all dan menolak reserved, draf, serta halaman mati', () => {
    expect(sumber).toMatch(/slugIsReserved/)
    expect(sumber).toMatch(/notFound\(\)/)
    expect(sumber).toMatch(/isPublicCustomPage|kind !== 'custom'|status !== 'published'|!page.isEnabled/)
    expect(sumber).toMatch(/PageBlocks/)
    expect(sumber).not.toMatch(/\[\.\.\.slug\]/)
  })
})
