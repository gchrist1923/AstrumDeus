'use server'

import { prisma } from '@/lib/db'

const TUJUAN = new Set(['sponsor', 'media', 'tryout', 'lainnya'])

function teks(formData: FormData, kunci: string): string {
  const nilai = formData.get(kunci)
  return typeof nilai === 'string' ? nilai.trim() : ''
}

export async function kirimPesan(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }> {
  const nama = teks(formData, 'nama')
  const email = teks(formData, 'email')
  const tujuan = teks(formData, 'tujuan')
  const pesan = teks(formData, 'pesan')
  const errors: Record<string, string> = {}

  if (!nama) {
    errors.nama = 'Isi nama.'
  }

  if (!email.includes('@')) {
    errors.email = 'Masukkan alamat email yang berisi @.'
  }

  if (!TUJUAN.has(tujuan)) {
    errors.tujuan = 'Pilih tujuan pesan.'
  }

  if (pesan.length < 10) {
    errors.pesan = 'Tulis pesan minimal 10 karakter.'
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  await prisma.contactMessage.create({
    data: {
      name: nama,
      email,
      subject: tujuan,
      message: pesan,
      status: 'baru',
    },
  })

  return { ok: true }
}
