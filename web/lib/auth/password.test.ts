import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth/password'

describe('password', () => {
  it('memverifikasi hash yang baru dibuat', async () => {
    const hash = await hashPassword('astrum-cms-dev')

    expect(hash).not.toBe('astrum-cms-dev')
    expect(await verifyPassword('astrum-cms-dev', hash)).toBe(true)
    expect(await verifyPassword('salah', hash)).toBe(false)
  })
})
