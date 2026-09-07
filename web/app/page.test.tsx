import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from '@/app/page'

describe('Home', () => {
  it('membuka dengan nama tim dan tiga angka kunci', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: /Astrum/i })).toBeInTheDocument()
    expect(screen.getByText('Gelar')).toBeInTheDocument()
    expect(screen.getAllByText('WWCD').length).toBeGreaterThan(0)
  })

  it('menampilkan bar Live saat ada pertandingan berlangsung', () => {
    render(<Home />)

    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('menampilkan heading Hasil karena pertandingan aktif', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Hasil' })).toBeInTheDocument()
  })
})
