import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { SiteFooter } from '@/components/layout/site-footer'

describe('SiteFooter', () => {
  it('memberi nama pada navigasi footer supaya beda dari navigasi utama', () => {
    render(<SiteFooter />)

    expect(screen.getByRole('navigation', { name: 'Navigasi footer' })).toBeInTheDocument()
  })

  it('hanya menampilkan menu yang aktif', () => {
    render(<SiteFooter flags={{ partners: true }} />)

    expect(screen.getByRole('link', { name: 'Partners' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Media Kit' })).not.toBeInTheDocument()
  })

  it('baris kredit memakai nama situs; logo dekoratif', () => {
    const { container } = render(<SiteFooter siteName="AD Esports" />)

    expect(screen.getByText('AD Esports. Tim esports PUBG Mobile.')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<SiteFooter flags={{ roster: true }} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
