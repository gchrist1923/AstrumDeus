import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('seed', () => {
  it('memakai slugify bersama, bukan salinan lokal', () => {
    const seed = readFileSync(path.join(process.cwd(), 'prisma', 'seed.ts'), 'utf8')
    expect(seed).toMatch(/from '\.\.\/lib\/content\/slug'/)
    expect(seed).not.toMatch(/function slugify/)
  })
})
