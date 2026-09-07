import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NewsPage from '@/app/news/page'

describe('arsip berita', () => {
  it('tidak memuat judul draft-internal', async () => {
    const ui = await NewsPage({ searchParams: Promise.resolve({}) })
    render(ui)

    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument()
    expect(screen.getByText('Lolos ke Grand Final PMNC 2026')).toBeInTheDocument()
    expect(screen.queryByText('Catatan pelatih yang belum terbit')).not.toBeInTheDocument()
    expect(screen.queryByText('Pengumuman yang dijadwalkan nanti')).not.toBeInTheDocument()
  })
})
