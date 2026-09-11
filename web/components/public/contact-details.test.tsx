import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContactDetails } from '@/components/public/contact-details'

describe('ContactDetails', () => {
  it('menyembunyikan alamat dan telepon jika kosong', () => {
    render(<ContactDetails email="halo@ad.id" address="" phone="" />)

    expect(screen.getByRole('link', { name: 'halo@ad.id' })).toHaveAttribute(
      'href',
      'mailto:halo@ad.id',
    )
    expect(screen.queryByText('Jakarta')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /0812/ })).not.toBeInTheDocument()
  })

  it('menampilkan alamat teks dan telepon tel: jika terisi', () => {
    render(
      <ContactDetails email="halo@ad.id" address="Jakarta" phone="0812 000" />,
    )

    expect(screen.getByText('Jakarta')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '0812 000' })).toHaveAttribute(
      'href',
      'tel:0812000',
    )
  })
})
