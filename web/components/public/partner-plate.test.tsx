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
  logo: null,
}

const DENGAN_TAUTAN: Partner = {
  slug: 'sponsor-utama',
  name: 'Sponsor Utama',
  tier: 'Title',
  logoText: 'TITLE',
  href: 'https://example.com',
  logo: null,
}

const DENGAN_LOGO: Partner = {
  slug: 'peralatan',
  name: 'Peralatan',
  tier: 'Official',
  logoText: 'GEAR',
  href: null,
  logo: '/media/x.png',
}

const DENGAN_LOGO_DAN_TAUTAN: Partner = {
  slug: 'sponsor-utama',
  name: 'Sponsor Utama',
  tier: 'Title',
  logoText: 'TITLE',
  href: 'https://example.com',
  logo: '/media/x.png',
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

  it('menampilkan img dengan alt nama partner bila logo ada, tanpa logoText', () => {
    render(<PartnerPlate partner={DENGAN_LOGO} />)

    const img = screen.getByRole('img', { name: 'Peralatan' })
    expect(img).toHaveAttribute('src', '/media/x.png')
    expect(screen.queryByText('GEAR')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('menampilkan img di dalam tautan bila logo dan href ada', () => {
    render(<PartnerPlate partner={DENGAN_LOGO_DAN_TAUTAN} />)

    expect(screen.getByRole('link', { name: 'Sponsor Utama' })).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByRole('img', { name: 'Sponsor Utama' })).toHaveAttribute('src', '/media/x.png')
    expect(screen.queryByText('TITLE')).not.toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas tanpa tautan', async () => {
    const { container } = render(<PartnerPlate partner={TANPA_TAUTAN} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
