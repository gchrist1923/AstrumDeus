import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeSections } from '@/components/public/home-sections'
import { getHomeContent } from '@/lib/content/dummy'

const FLAGS = { roster: true, matches: true, 'media-kit': true, partners: true }

describe('Home', () => {
  it('membuka dengan nama tim dan tiga angka kunci', () => {
    render(<HomeSections flags={FLAGS} content={getHomeContent()} />)

    expect(screen.getByRole('heading', { name: /Astrum/i })).toBeInTheDocument()
    expect(screen.getByText('Gelar')).toBeInTheDocument()
    expect(screen.getAllByText('WWCD').length).toBeGreaterThan(0)
  })

  it('menampilkan bar Live saat ada pertandingan berlangsung', () => {
    render(<HomeSections flags={FLAGS} content={getHomeContent()} />)

    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('menampilkan heading Hasil karena pertandingan aktif', () => {
    render(<HomeSections flags={FLAGS} content={getHomeContent()} />)

    expect(screen.getByRole('heading', { name: 'Hasil' })).toBeInTheDocument()
  })
})
