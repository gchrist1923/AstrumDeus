import { describe, expect, it } from 'vitest'
import { hasRole, legacyRolesJsonFromSlugs, parseRoles, type Role } from '@/lib/auth/roles'

describe('parseRoles', () => {
  it('membaca array JSON dan mengabaikan nilai asing', () => {
    expect(parseRoles('["admin","editor","hacker"]')).toEqual(['admin', 'editor'])
  })

  it('mengembalikan array kosong untuk JSON rusak', () => {
    expect(parseRoles('bukan-json')).toEqual([])
  })
})

describe('hasRole', () => {
  it('mengenali salah satu peran yang dimiliki', () => {
    const roles: Role[] = ['editor', 'team']

    expect(hasRole(roles, 'editor')).toBe(true)
    expect(hasRole(roles, 'admin')).toBe(false)
  })
})

describe('legacyRolesJsonFromSlugs', () => {
  it('hanya menyimpan slug admin/editor/team/finance', () => {
    expect(legacyRolesJsonFromSlugs(['editor', 'custom-ops', 'finance'])).toBe(
      JSON.stringify(['editor', 'finance']),
    )
  })

  it('mengembalikan [] jika tidak ada slug legacy tersisa', () => {
    expect(legacyRolesJsonFromSlugs(['custom-ops'])).toBe('[]')
    expect(legacyRolesJsonFromSlugs([])).toBe('[]')
  })
})
