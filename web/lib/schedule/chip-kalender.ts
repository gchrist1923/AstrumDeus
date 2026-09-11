export function chipKalender<T>(items: T[], batas = 2): { tampil: T[]; sisa: number } {
  const tampil = items.slice(0, batas)
  return { tampil, sisa: Math.max(0, items.length - tampil.length) }
}
