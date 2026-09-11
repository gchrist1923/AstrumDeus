import { describe, expect, it } from 'vitest'
import { cashBookPath } from '@/lib/finance/cash-path'

describe('cashBookPath', () => {
  it('memisahkan rute operasional dan tim', () => {
    expect(cashBookPath('operasional')).toBe('/internal/cash/operasional')
    expect(cashBookPath('tim')).toBe('/internal/cash/tim')
  })
})
