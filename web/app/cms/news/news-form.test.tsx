import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NewsForm } from '@/app/cms/news/news-form'

vi.mock('@/components/admin/image-upload', () => ({
  ImageUpload: ({ disabled }: { disabled?: boolean }) => (
    <p>{disabled ? 'Unggah terkunci' : 'Unggah terbuka'}</p>
  ),
}))

describe('NewsForm', () => {
  it('memakai judul Berita baru atau Ubah berita', () => {
    const { rerender } = render(<NewsForm categories={[{ id: 'c1', name: 'Recap' }]} canSave />)
    expect(screen.getByRole('heading', { name: 'Berita baru' })).toBeInTheDocument()
    rerender(
      <NewsForm
        categories={[{ id: 'c1', name: 'Recap' }]}
        canSave
        post={{
          id: 'p1',
          title: 'A',
          slug: 'a',
          excerpt: '',
          body: 'b',
          cover: '',
          categoryId: 'c1',
          author: 'Admin',
          publishedAt: new Date('2026-01-01'),
          status: 'draft',
        }}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Ubah berita' })).toBeInTheDocument()
  })

  it('mengunci field jika hanya lihat', () => {
    render(<NewsForm categories={[{ id: 'c1', name: 'Recap' }]} canSave={false} />)
    expect(screen.getByLabelText('Judul')).toBeDisabled()
    expect(screen.getByLabelText('Kategori')).toBeDisabled()
    expect(screen.getByText('Unggah terkunci')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Simpan' })).not.toBeInTheDocument()
  })
})
