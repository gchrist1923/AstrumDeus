import { describe, expect, it } from 'vitest'
import { applyMenuToggle } from '@/lib/content/menu'

describe('applyMenuToggle', () => {
  it('menolak mematikan menu wajib', () => {
    expect(applyMenuToggle({ isMandatory: true, isEnabled: true }, false)).toEqual({
      ok: false,
      error: 'Menu wajib tidak bisa dimatikan.',
    })
  })

  it('mengizinkan mengubah menu opsional', () => {
    expect(applyMenuToggle({ isMandatory: false, isEnabled: true }, false)).toEqual({
      ok: true,
      isEnabled: false,
    })
  })
})
