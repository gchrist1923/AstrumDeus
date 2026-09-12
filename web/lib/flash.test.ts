import { describe, expect, it } from 'vitest'
import { FLASH_KEYS, flashDariQuery, pathDenganFlash } from '@/lib/flash'

describe('flashDariQuery', () => {
  it('memetakan ok simpan/ubah/hapus', () => {
    expect(flashDariQuery({ ok: 'simpan' })).toEqual({
      jenis: 'sukses',
      pesan: 'Tersimpan.',
    })
    expect(flashDariQuery({ ok: 'ubah' })).toEqual({
      jenis: 'sukses',
      pesan: 'Perubahan tersimpan.',
    })
    expect(flashDariQuery({ ok: 'hapus' })).toEqual({
      jenis: 'sukses',
      pesan: 'Dihapus.',
    })
  })

  it('memakai peringatan tumpang daripada ok generik', () => {
    expect(flashDariQuery({ ok: 'simpan', peringatan: 'tumpang' })).toEqual({
      jenis: 'peringatan',
      pesan: 'Event tersimpan, tetapi menimpa jadwal lain.',
    })
  })

  it('memetakan kesalahan form dan peran', () => {
    expect(flashDariQuery({ kesalahan: 'isi' })?.pesan).toBe('Isi kolom yang wajib.')
    expect(flashDariQuery({ kesalahan: 'email' })?.pesan).toBe('Email tidak valid.')
    expect(flashDariQuery({ kesalahan: 'angka' })?.pesan).toBe('Angka tidak boleh minus.')
    expect(flashDariQuery({ kesalahan: 'wajib' })?.pesan).toBe('Menu wajib tidak bisa dimatikan.')
    expect(flashDariQuery({ kesalahan: 'slug' })?.pesan).toBe('Slug tidak tersedia.')
    expect(flashDariQuery({ kesalahan: 'nama' })?.pesan).toBe('Nama sudah dipakai.')
    expect(flashDariQuery({ kesalahan: 'layout' })?.pesan).toBe('Tata letak tidak valid.')
    expect(flashDariQuery({ kesalahan: 'kurangi' })?.pesan).toBe('Hak Admin tidak bisa dikurangi.')
    expect(flashDariQuery({ kesalahan: 'hapus' })?.pesan).toBe('Peran Admin tidak bisa dihapus.')
    expect(flashDariQuery({ kesalahan: 'isi' })?.jenis).toBe('error')
  })

  it('menyusun pesan pakai sesuai jenis', () => {
    expect(flashDariQuery({ kesalahan: 'pakai', n: '3', pakai: 'berita' })?.pesan).toBe(
      'Tidak bisa dihapus. Masih dipakai 3 berita.',
    )
    expect(flashDariQuery({ kesalahan: 'pakai', n: '2', pakai: 'kas' })?.pesan).toBe(
      'Tidak bisa dihapus. Masih dipakai 2 entri kas.',
    )
    expect(flashDariQuery({ kesalahan: 'pakai', n: '4', pakai: 'turnamen' })?.pesan).toBe(
      'Tidak bisa dihapus. Masih dipakai 4 pertandingan atau statistik.',
    )
  })

  it('mengembalikan null jika query kosong', () => {
    expect(flashDariQuery({})).toBeNull()
  })
})

describe('pathDenganFlash', () => {
  it('menambah query flash ke path bersih', () => {
    expect(pathDenganFlash('/cms/news', { ok: 'simpan' })).toBe('/cms/news?ok=simpan')
    expect(pathDenganFlash('/cms/news', { ok: 'hapus' })).toBe('/cms/news?ok=hapus')
    expect(pathDenganFlash('/cms/settings', { kesalahan: 'isi' })).toBe('/cms/settings?kesalahan=isi')
  })

  it('mempertahankan query lain', () => {
    expect(pathDenganFlash('/cms/inbox', { ok: 'hapus' }, { q: 'halo', hal: '2' })).toBe(
      '/cms/inbox?q=halo&hal=2&ok=hapus',
    )
  })
})

describe('FLASH_KEYS', () => {
  it('mencakup kunci yang harus dibuang dari URL', () => {
    expect(FLASH_KEYS).toEqual(['ok', 'kesalahan', 'peringatan', 'n', 'pakai'])
  })
})
