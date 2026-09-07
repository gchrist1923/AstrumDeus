import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { PartnerPlate } from '@/components/public/partner-plate'
import type { Partner } from '@/lib/content/types'

const TANPA_TAUTAN: Partner = {
  slug: 'peralatan',
  name: 'Peralatan',
  tier: 'Official',
  logoText: 'GEAR',
  href: null,
}

const DENGAN_TAUTAN: Partner = {
  slug: 'sponsor-utama',
  name: 'Sponsor Utama',
  tier: 'Title',
  logoText: 'TITLE',
  href: 'https://example.com',
}

describe('PartnerPlate', () => {
  it('menampilkan logoText dan merender div, bukan tautan, bila href null', () => {
    render(<PartnerPlate partner={TANPA_TAUTAN} />)

    expect(screen.getByText('GEAR')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('menjadi tautan bila href ada', () => {
    render(<PartnerPlate partner={DENGAN_TAUTAN} />)

    expect(screen.getByRole('link', { name: 'TITLE' })).toHaveAttribute('href', 'https://example.com')
  })

  it('tidak punya pelanggaran aksesibilitas tanpa tautan', async () => {
    const { container } = render(<PartnerPlate partner={TANPA_TAUTAN} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
