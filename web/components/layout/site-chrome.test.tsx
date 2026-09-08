import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('SiteChrome extra nav', () => {
  it('meneruskan extra dari layout ke header dan footer', () => {
    const chrome = readFileSync(
      path.join(process.cwd(), 'components', 'layout', 'site-chrome.tsx'),
      'utf8',
    )
    const header = readFileSync(
      path.join(process.cwd(), 'components', 'layout', 'site-header.tsx'),
      'utf8',
    )
    const footer = readFileSync(
      path.join(process.cwd(), 'components', 'layout', 'site-footer.tsx'),
      'utf8',
    )
    const layout = readFileSync(path.join(process.cwd(), 'app', 'layout.tsx'), 'utf8')

    expect(chrome).toMatch(/extra/)
    expect(chrome).toMatch(/SiteHeader/)
    expect(chrome).toMatch(/SiteFooter/)
    expect(header).toMatch(/mergeNav/)
    expect(header).toMatch(/getVisibleNavItems\(flags\)/)
    expect(footer).toMatch(/mergeNav/)
    expect(footer).toMatch(/getVisibleNavItems\(flags\)/)
    expect(layout).toMatch(/extraNavFromPages|showInNav/)
    expect(layout).toMatch(/extra=/)
  })
})
