import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageCanvas } from '@/components/admin/page-canvas'
import type { PageRow } from '@/lib/pages/types'

function buatTransfer() {
  const store: Record<string, string> = {}
  return {
    setData(jenis: string, nilai: string) {
      store[jenis] = nilai
    },
    getData(jenis: string) {
      return store[jenis] ?? ''
    },
    effectAllowed: 'move',
    dropEffect: 'move',
  }
}

function seret(asal: Element, tujuan: Element) {
  const dataTransfer = buatTransfer()
  fireEvent.dragStart(asal, { dataTransfer })
  fireEvent.dragOver(tujuan, { dataTransfer })
  fireEvent.drop(tujuan, { dataTransfer })
}

function bacaLayout(): PageRow[] {
  const input = document.querySelector('input[name="layout"]') as HTMLInputElement
  return JSON.parse(input.value) as PageRow[]
}

const PALET: { label: string; type: string }[] = [
  { label: 'Judul', type: 'heading' },
  { label: 'Teks', type: 'text' },
  { label: 'Gambar', type: 'image' },
  { label: 'Tombol', type: 'button' },
  { label: 'Daftar', type: 'list' },
]

describe('PageCanvas', () => {
  it('menampilkan palet lima jenis yang bisa diseret', () => {
    render(<PageCanvas pageId="p1" initialRows={[]} />)

    for (const item of PALET) {
      const el = screen.getByRole('button', { name: item.label })
      expect(el).toHaveAttribute('draggable', 'true')
      expect(el).toHaveAttribute('data-block-type', item.type)
    }
  })

  it('menambah blok saat palet dijatuhkan ke baris', () => {
    render(<PageCanvas pageId="p1" initialRows={[]} />)
    seret(screen.getByRole('button', { name: 'Judul' }), screen.getByLabelText('Baris baru'))

    const rows = bacaLayout()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.blocks).toHaveLength(1)
    expect(rows[0]?.blocks[0]?.type).toBe('heading')
    expect(rows[0]?.blocks[0]?.width).toBe(4)
  })

  it('klik palet menambah blok di baris baru', () => {
    render(<PageCanvas pageId="p1" initialRows={[]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Judul' }))
    expect(bacaLayout()).toHaveLength(1)
    expect(bacaLayout()[0]?.blocks[0]?.type).toBe('heading')
  })

  it('mengabaikan drop jika canPlaceBlock menolak', () => {
    render(
      <PageCanvas
        pageId="p1"
        initialRows={[
          {
            id: 'r1',
            blocks: [{ id: 'b1', type: 'heading', width: 12, payload: { text: 'Penuh', level: 2 } }],
          },
        ]}
      />,
    )
    seret(screen.getByRole('button', { name: 'Teks' }), screen.getByLabelText('Baris 1'))

    const rows = bacaLayout()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.blocks).toHaveLength(1)
    expect(rows[0]?.blocks[0]?.type).toBe('heading')
  })

  it('mengubah lebar lewat tombol 4 / 6 / 8 / 12', () => {
    render(
      <PageCanvas
        pageId="p1"
        initialRows={[
          {
            id: 'r1',
            blocks: [{ id: 'b1', type: 'text', width: 4, payload: { text: 'Isi' } }],
          },
        ]}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Lebar 8' }))
    expect(bacaLayout()[0]?.blocks[0]?.width).toBe(8)
    expect(screen.getByRole('button', { name: 'Lebar 4' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lebar 6' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lebar 12' })).toBeInTheDocument()
  })

  it('memindah blok kiri dan kanan', () => {
    render(
      <PageCanvas
        pageId="p1"
        initialRows={[
          {
            id: 'r1',
            blocks: [
              { id: 'b1', type: 'heading', width: 4, payload: { text: 'Satu', level: 2 } },
              { id: 'b2', type: 'text', width: 4, payload: { text: 'Dua' } },
            ],
          },
        ]}
      />,
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Pindah kanan' })[0]!)
    expect(bacaLayout()[0]?.blocks.map((block) => block.id)).toEqual(['b2', 'b1'])
    fireEvent.click(screen.getAllByRole('button', { name: 'Pindah kiri' })[1]!)
    expect(bacaLayout()[0]?.blocks.map((block) => block.id)).toEqual(['b1', 'b2'])
  })

  it('mengubah urutan baris dengan Naik dan Turun', () => {
    render(
      <PageCanvas
        pageId="p1"
        initialRows={[
          { id: 'r1', blocks: [{ id: 'b1', type: 'heading', width: 12, payload: { text: 'Atas', level: 2 } }] },
          { id: 'r2', blocks: [{ id: 'b2', type: 'text', width: 12, payload: { text: 'Bawah' } }] },
        ]}
      />,
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Turun' })[0]!)
    expect(bacaLayout().map((row) => row.id)).toEqual(['r2', 'r1'])
    fireEvent.click(screen.getAllByRole('button', { name: 'Naik' })[1]!)
    expect(bacaLayout().map((row) => row.id)).toEqual(['r1', 'r2'])
  })

  it('memindah blok ke baris lain hanya jika muat', () => {
    render(
      <PageCanvas
        pageId="p1"
        initialRows={[
          { id: 'r1', blocks: [{ id: 'b1', type: 'heading', width: 4, payload: { text: 'Pindah', level: 2 } }] },
          { id: 'r2', blocks: [{ id: 'b2', type: 'text', width: 12, payload: { text: 'Penuh' } }] },
        ]}
      />,
    )
    seret(screen.getByLabelText('Blok Pindah'), screen.getByLabelText('Baris 2'))
    expect(bacaLayout()[0]?.blocks.map((block) => block.id)).toEqual(['b1'])
    expect(bacaLayout()[1]?.blocks.map((block) => block.id)).toEqual(['b2'])

    seret(screen.getByLabelText('Blok Pindah'), screen.getByLabelText('Baris baru'))
    expect(bacaLayout()).toHaveLength(3)
    expect(bacaLayout()[2]?.blocks[0]?.id).toBe('b1')
  })

  it('menyimpan layout JSON dan memakai ImageUpload pada blok gambar', () => {
    render(
      <PageCanvas
        pageId="hal-1"
        initialRows={[
          {
            id: 'r1',
            blocks: [{ id: 'img1', type: 'image', width: 6, payload: { src: '/media/a.jpg', alt: 'Logo' } }],
          },
        ]}
      />,
    )
    const layout = document.querySelector('input[name="layout"]') as HTMLInputElement
    const id = document.querySelector('input[name="id"]') as HTMLInputElement
    expect(id.value).toBe('hal-1')
    expect(JSON.parse(layout.value)[0].blocks[0].payload.src).toBe('/media/a.jpg')
    expect(screen.getByRole('button', { name: 'Pilih gambar' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('/media/a.jpg')).toBeInTheDocument()
  })
})
