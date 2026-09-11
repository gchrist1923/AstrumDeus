import { fromDateInput, toDateInput } from '@/lib/datetime'

export function hariIniWib(now = new Date()): { iso: string; awal: Date; akhir: Date } {
  const iso = toDateInput(now)
  const awal = fromDateInput(iso)
  const akhir = new Date(awal.getTime() + 24 * 60 * 60 * 1000)
  return { iso, awal, akhir }
}
