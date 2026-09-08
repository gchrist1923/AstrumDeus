import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleCard } from '@/components/public/article-card'
import { formatNewsDate } from '@/lib/content/format'
import type { NewsPost } from '@/lib/content/types'

const ARTIKEL: NewsPost = {
  slug: 'lolos-grand-final-pmnc-2026',
  title: 'Lolos ke Grand Final PMNC 2026',
  excerpt: 'Tiga hari klasemen berturut-turut di empat besar mengunci slot Grand Final.',
  body: ['Isi.'],
  cover: '/hero.jpg',
  category: 'Turnamen',
  author: 'Tim Astrum Deus',
  publishedAt: '2026-09-04T09:00:00+07:00',
  status: 'published',
}

describe('ArticleCard', () => {
  it('menautkan ke artikel, tanggal, judul, dan excerpt', () => {
    render(<ArticleCard post={ARTIKEL} />)

    expect(
      screen.getByRole('link', { name: /Lolos ke Grand Final PMNC 2026/ }),
    ).toHaveAttribute('href', '/news/lolos-grand-final-pmnc-2026')
    expect(screen.getByText(formatNewsDate(ARTIKEL.publishedAt))).toBeInTheDocument()
    expect(screen.getByText(ARTIKEL.title)).toBeInTheDocument()
    expect(screen.getByText(ARTIKEL.excerpt)).toBeInTheDocument()
  })
})
