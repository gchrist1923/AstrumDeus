import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { builtinEnabledUpdates, syncBuiltinEnabled } from '@/lib/pages/sync-builtin-enabled'

describe('builtinEnabledUpdates', () => {
  it('memberi MenuItem dan SitePage isEnabled yang sama', () => {
    const updates = builtinEnabledUpdates('roster', false)

    expect(updates.menuItem.data.isEnabled).toBe(false)
    expect(updates.sitePage.data.isEnabled).toBe(false)
    expect(updates.menuItem.data.isEnabled).toBe(updates.sitePage.data.isEnabled)
    expect(updates.menuItem.where).toEqual({ key: 'roster' })
    expect(updates.sitePage.where).toEqual({ menuKey: 'roster' })
  })
})

describe('syncBuiltinEnabled', () => {
  it('menulis kedua model dalam satu transaksi', async () => {
    const menuItemUpdate = vi.fn().mockResolvedValue({})
    const sitePageUpdate = vi.fn().mockResolvedValue({})
    const $transaction = vi.fn(async (ops: unknown[]) => Promise.all(ops as Promise<unknown>[]))
    const db = {
      $transaction,
      menuItem: { update: menuItemUpdate },
      sitePage: { update: sitePageUpdate },
    }

    await syncBuiltinEnabled(db, 'roster', false)

    expect($transaction).toHaveBeenCalledTimes(1)
    expect(menuItemUpdate).toHaveBeenCalledWith({
      where: { key: 'roster' },
      data: { isEnabled: false },
    })
    expect(sitePageUpdate).toHaveBeenCalledWith({
      where: { menuKey: 'roster' },
      data: { isEnabled: false },
    })
    expect(menuItemUpdate.mock.calls[0][0].data.isEnabled).toBe(
      sitePageUpdate.mock.calls[0][0].data.isEnabled,
    )
  })
})

describe('action halaman dan menu', () => {
  it('kedua UI memakai helper yang sama', () => {
    const halaman = readFileSync(
      path.join(process.cwd(), 'app', 'cms', 'halaman', 'actions.ts'),
      'utf8',
    )
    const menu = readFileSync(path.join(process.cwd(), 'app', 'cms', 'menu', 'actions.ts'), 'utf8')

    expect(halaman).toMatch(/syncBuiltinEnabled/)
    expect(menu).toMatch(/syncBuiltinEnabled/)
    expect(menu).toMatch(/applyMenuToggle/)
  })
})
