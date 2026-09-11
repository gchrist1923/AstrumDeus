import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RingkasanInternal } from '@/components/admin/ringkasan-internal'

describe('RingkasanInternal', () => {
  it('menampilkan agenda hari ini dan taut ke kalender', () => {
    render(
      <RingkasanInternal
        hariIso="2026-09-11"
        jadwal={[{ title: 'Scrim', waktu: '19:00' }]}
        kas={null}
      />,
    )
    expect(screen.getByRole('link', { name: /Jadwal/ })).toHaveAttribute(
      'href',
      '/internal/schedule?hari=2026-09-11',
    )
    expect(screen.getByText('Scrim')).toBeInTheDocument()
    expect(screen.getByText('19:00')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Laporan/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Kas/ })).not.toBeInTheDocument()
  })

  it('kosong jika tidak ada event hari ini', () => {
    render(<RingkasanInternal hariIso="2026-09-11" jadwal={[]} kas={null} />)
    expect(screen.getByText('Tidak ada jadwal hari ini.')).toBeInTheDocument()
  })

  it('menampilkan saldo tiap buku kas yang boleh dibaca', () => {
    render(
      <RingkasanInternal
        hariIso="2026-09-11"
        jadwal={null}
        kas={[{ nama: 'Kas operasional', saldo: 15000 }]}
      />,
    )
    expect(screen.getByRole('link', { name: /Kas/ })).toHaveAttribute('href', '/internal/cash')
    expect(screen.getByText('Kas operasional')).toBeInTheDocument()
    expect(screen.getByText(/15.?000/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Jadwal/ })).not.toBeInTheDocument()
  })
})
