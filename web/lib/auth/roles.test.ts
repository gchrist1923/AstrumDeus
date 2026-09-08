import { describe, expect, it } from 'vitest'
import {
  canAccessCms,
  canAccessInternal,
  canManageSettings,
  canReadReports,
  canToggleMenu,
  canWriteCashBook,
  canWriteContent,
  canWriteSchedule,
  hasRole,
  parseRoles,
  type Role,
} from '@/lib/auth/roles'

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

describe('hak akses', () => {
  it('Editor masuk CMS, tidak masuk internal, tidak toggle menu', () => {
    const roles: Role[] = ['editor']

    expect(canAccessCms(roles)).toBe(true)
    expect(canAccessInternal(roles)).toBe(false)
    expect(canToggleMenu(roles)).toBe(false)
    expect(canManageSettings(roles)).toBe(false)
    expect(canWriteContent(roles)).toBe(true)
  })

  it('Admin mendapat CMS, internal, toggle, pengaturan, dan laporan', () => {
    const roles: Role[] = ['admin']

    expect(canAccessCms(roles)).toBe(true)
    expect(canAccessInternal(roles)).toBe(true)
    expect(canToggleMenu(roles)).toBe(true)
    expect(canManageSettings(roles)).toBe(true)
    expect(canReadReports(roles)).toBe(true)
    expect(canWriteSchedule(roles, 'orang-lain')).toBe(true)
  })

  it('Team Member hanya menulis event miliknya dan kas tim miliknya', () => {
    const roles: Role[] = ['team']

    expect(canAccessInternal(roles)).toBe(true)
    expect(canAccessCms(roles)).toBe(false)
    expect(canWriteSchedule(roles, 'saya')).toBe(true)
    expect(canWriteSchedule(roles, 'orang-lain')).toBe(false)
    expect(canWriteCashBook(roles, 'tim', 'saya')).toBe(true)
    expect(canWriteCashBook(roles, 'tim', 'orang-lain')).toBe(false)
    expect(canWriteCashBook(roles, 'operasional', 'saya')).toBe(false)
  })

  it('Finance menulis kedua buku kas dan membaca laporan', () => {
    const roles: Role[] = ['finance']

    expect(canWriteCashBook(roles, 'operasional', 'siapa-saja')).toBe(true)
    expect(canWriteCashBook(roles, 'tim', 'orang-lain')).toBe(true)
    expect(canReadReports(roles)).toBe(true)
    expect(canAccessCms(roles)).toBe(false)
  })
})
