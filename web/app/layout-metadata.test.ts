import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

describe('metadata situs', () => {
  it('generateMetadata memakai helper, bukan literal judul/deskripsi', () => {
    const sumber = readFileSync(path.join(root, 'app', 'layout.tsx'), 'utf8')

    expect(sumber).toMatch(/getPublicSiteSettings/)
    expect(sumber).not.toMatch(/getSiteBranding/)
    expect(sumber).toMatch(/title:\s*situs\.metaTitle/)
    expect(sumber).toMatch(/description:\s*situs\.metaDescription/)
    expect(sumber).toMatch(/icon:\s*situs\.favicon/)
    expect(sumber).toMatch(/siteName=\{situs\.siteName\}/)
    expect(sumber).toMatch(/logoSrc=\{situs\.logo\}/)
    expect(sumber).not.toMatch(/title: 'Astrum Deus'/)
  })

  it('tidak menyisakan favicon.ico statis yang mengalahkan CMS', () => {
    expect(existsSync(path.join(root, 'app', 'favicon.ico'))).toBe(false)
  })
})
