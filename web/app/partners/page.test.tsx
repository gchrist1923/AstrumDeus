import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PartnersPage from '@/app/partners/page'

describe('Partners', () => {
  it('menampilkan judul halaman', () => {
    render(<PartnersPage />)

    expect(screen.getByRole('heading', { name: 'Partners' })).toBeInTheDocument()
  })

  it('mengelompokkan mitra per tier dengan plat putih', () => {
    render(<PartnersPage />)

    const title = screen.getByRole('heading', { name: 'Title' }).closest('section')
    expect(title).not.toBeNull()
    expect(within(title as HTMLElement).getByText('TITLE')).toBeInTheDocument()

    const official = screen.getByRole('heading', { name: 'Official' }).closest('section')
    expect(official).not.toBeNull()
    expect(within(official as HTMLElement).getByText('GEAR')).toBeInTheDocument()
    expect(within(official as HTMLElement).getByText('DRINK')).toBeInTheDocument()

    const media = screen.getByRole('heading', { name: 'Media' }).closest('section')
    expect(media).not.toBeNull()
    expect(within(media as HTMLElement).getByText('MEDIA')).toBeInTheDocument()
  })
})
