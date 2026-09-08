import { describe, expect, it } from 'vitest'
import { hasRole, parseRoles, type Role } from '@/lib/auth/roles'

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
