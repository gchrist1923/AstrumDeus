import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NewsForm } from '@/app/cms/news/news-form'

vi.mock('@/components/admin/image-upload', () => ({
  ImageUpload: ({ disabled }: { disabled?: boolean }) => (
    <p>{disabled ? 'Unggah terkunci' : 'Unggah terbuka'}</p>
  ),
}))

describe('NewsForm', () => {
  it('mengunci field jika hanya lihat', () => {
    render(<NewsForm categories={[{ id: 'c1', name: 'Recap' }]} canSave={false} />)
    expect(screen.getByLabelText('Judul')).toBeDisabled()
    expect(screen.getByLabelText('Kategori')).toBeDisabled()
    expect(screen.getByText('Unggah terkunci')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Simpan' })).not.toBeInTheDocument()
  })
})
