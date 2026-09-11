export function pecahJudulHero(judul: string): { pertama: string; kedua: string | null } {
  const teks = judul.trim()
  const spasi = teks.indexOf(' ')
  if (spasi === -1) {
    return { pertama: teks, kedua: null }
  }
  return { pertama: teks.slice(0, spasi), kedua: teks.slice(spasi + 1).trim() }
}
