import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(rel: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'kategori', rel), 'utf8')
}

describe('UI kategori', () => {
  it('hub hanya tiga tautan jenis, tanpa daftar item', () => {
    const hub = baca('page.tsx')
    expect(hub).toMatch(/\/cms\/kategori\/turnamen/)
    expect(hub).toMatch(/\/cms\/kategori\/kas/)
    expect(hub).toMatch(/\/cms\/kategori\/berita/)
    expect(hub).not.toMatch(/deactivateTournament/)
    expect(hub).not.toMatch(/prisma\.tournament\.findMany/)
    expect(hub).not.toMatch(/mx-auto/)
  })

  it('judul detail memakai ikon kembali di samping judul', () => {
    for (const halaman of ['turnamen/page.tsx', 'kas/page.tsx', 'berita/page.tsx']) {
      const page = baca(halaman)
      expect(page).toMatch(/KategoriJudul/)
      expect(page).not.toMatch(/Kembali ke kategori/)
    }

    const judul = readFileSync(
      path.join(process.cwd(), 'components', 'admin', 'kategori-judul.tsx'),
      'utf8',
    )
    expect(judul).toMatch(/aria-label="Kembali ke kategori"/)
    expect(judul).toMatch(/<svg/)
    expect(judul).toMatch(/min-h-11 min-w-11/)
    expect(judul).toMatch(/href="\/cms\/kategori"/)
    expect(judul).toMatch(/rtl:-scale-x-100/)
    expect(judul).not.toMatch(/>Kembali ke kategori</)
  })

  it('hapus ditolak jika masih ada relasi', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/deleteTournament/)
    expect(actions).toMatch(/playerStat\.count/)
    expect(actions).toMatch(/match\.count/)
    expect(actions).toMatch(/cashEntry\.count/)
    expect(actions).toMatch(/newsPost\.count/)
    expect(baca('turnamen/page.tsx')).toMatch(/Hapus turnamen ini\?/)
    expect(baca('kas/page.tsx')).toMatch(/Hapus kategori ini\?/)
    expect(baca('berita/page.tsx')).toMatch(/Hapus kategori ini\?/)
  })
})
