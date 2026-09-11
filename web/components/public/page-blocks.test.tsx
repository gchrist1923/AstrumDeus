import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageBlocks } from '@/components/public/page-blocks'

describe('PageBlocks', () => {
  it('merender judul halaman jika baris kosong', () => {
    render(<PageBlocks rows={[]} title="Academy" />)

    expect(screen.getByRole('heading', { name: 'Academy' })).toBeInTheDocument()
  })

  it('merender heading dan tombol', () => {
    render(
      <PageBlocks
        rows={[
          {
            id: 'r1',
            blocks: [
              { id: 'h', type: 'heading', width: 12, payload: { text: 'Academy', level: 2 } },
              { id: 'b', type: 'button', width: 4, payload: { label: 'Daftar', href: '/contact' } },
            ],
          },
        ]}
        title="Academy"
      />,
    )
    expect(screen.getAllByRole('heading', { name: 'Academy' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('link', { name: 'Daftar' })).toHaveAttribute('href', '/contact')
  })

  it('merender teks, gambar, dan daftar', () => {
    render(
      <PageBlocks
        title="Halaman"
        rows={[
          {
            id: 'r1',
            blocks: [
              { id: 't', type: 'text', width: 12, payload: { text: 'Paragraf satu.\n\nParagraf dua.' } },
              { id: 'i', type: 'image', width: 6, payload: { src: '/media/a.jpg', alt: 'Logo' } },
              { id: 'l', type: 'list', width: 6, payload: { items: ['Satu', 'Dua'] } },
            ],
          },
        ]}
      />,
    )
    expect(screen.getByText('Paragraf satu.')).toBeInTheDocument()
    expect(screen.getByText('Paragraf dua.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Logo' })).toHaveAttribute('src', '/media/a.jpg')
    expect(screen.getByText('Satu')).toBeInTheDocument()
    expect(screen.getByText('Dua')).toBeInTheDocument()
  })

  it('melewatkan gambar tanpa src', () => {
    render(
      <PageBlocks
        title="Halaman"
        rows={[{ id: 'r1', blocks: [{ id: 'i', type: 'image', width: 12, payload: { src: '', alt: 'Kosong' } }] }]}
      />,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('merender garis dan cover video YouTube', () => {
    render(
      <PageBlocks
        title="Halaman"
        rows={[
          {
            id: 'r1',
            blocks: [
              { id: 'd', type: 'divider', width: 12, payload: { color: 'accent', thickness: 4 } },
              { id: 'v', type: 'video', width: 12, payload: { url: 'https://youtu.be/dQw4w9wgGcQ' } },
            ],
          },
        ]}
      />,
    )
    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Putar video' }).querySelector('img')).toHaveAttribute(
      'src',
      'https://i.ytimg.com/vi/dQw4w9wgGcQ/hqdefault.jpg',
    )
  })
})
