export function activePlusCurrent<T extends { id: string; isActive: boolean }>(
  rows: T[],
  currentId?: string,
): T[] {
  return rows.filter((row) => row.isActive || row.id === currentId)
}
