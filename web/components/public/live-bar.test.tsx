import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { LiveBar } from '@/components/public/live-bar'

describe('LiveBar', () => {
  it('tidak merender apa pun bila tidak ada event', () => {
    const { container } = render(<LiveBar event={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('menulis label Live selain warna, plus nama turnamen', () => {
    render(
      <LiveBar
        event={{ tournament: 'PMSL SEA', stage: 'Group Stage', map: 'Erangel', href: '/matches' }}
      />,
    )

    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByText(/PMSL SEA/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tonton stream' })).toHaveAttribute('href', '/matches')
  })

  it('tidak punya pelanggaran aksesibilitas saat ada event', async () => {
    const { container } = render(
      <LiveBar
        event={{ tournament: 'PMSL SEA', stage: 'Group Stage', map: 'Erangel', href: '/matches' }}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
