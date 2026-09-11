import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JadwalDialog } from '@/components/admin/jadwal-dialog'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

describe('JadwalDialog', () => {
  it('overlay dialog dengan judul, isi, dan Tutup', () => {
    render(
      <JadwalDialog judul="11 September 2026" tutupHref="/internal/schedule?bulan=2026-09">
        <p>Daftar event</p>
      </JadwalDialog>,
    )
    expect(screen.getByRole('dialog', { name: '11 September 2026' })).toBeInTheDocument()
    expect(screen.getByText('Daftar event')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tutup' })).toHaveAttribute(
      'href',
      '/internal/schedule?bulan=2026-09',
    )
  })

  it('Escape menavigasi ke tutupHref', () => {
    render(
      <JadwalDialog judul="Hari" tutupHref="/internal/schedule">
        <p>Isi</p>
      </JadwalDialog>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(push).toHaveBeenCalledWith('/internal/schedule')
  })
})
