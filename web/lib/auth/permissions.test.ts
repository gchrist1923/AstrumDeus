import { describe, expect, it } from 'vitest'
import {
  adminTemplate,
  can,
  emptyMatrix,
  editorTemplate,
  financeTemplate,
  teamTemplate,
  unionMatrices,
} from '@/lib/auth/grants'
import {
  canAccessCms,
  canAccessInternal,
  canReadCashBook,
  canReverseCashEntry,
  canToggleMenu,
  canUploadMedia,
  canWriteCashBook,
  canWriteSchedule,
  postLoginPath,
} from '@/lib/auth/permissions'

function laporanOnly() {
  return unionMatrices([
    { ...emptyMatrix(), laporan: { view: true, create: false, update: false, delete: false } },
  ])
}

describe('canAccessCms / canAccessInternal', () => {
  it('peran hanya laporan lihat tidak masuk CMS, tidak catat kas, tapi lihat laporan', () => {
    const matrix = laporanOnly()

    expect(canAccessCms(matrix)).toBe(false)
    expect(canAccessInternal(matrix)).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(canWriteCashBook(matrix, 'operasional', 'saya', 'saya')).toBe(false)
    expect(canWriteCashBook(matrix, 'tim', 'saya', 'saya')).toBe(false)
  })

  it('Editor+Finance adalah union: berita ubah, laporan lihat, peran tidak', () => {
    const matrix = unionMatrices([editorTemplate(), financeTemplate()])

    expect(can(matrix, 'news', 'update')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(can(matrix, 'peran', 'view')).toBe(false)
    expect(canAccessCms(matrix)).toBe(true)
    expect(canAccessInternal(matrix)).toBe(true)
  })
})

describe('adminTemplate', () => {
  it('Admin mendapat CMS, internal, jadwal orang lain, dan peran', () => {
    const matrix = adminTemplate()

    expect(canAccessCms(matrix)).toBe(true)
    expect(canAccessInternal(matrix)).toBe(true)
    expect(canToggleMenu(matrix)).toBe(true)
    expect(can(matrix, 'situs', 'update')).toBe(true)
    expect(can(matrix, 'users', 'view')).toBe(true)
    expect(can(matrix, 'peran', 'view')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(canWriteSchedule(matrix, 'orang-lain', 'saya')).toBe(true)
    expect(canWriteCashBook(matrix, 'operasional', 'siapa-saja', 'saya')).toBe(true)
  })
})

describe('teamTemplate', () => {
  it('Team menulis jadwal dan kas tim miliknya, bukan operasional, bukan CMS', () => {
    const matrix = teamTemplate()

    expect(canAccessInternal(matrix)).toBe(true)
    expect(canAccessCms(matrix)).toBe(false)
    expect(canWriteSchedule(matrix, 'saya', 'saya')).toBe(true)
    expect(canWriteSchedule(matrix, 'orang-lain', 'saya')).toBe(false)
    expect(canWriteCashBook(matrix, 'tim', 'saya', 'saya')).toBe(true)
    expect(canWriteCashBook(matrix, 'tim', 'orang-lain', 'saya')).toBe(false)
    expect(canWriteCashBook(matrix, 'operasional', 'saya', 'saya')).toBe(false)
    expect(canReverseCashEntry(matrix, 'tim', 'saya', 'saya', false)).toBe(true)
    expect(canReverseCashEntry(matrix, 'tim', 'orang-lain', 'saya', false)).toBe(false)
    expect(canReverseCashEntry(matrix, 'tim', 'saya', 'saya', true)).toBe(false)
    expect(canReadCashBook(matrix, 'operasional')).toBe(false)
    expect(canReadCashBook(matrix, 'tim')).toBe(true)
    expect(canUploadMedia(matrix)).toBe(false)
  })
})

describe('financeTemplate', () => {
  it('Finance menulis kedua buku kas dan laporan, tanpa CMS', () => {
    const matrix = financeTemplate()

    expect(canWriteCashBook(matrix, 'operasional', 'siapa-saja', 'saya')).toBe(true)
    expect(canWriteCashBook(matrix, 'tim', 'orang-lain', 'saya')).toBe(true)
    expect(canReadCashBook(matrix, 'operasional')).toBe(true)
    expect(canReadCashBook(matrix, 'tim')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(canAccessCms(matrix)).toBe(false)
    expect(canWriteSchedule(matrix, 'saya', 'saya')).toBe(false)
  })
})

describe('clamp', () => {
  it('aksi tulis tanpa lihat tidak membuka CMS atau kas', () => {
    const matrix = unionMatrices([
      { ...emptyMatrix(), news: { view: false, create: true, update: true, delete: true } },
      {
        ...emptyMatrix(),
        'kas-operasional': { view: false, create: true, update: true, delete: true },
      },
    ])

    expect(can(matrix, 'news', 'create')).toBe(false)
    expect(canAccessCms(matrix)).toBe(false)
    expect(canWriteCashBook(matrix, 'operasional', 'saya', 'saya')).toBe(false)
  })
})

describe('postLoginPath', () => {
  it('tanpa CMS dan tanpa internal mendarat di /login, bukan /internal', () => {
    expect(postLoginPath(emptyMatrix(), '/cms')).toBe('/login')
    expect(postLoginPath(emptyMatrix(), '/internal')).toBe('/login')
    expect(postLoginPath(emptyMatrix(), '/news')).toBe('/login')
  })
})

describe('canUploadMedia', () => {
  it('Editor boleh unggah, Team tidak', () => {
    expect(canUploadMedia(editorTemplate())).toBe(true)
    expect(canUploadMedia(teamTemplate())).toBe(false)
  })
})
