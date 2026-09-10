import { describe, expect, it } from 'vitest'
import { adminTemplate, emptyMatrix } from '@/lib/auth/grants'
import { assertAdminRoleMutation } from '@/lib/auth/protect-admin'

describe('assertAdminRoleMutation', () => {
  it('isAdmin tanpa next menolak hapus', () => {
    expect(assertAdminRoleMutation({ isAdmin: true })).toBe('hapus')
  })

  it('isAdmin dengan matriks dikurangi menolak kurangi', () => {
    const next = adminTemplate()
    next.news.view = false
    expect(assertAdminRoleMutation({ isAdmin: true }, next)).toBe('kurangi')
  })

  it('isAdmin dengan matriks penuh boleh', () => {
    expect(assertAdminRoleMutation({ isAdmin: true }, adminTemplate())).toBe('ok')
  })

  it('peran biasa boleh dihapus dan diubah', () => {
    expect(assertAdminRoleMutation({ isAdmin: false })).toBe('ok')
    expect(assertAdminRoleMutation({ isAdmin: false }, emptyMatrix())).toBe('ok')
  })
})
