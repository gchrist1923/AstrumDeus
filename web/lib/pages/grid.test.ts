import { describe, expect, it } from 'vitest'
import {
  assertValidLayout,
  canPlaceBlock,
  rowWidth,
} from '@/lib/pages/grid'

describe('rowWidth', () => {
  it('menjumlahkan lebar blok dalam baris', () => {
    expect(rowWidth([{ width: 4 }, { width: 8 }])).toBe(12)
    expect(rowWidth([{ width: 6 }])).toBe(6)
    expect(rowWidth([])).toBe(0)
  })
})

describe('canPlaceBlock', () => {
  it('menolak baris yang overflow', () => {
    expect(canPlaceBlock([{ width: 8 }, { width: 4 }], 4)).toBe(false)
    expect(canPlaceBlock([{ width: 6 }], 6)).toBe(true)
  })

  it('menerima penempatan yang muat', () => {
    expect(canPlaceBlock([{ width: 4 }], 8)).toBe(true)
    expect(canPlaceBlock([], 12)).toBe(true)
  })
})

describe('assertValidLayout', () => {
  it('hanya lebar 4/6/8/12', () => {
    expect(() =>
      assertValidLayout([
        {
          id: 'r1',
          blocks: [{ id: 'b1', type: 'heading', width: 3 as 4, payload: {} }],
        },
      ]),
    ).toThrow()
  })

  it('menolak baris yang overflow', () => {
    expect(() =>
      assertValidLayout([
        {
          id: 'r1',
          blocks: [
            { id: 'b1', type: 'heading', width: 8, payload: {} },
            { id: 'b2', type: 'text', width: 6, payload: {} },
          ],
        },
      ]),
    ).toThrow()
  })

  it('menolak id blok duplikat', () => {
    expect(() =>
      assertValidLayout([
        {
          id: 'r1',
          blocks: [
            { id: 'b1', type: 'heading', width: 4, payload: {} },
            { id: 'b1', type: 'text', width: 8, payload: {} },
          ],
        },
      ]),
    ).toThrow()
  })

  it('menolak id baris duplikat', () => {
    expect(() =>
      assertValidLayout([
        { id: 'r1', blocks: [{ id: 'b1', type: 'heading', width: 12, payload: {} }] },
        { id: 'r1', blocks: [{ id: 'b2', type: 'text', width: 12, payload: {} }] },
      ]),
    ).toThrow()
  })

  it('menerima layout valid 4+8', () => {
    expect(() =>
      assertValidLayout([
        {
          id: 'r1',
          blocks: [
            { id: 'b1', type: 'heading', width: 4, payload: {} },
            { id: 'b2', type: 'text', width: 8, payload: {} },
          ],
        },
      ]),
    ).not.toThrow()
  })

  it('menerima blok video dan divider', () => {
    expect(() =>
      assertValidLayout([
        {
          id: 'r1',
          blocks: [
            { id: 'v1', type: 'video', width: 8, payload: { url: 'https://youtu.be/dQw4w9wgGcQ' } },
            { id: 'd1', type: 'divider', width: 4, payload: { thickness: 2, color: 'accent' } },
          ],
        },
      ]),
    ).not.toThrow()
  })
})
