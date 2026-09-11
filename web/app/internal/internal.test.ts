import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const sumber = readFileSync(path.join(process.cwd(), 'app', 'internal', 'page.tsx'), 'utf8')

describe('ringkasan internal', () => {
  it('memuat agenda hari ini dan saldo kas, tanpa kartu laporan', () => {
    expect(sumber).toMatch(/RingkasanInternal/)
    expect(sumber).toMatch(/hariIniWib/)
    expect(sumber).toMatch(/computeBalance/)
    expect(sumber).not.toMatch(/\/internal\/reports/)
    expect(sumber).not.toMatch(/Harian dan bulanan/)
  })
})
