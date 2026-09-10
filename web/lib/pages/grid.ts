import type { PageRow } from '@/lib/pages/types'

const VALID_WIDTHS = new Set([4, 6, 8, 12])

export function rowWidth(blocks: { width: number }[]): number {
  return blocks.reduce((sum, block) => sum + block.width, 0)
}

export function canPlaceBlock(
  row: { width: number }[],
  width: 4 | 6 | 8 | 12,
): boolean {
  return rowWidth(row) + width <= 12
}

export function assertValidLayout(rows: PageRow[]): void {
  const seenRowIds = new Set<string>()
  const seenBlockIds = new Set<string>()

  for (const row of rows) {
    if (seenRowIds.has(row.id)) {
      throw new Error(`id baris duplikat: ${row.id}`)
    }
    seenRowIds.add(row.id)

    let rowTotal = 0
    for (const block of row.blocks) {
      if (!VALID_WIDTHS.has(block.width)) {
        throw new Error(`lebar blok tidak valid: ${block.width}`)
      }

      if (seenBlockIds.has(block.id)) {
        throw new Error(`id blok duplikat: ${block.id}`)
      }
      seenBlockIds.add(block.id)

      rowTotal += block.width
    }

    if (rowTotal > 12) {
      throw new Error(`baris overflow: ${rowTotal}`)
    }
  }
}
