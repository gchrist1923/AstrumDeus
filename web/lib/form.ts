export function teks(formData: FormData, kunci: string): string {
  const nilai = formData.get(kunci)
  return typeof nilai === 'string' ? nilai.trim() : ''
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
