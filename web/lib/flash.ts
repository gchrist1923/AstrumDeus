export const FLASH_KEYS = ['ok', 'kesalahan', 'peringatan', 'n', 'pakai'] as const

export type FlashOk = 'simpan' | 'ubah' | 'hapus'
export type FlashJenis = 'sukses' | 'error' | 'peringatan'

export type Flash = {
  jenis: FlashJenis
  pesan: string
}

export type FlashQuery = {
  ok?: string | null
  kesalahan?: string | null
  peringatan?: string | null
  n?: string | number | null
  pakai?: string | null
}

const PESAN_OK: Record<FlashOk, string> = {
  simpan: 'Tersimpan.',
  ubah: 'Perubahan tersimpan.',
  hapus: 'Dihapus.',
}

const PESAN_KESALAHAN: Record<string, string> = {
  isi: 'Isi kolom yang wajib.',
  email: 'Email tidak valid.',
  angka: 'Angka tidak boleh minus.',
  wajib: 'Menu wajib tidak bisa dimatikan.',
  slug: 'Slug tidak tersedia.',
  nama: 'Nama sudah dipakai.',
  layout: 'Tata letak tidak valid.',
  kurangi: 'Hak Admin tidak bisa dikurangi.',
  hapus: 'Peran Admin tidak bisa dihapus.',
}

function pesanPakai(n: string, pakai: string): string {
  if (pakai === 'kas') {
    return `Tidak bisa dihapus. Masih dipakai ${n} entri kas.`
  }
  if (pakai === 'berita') {
    return `Tidak bisa dihapus. Masih dipakai ${n} berita.`
  }
  return `Tidak bisa dihapus. Masih dipakai ${n} pertandingan atau statistik.`
}

export function flashDariQuery(query: FlashQuery): Flash | null {
  const kesalahan = query.kesalahan ?? undefined
  if (kesalahan) {
    if (kesalahan === 'pakai') {
      return {
        jenis: 'error',
        pesan: pesanPakai(String(query.n ?? '0'), query.pakai ?? ''),
      }
    }
    const pesan = PESAN_KESALAHAN[kesalahan]
    if (pesan) {
      return { jenis: 'error', pesan }
    }
  }

  if (query.peringatan === 'tumpang') {
    return {
      jenis: 'peringatan',
      pesan: 'Event tersimpan, tetapi menimpa jadwal lain.',
    }
  }

  const ok = query.ok
  if (ok === 'simpan' || ok === 'ubah' || ok === 'hapus') {
    return { jenis: 'sukses', pesan: PESAN_OK[ok] }
  }

  return null
}

export function pathDenganFlash(
  path: string,
  flash: {
    ok?: FlashOk
    kesalahan?: string
    peringatan?: string
    n?: string | number
    pakai?: string
  },
  extra: Record<string, string | undefined> = {},
): string {
  const [base, existing] = path.split('?')
  const qs = new URLSearchParams(existing)
  for (const [kunci, nilai] of Object.entries(extra)) {
    if (nilai) {
      qs.set(kunci, nilai)
    }
  }
  if (flash.ok) qs.set('ok', flash.ok)
  if (flash.kesalahan) qs.set('kesalahan', flash.kesalahan)
  if (flash.peringatan) qs.set('peringatan', flash.peringatan)
  if (flash.n !== undefined) qs.set('n', String(flash.n))
  if (flash.pakai) qs.set('pakai', flash.pakai)
  const query = qs.toString()
  return query ? `${base}?${query}` : base
}
