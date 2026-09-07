import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/states'

describe('EmptyState', () => {
  it('menjelaskan apa yang akan tampil di tempat itu', () => {
    render(
      <EmptyState
        title="Belum ada pertandingan"
        description="Jadwal akan tampil di sini setelah Editor menambahkannya dari CMS."
      />,
    )

    expect(screen.getByRole('heading', { name: 'Belum ada pertandingan' })).toBeInTheDocument()
    expect(screen.getByText(/setelah Editor menambahkannya/)).toBeInTheDocument()
  })

  it('menampilkan tautan aksi bila diberikan', () => {
    render(
      <EmptyState
        title="Belum ada berita"
        description="Artikel yang terbit akan tampil di sini."
        action={{ label: 'Lihat arsip', href: '/news' }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Lihat arsip' })).toHaveAttribute('href', '/news')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<EmptyState title="Kosong" description="Belum ada isinya." />)

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ErrorState', () => {
  it('menyebutkan apa yang gagal dan menyediakan tombol coba lagi', async () => {
    const onRetry = vi.fn()
    render(
      <ErrorState
        title="Gagal memuat hasil pertandingan"
        description="Koneksi ke server terputus."
        onRetry={onRetry}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('mengumumkan pesan gagal ke screen reader', () => {
    render(<ErrorState title="Gagal memuat" description="Coba beberapa saat lagi." onRetry={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Gagal memuat')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(
      <ErrorState title="Gagal memuat" description="Coba lagi nanti." onRetry={vi.fn()} />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Skeleton', () => {
  it('tidak diumumkan ke screen reader bila tanpa label', () => {
    const { container } = render(<Skeleton className="h-24" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('mengumumkan status memuat bila diberi label', () => {
    render(<Skeleton className="h-24" label="Memuat hasil pertandingan" />)

    expect(screen.getByRole('status', { name: 'Memuat hasil pertandingan' })).toBeInTheDocument()
  })

  it('meneruskan kelas ukuran supaya bentuknya bisa menyerupai isi sebenarnya', () => {
    const { container } = render(<Skeleton className="h-24 w-full" />)

    expect(container.firstElementChild).toHaveClass('h-24')
    expect(container.firstElementChild).toHaveClass('w-full')
  })
})
