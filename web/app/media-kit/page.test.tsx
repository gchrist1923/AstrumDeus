import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MediaKitPage from '@/app/media-kit/page'

describe('MediaKit', () => {
  it('menampilkan judul dan aturan logo tidak diwarnai emas', async () => {
    render(await MediaKitPage())

    expect(screen.getByRole('heading', { name: 'Media Kit' })).toBeInTheDocument()
    expect(screen.getByText(/logo.*tidak.*diwarnai emas/i)).toBeInTheDocument()
  })

  it('mengelompokkan aset per grup dengan jenis dan ukuran berkas', async () => {
    render(await MediaKitPage())

    const logo = screen.getByRole('heading', { name: 'Logo' }).closest('section')
    expect(logo).not.toBeNull()
    expect(within(logo as HTMLElement).getByText('Logo terang')).toBeInTheDocument()
    expect(within(logo as HTMLElement).getByText('PNG')).toBeInTheDocument()
    expect(within(logo as HTMLElement).getByText('16 KB')).toBeInTheDocument()

    const warna = screen.getByRole('heading', { name: 'Warna' }).closest('section')
    expect(warna).not.toBeNull()
    expect(within(warna as HTMLElement).getByText('Nilai warna brand')).toBeInTheDocument()
  })
})
