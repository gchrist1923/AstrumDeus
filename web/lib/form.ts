export function teks(formData: FormData, kunci: string): string {
  const nilai = formData.get(kunci)
  return typeof nilai === 'string' ? nilai.trim() : ''
}

export function adaKosong(formData: FormData, kunci: string[]): boolean {
  return kunci.some((nama) => !teks(formData, nama))
}

export function emailValid(nilai: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nilai)
}

export function angka(formData: FormData, kunci: string): number | null {
  const mentah = teks(formData, kunci)
  if (!mentah) {
    return null
  }

  const nilai = Number.parseInt(mentah, 10)
  return Number.isFinite(nilai) ? nilai : null
}

export function checked(formData: FormData, kunci: string): boolean {
  return formData.get(kunci) === 'on' || formData.get(kunci) === 'true'
}
