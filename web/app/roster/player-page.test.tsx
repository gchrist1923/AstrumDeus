import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PlayerPage, { generateStaticParams } from '@/app/roster/[slug]/page'
import { formatMatchDate } from '@/lib/content/format'

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
}))

describe('halaman detail pemain', () => {
  it('menampilkan IGN, role, tanggal gabung, tabel statistik, dan tautan sosial Reza', async () => {
    const ui = await PlayerPage({ params: Promise.resolve({ slug: 'reza' }) })
    render(ui)

    expect(screen.getByRole('heading', { name: 'Reza' })).toBeInTheDocument()
    expect(screen.getByText('IGL')).toBeInTheDocument()
    expect(screen.getByText(formatMatchDate('2024-02-01'))).toBeInTheDocument()

    const tabel = screen.getByRole('table')
    expect(within(tabel).getByRole('columnheader', { name: 'Turnamen' })).toBeInTheDocument()
    expect(within(tabel).getByRole('columnheader', { name: 'Pertandingan' })).toBeInTheDocument()
    expect(within(tabel).getByRole('columnheader', { name: 'Kill' })).toBeInTheDocument()
    expect(within(tabel).getByRole('columnheader', { name: 'Rata-rata posisi' })).toBeInTheDocument()
    expect(within(tabel).getByText('PMNC 2026')).toBeInTheDocument()
    expect(within(tabel).getByText('18')).toBeInTheDocument()
    expect(within(tabel).getByText('42')).toBeInTheDocument()
    expect(within(tabel).getByText('4.2')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://instagram.com/astrumdeus',
    )
  })

  it('menampilkan tanggal keluar untuk mantan pemain', async () => {
    const ui = await PlayerPage({ params: Promise.resolve({ slug: 'gilang' }) })
    render(ui)

    expect(screen.getByRole('heading', { name: 'Gilang' })).toBeInTheDocument()
    expect(screen.getByText(formatMatchDate('2025-12-20'))).toBeInTheDocument()
  })

  it('memanggil notFound untuk slug yang tidak ada', async () => {
    await expect(PlayerPage({ params: Promise.resolve({ slug: 'tidak-ada' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
    expect(notFound).toHaveBeenCalled()
  })

  it('generateStaticParams mencakup pemain aktif dan mantan', async () => {
    const params = await generateStaticParams()

    expect(params).toEqual(expect.arrayContaining([{ slug: 'reza' }, { slug: 'gilang' }]))
  })
})
