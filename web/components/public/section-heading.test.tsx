import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeading } from '@/components/public/section-heading'

describe('SectionHeading', () => {
  it('merender heading section', () => {
    render(<SectionHeading title="Hasil terbaru" />)

    expect(screen.getByRole('heading', { name: 'Hasil terbaru' })).toBeInTheDocument()
  })

  it('merender tautan opsional bila href dan linkLabel diberikan', () => {
    render(<SectionHeading title="Berita" href="/news" linkLabel="Semua berita" />)

    expect(screen.getByRole('heading', { name: 'Berita' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Semua berita' })).toHaveAttribute('href', '/news')
  })

  it('tidak merender tautan bila href atau linkLabel tidak ada', () => {
    render(<SectionHeading title="Roster" href="/roster" />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
