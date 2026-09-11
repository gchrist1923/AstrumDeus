import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('CMS Situs hero', () => {
  it('form punya grup Beranda dan field hero', () => {
    const sumber = readFileSync(path.join(process.cwd(), 'app', 'cms', 'settings', 'page.tsx'), 'utf8')
    expect(sumber).toMatch(/Beranda/)
    expect(sumber).toMatch(/heroEyebrow/)
    expect(sumber).toMatch(/heroTitle/)
    expect(sumber).toMatch(/heroTagline/)
    expect(sumber).toMatch(/heroImage/)
    expect(sumber).toMatch(/heroImageAlt/)
  })

  it('simpan menulis dan melepas gambar hero', () => {
    const sumber = readFileSync(path.join(process.cwd(), 'app', 'cms', 'settings', 'actions.ts'), 'utf8')
    expect(sumber).toMatch(/heroTitle/)
    expect(sumber).toMatch(/heroImage/)
    expect(sumber).toMatch(/releaseMediaPath\(existing\?\.heroImage/)
  })
})
