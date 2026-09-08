export function signedAmount(direction: string, amount: number): number {
  return direction === 'masuk' ? amount : -amount
}

export function computeBalance(
  opening: number,
  entries: { direction: string; amount: number }[],
): number {
  return entries.reduce((saldo, entry) => saldo + signedAmount(entry.direction, entry.amount), opening)
}

export function buildReversal(original: { id: string; direction: string; amount: number }): {
  direction: 'masuk' | 'keluar'
  amount: number
  correctsEntryId: string
} {
  return {
    direction: original.direction === 'masuk' ? 'keluar' : 'masuk',
    amount: original.amount,
    correctsEntryId: original.id,
  }
}

export function reportForPeriod(
  entries: { date: string; direction: string; amount: number }[],
  startIso: string,
  endIso: string,
): { masuk: number; keluar: number; net: number; count: number } {
  const start = Date.parse(startIso)
  const end = Date.parse(endIso)
  const inPeriod = entries.filter((entry) => {
    const waktu = Date.parse(entry.date)
    return waktu >= start && waktu < end
  })

  const masuk = inPeriod.filter((entry) => entry.direction === 'masuk').reduce((sum, entry) => sum + entry.amount, 0)
  const keluar = inPeriod.filter((entry) => entry.direction === 'keluar').reduce((sum, entry) => sum + entry.amount, 0)

  return { masuk, keluar, net: masuk - keluar, count: inPeriod.length }
}
