import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { KELAS_FOKUS } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('mengisi hidden input dari defaultValue dan menampilkan hint', () => {
    render(<ImageUpload name="photo" label="Foto" defaultValue="/portrait.jpg" />)
    expect(screen.getByDisplayValue('/portrait.jpg')).toHaveAttribute('name', 'photo')
    expect(screen.getByText('JPG, PNG, atau WebP. Maksimal 15 MB.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pilih gambar' })).toBeEnabled()
    const pratinjau = screen.getByRole('img', { name: 'Pratinjau Foto' })
    expect(pratinjau).toHaveAttribute('src', '/portrait.jpg')
    expect(pratinjau).toHaveClass('object-contain')
    expect(pratinjau).toHaveClass('self-start')
  })

  it('menyembunyikan pratinjau jika hidePreview', () => {
    render(<ImageUpload name="photo" label="Foto" defaultValue="/portrait.jpg" hidePreview />)
    expect(screen.queryByRole('img', { name: 'Pratinjau Foto' })).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('/portrait.jpg')).toHaveAttribute('name', 'photo')
  })

  it('mengisi jenis dan ukuran readonly setelah unggah PNG', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ path: '/media/logo.png' }),
    } as Response)
    const pngBytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    const user = userEvent.setup()
    render(
      <ImageUpload
        name="href"
        label="Berkas"
        meta={{
          fileTypeName: 'fileType',
          fileSizeName: 'fileSize',
          defaultFileType: '—',
          defaultFileSize: '—',
        }}
      />,
    )
    const jenis = screen.getByLabelText('Jenis')
    const ukuran = screen.getByLabelText('Ukuran')
    expect(jenis).toHaveAttribute('name', 'fileType')
    expect(ukuran).toHaveAttribute('name', 'fileSize')
    expect(jenis).toHaveAttribute('readOnly')
    expect(ukuran).toHaveAttribute('readOnly')
    expect(jenis).toHaveValue('—')
    expect(screen.getAllByText('Diisi otomatis dari berkas.')).toHaveLength(2)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const png = new File([pngBytes], 'logo.png', { type: 'image/png' })
    await user.upload(input, png)
    await waitFor(() => {
      expect(screen.getByDisplayValue('/media/logo.png')).toHaveAttribute('name', 'href')
    })
    expect(jenis).toHaveValue('PNG')
    expect(ukuran).toHaveValue('8 B')
  })

  it('menolak PDF di klien tanpa fetch', async () => {
    const user = userEvent.setup({ applyAccept: false })
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const pdf = new File([Uint8Array.from([0x25, 0x50, 0x44, 0x46])], 'x.pdf', { type: 'application/pdf' })
    await user.upload(input, pdf)
    expect(await screen.findByText('Pilih file JPG, PNG, atau WebP.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'photo-error')
    expect(document.activeElement).toBe(input)
  })

  it('menolak file lebih dari 15 MB tanpa fetch', async () => {
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'a.jpg', { type: 'image/jpeg' })
    Object.defineProperty(jpeg, 'size', { value: 15 * 1024 * 1024 + 1 })
    await user.upload(input, jpeg)
    expect(await screen.findByText('Ukuran file maksimal 15 MB.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('mengirim JPEG dan menulis path dari server', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ path: '/media/abcd.jpg' }),
    } as Response)
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'a.jpg', { type: 'image/jpeg' })
    await user.upload(input, jpeg)
    expect(fetch).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByDisplayValue('/media/abcd.jpg')).toHaveAttribute('name', 'photo')
    })
    expect(vi.mocked(fetch).mock.calls[0]?.[0]).toBe('/api/media')
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({
      method: 'POST',
      credentials: 'include',
    })
    expect(screen.getByRole('img', { name: 'Pratinjau Foto' })).toHaveAttribute('src', '/media/abcd.jpg')
  })

  it('memanggil onPathChange setelah unggah berhasil', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ path: '/media/abcd.jpg' }),
    } as Response)
    const onPathChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" onPathChange={onPathChange} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'a.jpg', { type: 'image/jpeg' })
    await user.upload(input, jpeg)
    await waitFor(() => {
      expect(onPathChange).toHaveBeenCalledWith('/media/abcd.jpg')
    })
    expect(screen.getByDisplayValue('/media/abcd.jpg')).toHaveAttribute('name', 'photo')
  })

  it('menampilkan error gagal saat unggahan ditolak server', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'gagal' }),
    } as Response)
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'a.jpg', { type: 'image/jpeg' })
    await user.upload(input, jpeg)
    expect(await screen.findByText('Unggahan gagal. Coba lagi.')).toBeInTheDocument()
    expect(document.activeElement).toBe(input)
  })

  it('menonaktifkan tombol menjadi Mengunggah… selama permintaan', async () => {
    let selesai: (value: Response) => void = () => {}
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise((resolve) => {
          selesai = resolve
        }),
    )
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'a.jpg', { type: 'image/jpeg' })
    await user.upload(input, jpeg)
    expect(await screen.findByRole('button', { name: 'Mengunggah…' })).toBeDisabled()
    selesai({
      ok: true,
      status: 201,
      json: async () => ({ path: '/media/abcd.jpg' }),
    } as Response)
    expect(await screen.findByRole('button', { name: 'Pilih gambar' })).toBeEnabled()
  })

  it('meneruskan required ke hidden input', () => {
    render(<ImageUpload name="photo" label="Foto" required />)
    const hidden = document.querySelector('input[type="hidden"][name="photo"]') as HTMLInputElement
    expect(hidden).toHaveAttribute('required')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<ImageUpload name="photo" label="Foto" defaultValue="/portrait.jpg" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('tidak memanggil fetch dua kali saat file kedua dipilih selama unggah', async () => {
    let selesai: (value: Response) => void = () => {}
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise((resolve) => {
          selesai = resolve
        }),
    )
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg1 = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'satu.jpg', { type: 'image/jpeg' })
    const jpeg2 = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x01])], 'dua.jpg', { type: 'image/jpeg' })
    await user.upload(input, jpeg1)
    expect(await screen.findByRole('button', { name: 'Mengunggah…' })).toBeDisabled()
    expect(fetch).toHaveBeenCalledTimes(1)
    await user.upload(input, jpeg2)
    expect(fetch).toHaveBeenCalledTimes(1)
    selesai({
      ok: true,
      status: 201,
      json: async () => ({ path: '/media/abcd.jpg' }),
    } as Response)
    await waitFor(() => {
      expect(screen.getByDisplayValue('/media/abcd.jpg')).toHaveAttribute('name', 'photo')
    })
  })

  it('menampilkan fokus tampak dan aria-invalid pada kontrol terlihat setelah error PDF', async () => {
    const user = userEvent.setup({ applyAccept: false })
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const pdf = new File([Uint8Array.from([0x25, 0x50, 0x44, 0x46])], 'x.pdf', { type: 'application/pdf' })
    await user.upload(input, pdf)
    expect(await screen.findByText('Pilih file JPG, PNG, atau WebP.')).toBeInTheDocument()
    expect(document.activeElement).toBe(input)
    expect(input).not.toHaveClass('sr-only')
    const pembungkus = input.parentElement
    expect(pembungkus).toBeTruthy()
    for (const kelas of KELAS_FOKUS.split(' ')) {
      expect(pembungkus).toHaveClass(kelas)
    }
    expect(pembungkus).toHaveClass('focus-within:outline-2')
    const tombol = screen.getByRole('button', { name: 'Pilih gambar' })
    expect(tombol).toHaveAttribute('aria-invalid', 'true')
    expect(tombol).toHaveAttribute('aria-describedby', 'photo-error')
  })

  it('menyembunyikan Pilih gambar saat disabled', () => {
    render(<ImageUpload name="photo" label="Foto" defaultValue="/portrait.jpg" disabled />)
    expect(screen.queryByRole('button', { name: 'Pilih gambar' })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Pratinjau Foto' })).toBeInTheDocument()
  })
})
