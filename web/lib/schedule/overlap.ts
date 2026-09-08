export function eventsOverlap(
  a: { startAt: string | Date; endAt: string | Date },
  b: { startAt: string | Date; endAt: string | Date },
): boolean {
  const aStart = new Date(a.startAt).getTime()
  const aEnd = new Date(a.endAt).getTime()
  const bStart = new Date(b.startAt).getTime()
  const bEnd = new Date(b.endAt).getTime()

  return aStart < bEnd && bStart < aEnd
}
