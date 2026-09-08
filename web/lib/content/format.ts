const WAKTU_WIB = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const WAKTU_BERITA = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Jakarta',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatMatchDate(iso: string): string {
  return WAKTU_WIB.format(new Date(iso))
}

export function formatNewsDate(iso: string): string {
  return WAKTU_BERITA.format(new Date(iso))
}

const RUPIAH = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatRupiah(amount: number): string {
  return RUPIAH.format(amount)
}
