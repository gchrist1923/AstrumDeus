import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatTrio } from '@/components/public/stat-trio'

describe('StatTrio', () => {
  it('menampilkan label Gelar, Turnamen, WWCD dan ketiga angka', () => {
    render(<StatTrio stats={{ titles: 4, tournaments: 12, wwcd: 68 }} />)

    expect(screen.getByText('Gelar')).toBeInTheDocument()
    expect(screen.getByText('Turnamen')).toBeInTheDocument()
    expect(screen.getByText('WWCD')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('68')).toBeInTheDocument()
  })
})
