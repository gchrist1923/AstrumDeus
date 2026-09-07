import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

describe('harness test', () => {
  it('merender komponen React dan mengenali matcher jest-dom', () => {
    render(<p>halo</p>)

    expect(screen.getByText('halo')).toBeInTheDocument()
  })

  it('mengenali matcher aksesibilitas dan bisa menemukan pelanggaran', async () => {
    // Missing alt is intentional test data proving the axe matcher detects violations.
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { container } = render(<img src="/contoh.png" />)

    const hasil = await axe(container)

    expect(hasil).not.toHaveNoViolations()
  })
})
