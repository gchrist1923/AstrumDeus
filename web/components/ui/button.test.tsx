import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('merender label sebagai nama yang terbaca', () => {
    render(<Button>Lihat roster</Button>)

    expect(screen.getByRole('button', { name: 'Lihat roster' })).toBeInTheDocument()
  })

  it('memakai varian primary secara default', () => {
    render(<Button>Kirim</Button>)

    expect(screen.getByRole('button')).toHaveClass('bg-accent')
  })

  it('memakai latar danger-solid pada varian destruktif', () => {
    render(<Button variant="destructive">Hapus</Button>)

    expect(screen.getByRole('button')).toHaveClass('bg-danger-solid')
  })

  it('memakai bingkai border-strong pada varian sekunder', () => {
    render(<Button variant="secondary">Jadwal</Button>)

    expect(screen.getByRole('button')).toHaveClass('border-border-strong')
  })

  it('menjaga area sentuh minimal 44 piksel', () => {
    render(<Button>Menu</Button>)

    const tombol = screen.getByRole('button')

    expect(tombol).toHaveClass('min-h-11')
    expect(tombol).toHaveClass('min-w-11')
  })

  it('menampilkan focus state yang terlihat', () => {
    render(<Button>Kirim</Button>)

    expect(screen.getByRole('button').className).toContain('focus-visible:outline-2')
  })

  it('memakai type button secara default supaya tidak submit form tanpa sengaja', () => {
    render(<Button>Kirim</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('meneruskan klik ke handler', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Kirim</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('tidak meneruskan klik saat dinonaktifkan', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Kirim
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<Button>Lihat roster</Button>)

    expect(await axe(container)).toHaveNoViolations()
  })
})
