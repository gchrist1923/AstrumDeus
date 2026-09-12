import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(...bagian: string[]): string {
  return readFileSync(path.join(process.cwd(), ...bagian), 'utf8')
}

describe('judul form CMS', () => {
  it('form edit/baru punya judul halaman', () => {
    expect(baca('app', 'cms', 'players', 'player-form.tsx')).toMatch(/Pemain baru/)
    expect(baca('app', 'cms', 'players', 'player-form.tsx')).toMatch(/Ubah pemain/)
    expect(baca('app', 'cms', 'matches', 'match-form.tsx')).toMatch(/Pertandingan baru/)
    expect(baca('app', 'cms', 'matches', 'match-form.tsx')).toMatch(/Ubah pertandingan/)
    expect(baca('app', 'cms', 'media-kit', 'asset-form.tsx')).toMatch(/Aset baru/)
    expect(baca('app', 'cms', 'media-kit', 'asset-form.tsx')).toMatch(/Ubah aset/)
    expect(baca('app', 'cms', 'partners', '[id]', 'page.tsx')).toMatch(/Ubah partner/)
    expect(baca('app', 'cms', 'menu', 'page.tsx')).toMatch(/<h2[^>]*>Menu<\/h2>/)
  })
})
