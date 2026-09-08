import { describe, expect, it } from 'vitest'
import { activePlusCurrent } from '@/lib/content/active-options'

describe('activePlusCurrent', () => {
  const rows = [
    { id: 'a', isActive: true },
    { id: 'b', isActive: false },
    { id: 'c', isActive: true },
  ]

  it('hanya yang aktif bila tidak ada current', () => {
    expect(activePlusCurrent(rows).map((r) => r.id)).toEqual(['a', 'c'])
  })

  it('menyertakan current nonaktif', () => {
    expect(activePlusCurrent(rows, 'b').map((r) => r.id)).toEqual(['a', 'b', 'c'])
  })
})
