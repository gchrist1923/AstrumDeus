import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(rel: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'media-kit', rel), 'utf8')
}

describe('CMS media kit', () => {
  it('daftar hanya tautan tambah, tanpa form di bawah list', () => {
    const list = baca('page.tsx')
    expect(list).toMatch(/\/cms\/media-kit\/new/)
    expect(list).toMatch(/Tambah aset/)
    expect(list).not.toMatch(/saveAsset/)
    expect(list).not.toMatch(/ImageUpload/)
    expect(list).not.toMatch(/fileType/)
  })

  it('halaman baru memakai form bersama dan grant create', () => {
    const baru = baca('new/page.tsx')
    expect(baru).toMatch(/requireGrant\(user, 'media-kit', 'create'\)/)
    expect(baru).toMatch(/MediaKitAssetForm/)
    expect(baca('asset-form.tsx')).toMatch(/meta=\{\{/)
    expect(baca('asset-form.tsx')).toMatch(/fileTypeName: 'fileType'/)
    expect(baca('[id]/page.tsx')).toMatch(/MediaKitAssetForm/)
  })

  it('saveAsset menimpa jenis dan ukuran dari file /media', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/describeImageMeta/)
    expect(actions).toMatch(/readMediaFile/)
    expect(actions).toMatch(/isManagedMediaPath/)
  })
})
