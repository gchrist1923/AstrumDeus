import { describe, expect, it } from 'vitest'
import { shouldEditOnCanvas } from '@/lib/pages/should-edit-on-canvas'

describe('shouldEditOnCanvas', () => {
  it('hanya halaman kustom yang memakai kanvas', () => {
    expect(shouldEditOnCanvas('custom')).toBe(true)
    expect(shouldEditOnCanvas('builtin')).toBe(false)
  })
})
