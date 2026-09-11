import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), 'utf8')
}

describe('form CMS view-only', () => {
  it('mengunci kontrol saat tidak ada hak ubah', () => {
    expect(baca('app/cms/news/news-form.tsx')).toMatch(/disabled=\{!canSave\}/)
    expect(baca('app/cms/players/player-form.tsx')).toMatch(/disabled=\{!canSave\}/)
    expect(baca('app/cms/matches/match-form.tsx')).toMatch(/disabled=\{!canSave\}/)
    expect(baca('app/cms/settings/page.tsx')).toMatch(/disabled=\{!bisaUbah\}/)
    expect(baca('app/cms/partners/[id]/page.tsx')).toMatch(/disabled=\{!bisaUbah\}/)
    expect(baca('app/cms/media-kit/asset-form.tsx')).toMatch(/disabled=\{!canSave\}/)
  })
})
