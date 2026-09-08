export function activePlusCurrent<T extends { id: string; isActive: boolean }>(
  rows: T[],
  currentId?: string,
): T[] {
  return rows.filter((row) => row.isActive || row.id === currentId)
}

export function assertSelectableCategory(
  category: { id: string; isActive: boolean } | null,
  mode: 'create' | 'update',
  previousCategoryId?: string,
): boolean {
  if (!category) return false
  if (category.isActive) return true
  return mode === 'update' && previousCategoryId === category.id
}
