import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { ContactForm } from '@/components/public/contact-form'

describe('ContactForm', () => {
  it('menampilkan pilihan tujuan dengan label yang ditetapkan', () => {
    render(<ContactForm />)

    expect(screen.getByRole('option', { name: 'Kerja sama sponsor' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Media dan pers' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Tryout pemain' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Lainnya' })).toBeInTheDocument()
  })

  it('menampilkan error per field dan mempertahankan nilai saat gagal', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nama'), 'Grace')
    await user.type(screen.getByLabelText('Email'), 'bukan-email')
    await user.selectOptions(screen.getByLabelText('Tujuan'), 'sponsor')
    await user.type(screen.getByLabelText('Pesan'), 'pendek')
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(await screen.findByText('Masukkan alamat email yang berisi @.')).toBeInTheDocument()
    expect(screen.getByText('Tulis pesan minimal 10 karakter.')).toBeInTheDocument()
    expect(screen.queryByText('Isi nama.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Nama')).toHaveValue('Grace')
    expect(screen.getByLabelText('Email')).toHaveValue('bukan-email')
    expect(screen.getByLabelText('Tujuan')).toHaveValue('sponsor')
    expect(screen.getByLabelText('Pesan')).toHaveValue('pendek')
  })

  it('menampilkan status sukses setelah kirim valid', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nama'), 'Grace')
    await user.type(screen.getByLabelText('Email'), 'grace@example.com')
    await user.selectOptions(screen.getByLabelText('Tujuan'), 'media')
    await user.type(screen.getByLabelText('Pesan'), 'Minta kutipan untuk liputan PMSL.')
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent('Pesan terkirim. Kami baca kotak masuk secara berkala.')
  })

  it('tidak punya pelanggaran aksesibilitas pada form kosong', async () => {
    const { container } = render(<ContactForm />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
