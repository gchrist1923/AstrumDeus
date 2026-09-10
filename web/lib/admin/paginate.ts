export const DEFAULT_PER_PAGE = 5

export function pageFromQuery(value: string | undefined): number {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) ? n : 1
}

export function paginate({
  total,
  page,
  perPage = DEFAULT_PER_PAGE,
}: {
  total: number
  page: number
  perPage?: number
}): {
  page: number
  pageCount: number
  skip: number
  take: number
  hasPrev: boolean
  hasNext: boolean
} {
  const pageCount = Math.max(1, Math.ceil(total / perPage) || 1)
  const current = Number.isFinite(page) ? Math.trunc(page) : 1
  const clamped = Math.min(pageCount, Math.max(1, current))
  return {
    page: clamped,
    pageCount,
    skip: (clamped - 1) * perPage,
    take: perPage,
    hasPrev: clamped > 1,
    hasNext: clamped < pageCount,
  }
}
