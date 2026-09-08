import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AssetCard } from '@/components/public/asset-card'
import type { MediaAsset } from '@/lib/content/types'

const ASET: MediaAsset = {
  id: 'logo-terang',
  name: 'Logo terang',
  description: 'Versi putih untuk latar gelap. Jangan diwarnai emas.',
  group: 'logo',
  href: '/logo-astrum-deus.png',
  fileType: 'PNG',
  fileSize: '16 KB',
}

describe('AssetCard', () => {
  it('menampilkan nama, deskripsi, jenis, ukuran, grup, dan tautan unduh', () => {
    render(<AssetCard asset={ASET} />)

    expect(screen.getByText('Logo terang')).toBeInTheDocument()
    expect(screen.getByText('Versi putih untuk latar gelap. Jangan diwarnai emas.')).toBeInTheDocument()
    expect(screen.getByText('PNG')).toBeInTheDocument()
    expect(screen.getByText('16 KB')).toBeInTheDocument()
    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /unduh/i })).toHaveAttribute('href', '/logo-astrum-deus.png')
  })
})
