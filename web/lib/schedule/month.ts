import { toDatetimeLocal } from '@/lib/datetime'

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatHari(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function parseBulan(bulan: string | undefined, now = new Date()): { year: number; month: number } {
  const match = bulan?.match(/^(\d{4})-(\d{2})$/)
  if (!match) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }
  return { year, month }
}

export type CalendarCell = {
  iso: string
  day: number
  inMonth: boolean
  bulanHref: string
}

export function monthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month - 1, 1)
  const startOffset = (first.getDay() + 6) % 7
  const start = new Date(year, month - 1, 1 - startOffset)
  const cells: CalendarCell[] = []
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push({
      iso: formatHari(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month - 1,
      bulanHref: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`,
    })
  }
  return cells
}

export function defaultEventRange(
  hari: string,
  now = new Date(),
): { startAt: string; endAt: string } {
  if (hari === formatHari(now)) {
    return {
      startAt: toDatetimeLocal(now),
      endAt: toDatetimeLocal(new Date(now.getTime() + 60 * 60 * 1000)),
    }
  }
  return { startAt: `${hari}T09:00`, endAt: `${hari}T10:00` }
}
