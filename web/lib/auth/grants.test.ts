import { describe, expect, it } from 'vitest'
import {
  adminTemplate,
  can,
  clampGrant,
  editorTemplate,
  EMPTY_GRANT,
  emptyMatrix,
  financeTemplate,
  isAdminMatrixReduced,
  teamTemplate,
  unionMatrices,
} from '@/lib/auth/grants'

describe('clampGrant', () => {
  it('aksi tulis tanpa lihat di-clamp', () => {
    expect(clampGrant({ view: false, create: true, update: true, delete: true })).toEqual(EMPTY_GRANT)
  })

  it('mempertahankan aksi tulis jika lihat true', () => {
    expect(clampGrant({ view: true, create: true, update: false, delete: true })).toEqual({
      view: true,
      create: true,
      update: false,
      delete: true,
    })
  })
})

describe('unionMatrices', () => {
  it('peran hanya laporan lihat tidak bisa buka berita atau catat kas', () => {
    const matrix = unionMatrices([
      { ...emptyMatrix(), laporan: { view: true, create: false, update: false, delete: false } },
    ])
    expect(can(matrix, 'news', 'view')).toBe(false)
    expect(can(matrix, 'kas-operasional', 'create')).toBe(false)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
  })

  it('Editor+Finance adalah union', () => {
    const matrix = unionMatrices([editorTemplate(), financeTemplate()])
    expect(can(matrix, 'news', 'update')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(can(matrix, 'peran', 'view')).toBe(false)
  })

  it('input kosong mengembalikan emptyMatrix', () => {
    expect(unionMatrices([])).toEqual(emptyMatrix())
  })

  it('aksi tulis tanpa lihat tidak bocor lewat unionMatrices/can', () => {
    const matrix = unionMatrices([
      { ...emptyMatrix(), news: { view: false, create: true, update: true, delete: true } },
    ])
    expect(can(matrix, 'news', 'view')).toBe(false)
    expect(can(matrix, 'news', 'create')).toBe(false)
    expect(can(matrix, 'news', 'update')).toBe(false)
    expect(can(matrix, 'news', 'delete')).toBe(false)
  })
})

describe('isAdminMatrixReduced', () => {
  it('mengurangi matriks Admin terdeteksi', () => {
    const next = adminTemplate()
    next.news.view = false
    expect(isAdminMatrixReduced(next)).toBe(true)
  })

  it('matriks Admin penuh tidak terdeteksi sebagai dikurangi', () => {
    expect(isAdminMatrixReduced(adminTemplate())).toBe(false)
  })
})

describe('editorTemplate', () => {
  it('CRUD penuh pada modul konten CMS', () => {
    const matrix = editorTemplate()
    expect(can(matrix, 'news', 'delete')).toBe(true)
    expect(can(matrix, 'kategori', 'create')).toBe(true)
    expect(can(matrix, 'halaman', 'update')).toBe(true)
  })

  it('tidak akses menu, situs, users, peran, jadwal, kas, laporan', () => {
    const matrix = editorTemplate()
    expect(can(matrix, 'menu', 'view')).toBe(false)
    expect(can(matrix, 'peran', 'view')).toBe(false)
    expect(can(matrix, 'jadwal', 'view')).toBe(false)
    expect(can(matrix, 'kas-operasional', 'view')).toBe(false)
    expect(can(matrix, 'laporan', 'view')).toBe(false)
  })
})

describe('teamTemplate', () => {
  it('jadwal lihat+ubah tanpa tambah/hapus', () => {
    const matrix = teamTemplate()
    expect(can(matrix, 'jadwal', 'view')).toBe(true)
    expect(can(matrix, 'jadwal', 'update')).toBe(true)
    expect(can(matrix, 'jadwal', 'create')).toBe(false)
    expect(can(matrix, 'jadwal', 'delete')).toBe(false)
  })

  it('kas-tim lihat+tambah+ubah dan tidak CMS', () => {
    const matrix = teamTemplate()
    expect(can(matrix, 'kas-tim', 'create')).toBe(true)
    expect(can(matrix, 'news', 'view')).toBe(false)
    expect(can(matrix, 'kas-operasional', 'view')).toBe(false)
  })
})

describe('financeTemplate', () => {
  it('kas operasional dan kas tim penuh tulis', () => {
    const matrix = financeTemplate()
    expect(can(matrix, 'kas-operasional', 'update')).toBe(true)
    expect(can(matrix, 'kas-tim', 'create')).toBe(true)
  })

  it('laporan lihat saja, jadwal lihat saja, tidak CMS', () => {
    const matrix = financeTemplate()
    expect(can(matrix, 'laporan', 'view')).toBe(true)
    expect(can(matrix, 'laporan', 'create')).toBe(false)
    expect(can(matrix, 'jadwal', 'view')).toBe(true)
    expect(can(matrix, 'jadwal', 'update')).toBe(false)
    expect(can(matrix, 'news', 'view')).toBe(false)
  })
})

describe('adminTemplate', () => {
  it('semua modul dan aksi true', () => {
    const matrix = adminTemplate()
    expect(can(matrix, 'peran', 'delete')).toBe(true)
    expect(can(matrix, 'kas-operasional', 'create')).toBe(true)
    expect(can(matrix, 'laporan', 'view')).toBe(true)
  })
})
