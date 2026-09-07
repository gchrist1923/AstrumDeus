import { describe, expect, it } from 'vitest'
import { kirimPesan } from '@/app/contact/actions'

function data(fields: Record<string, string>): FormData {
  const form = new FormData()

  for (const [kunci, nilai] of Object.entries(fields)) {
    form.set(kunci, nilai)
  }

  return form
}

const VALID = {
  nama: 'Grace',
  email: 'grace@example.com',
  tujuan: 'sponsor',
  pesan: 'Halo, saya ingin kerja sama sponsor.',
}

describe('kirimPesan', () => {
  it('menerima pesan lengkap yang valid', async () => {
    expect(await kirimPesan(data(VALID))).toEqual({ ok: true })
  })

  it.each(['sponsor', 'media', 'tryout', 'lainnya'] as const)(
    'menerima tujuan %s',
    async (tujuan) => {
      expect(await kirimPesan(data({ ...VALID, tujuan }))).toEqual({ ok: true })
    },
  )

  it('menolak nama kosong', async () => {
    const result = await kirimPesan(data({ ...VALID, nama: '  ' }))

    expect(result).toEqual({ ok: false, errors: { nama: 'Isi nama.' } })
  })

  it('menolak email tanpa @', async () => {
    const result = await kirimPesan(data({ ...VALID, email: 'bukan-email' }))

    expect(result).toEqual({
      ok: false,
      errors: { email: 'Masukkan alamat email yang berisi @.' },
    })
  })

  it('menolak tujuan di luar enum', async () => {
    const result = await kirimPesan(data({ ...VALID, tujuan: 'hacker' }))

    expect(result).toEqual({
      ok: false,
      errors: { tujuan: 'Pilih tujuan pesan.' },
    })
  })

  it('menolak pesan di bawah 10 karakter', async () => {
    const result = await kirimPesan(data({ ...VALID, pesan: '  pendek  ' }))

    expect(result).toEqual({
      ok: false,
      errors: { pesan: 'Tulis pesan minimal 10 karakter.' },
    })
  })

  it('mengumpulkan semua error sekaligus', async () => {
    const result = await kirimPesan(data({ nama: '', email: 'x', tujuan: '', pesan: '' }))

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.nama).toBe('Isi nama.')
      expect(result.errors.email).toBe('Masukkan alamat email yang berisi @.')
      expect(result.errors.tujuan).toBe('Pilih tujuan pesan.')
      expect(result.errors.pesan).toBe('Tulis pesan minimal 10 karakter.')
    }
  })
})
