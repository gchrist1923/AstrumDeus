import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { FlashToast } from '@/components/admin/flash-toast'

const replace = vi.fn()
let query = 'ok=simpan'

vi.mock('next/navigation', () => ({
  usePathname: () => '/cms/news',
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(query),
}))

describe('FlashToast', () => {
  beforeEach(() => {
    replace.mockClear()
    query = 'ok=simpan'
  })

  it('menampilkan toast sukses dan role status', () => {
    render(<FlashToast />)
    expect(screen.getByRole('status')).toHaveTextContent('Tersimpan.')
  })

  it('menampilkan toast error yang tetap sampai ditutup', async () => {
    query = 'kesalahan=isi'
    render(<FlashToast />)
    expect(screen.getByRole('alert')).toHaveTextContent('Isi kolom yang wajib.')
    await userEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<FlashToast />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
