import { describe, expect, it } from 'vitest'
import { internalNavLinks } from '@/components/admin/admin-shell'
import { financeTemplate, teamTemplate } from '@/lib/auth/grants'

describe('internalNavLinks', () => {
  it('Team hanya Kas tim, bukan Kas operasional atau Kas gabungan', () => {
    const labels = internalNavLinks(teamTemplate()).map((link) => link.label)
    expect(labels).toContain('Kas tim')
    expect(labels).not.toContain('Kas operasional')
    expect(labels).not.toContain('Kas')
    expect(internalNavLinks(teamTemplate()).find((link) => link.label === 'Kas tim')?.href).toBe(
      '/internal/cash/tim',
    )
  })

  it('Finance punya kedua buku kas sebagai menu terpisah', () => {
    const links = internalNavLinks(financeTemplate())
    const labels = links.map((link) => link.label)
    expect(labels).toContain('Kas operasional')
    expect(labels).toContain('Kas tim')
    expect(labels).not.toContain('Kas')
    expect(links.find((link) => link.label === 'Kas operasional')?.href).toBe('/internal/cash/operasional')
  })
})
