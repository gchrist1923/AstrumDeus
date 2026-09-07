import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ArticlePage, { generateStaticParams } from '@/app/news/[slug]/page'
import { formatNewsDate } from '@/lib/content/format'

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
}))

describe('halaman artikel', () => {
  it('merender lolos-grand-final-pmnc-2026', async () => {
    const ui = await ArticlePage({
      params: Promise.resolve({ slug: 'lolos-grand-final-pmnc-2026' }),
    })
    render(ui)

    expect(screen.getByRole('heading', { name: 'Lolos ke Grand Final PMNC 2026' })).toBeInTheDocument()
    expect(screen.getByText('Turnamen')).toBeInTheDocument()
    expect(screen.getByText('Tim Astrum Deus')).toBeInTheDocument()
    expect(screen.getByText(formatNewsDate('2026-09-04T09:00:00+07:00'))).toBeInTheDocument()
    expect(
      screen.getByText(/Tiga hari di empat besar sudah cukup untuk mengunci slot/),
    ).toBeInTheDocument()
  })

  it('memanggil notFound untuk slug draft', async () => {
    await expect(ArticlePage({ params: Promise.resolve({ slug: 'draft-internal' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
    expect(notFound).toHaveBeenCalled()
  })

  it('generateStaticParams hanya dari berita terbit', () => {
    const params = generateStaticParams()

    expect(params).toEqual(
      expect.arrayContaining([{ slug: 'lolos-grand-final-pmnc-2026' }]),
    )
    expect(params).not.toEqual(expect.arrayContaining([{ slug: 'draft-internal' }]))
    expect(params).not.toEqual(expect.arrayContaining([{ slug: 'jadwal-besok' }]))
  })
})
