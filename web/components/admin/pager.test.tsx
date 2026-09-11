import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pager } from '@/components/admin/pager'

describe('Pager', () => {
  it('20 item / 5 menampilkan 4 tautan, halaman aktif ditandai', () => {
    render(<Pager page={2} pageCount={4} hrefFor={(hal) => `/cms/inbox?hal=${hal}`} />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('href', '/cms/inbox?hal=3')
  })

  it('satu halaman tidak merender nav', () => {
    const { container } = render(<Pager page={1} pageCount={1} hrefFor={(hal) => `?hal=${hal}`} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('empat halaman tidak memakai Berikut sebagai pengganti nomor', () => {
    render(<Pager page={1} pageCount={4} hrefFor={(hal) => `/cms/inbox?hal=${hal}`} />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
    expect(screen.queryByRole('link', { name: 'Berikut' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Hal 1 dari 4/)).not.toBeInTheDocument()
  })

  it('lebih dari 10 halaman memakai Sebelum/Berikut, bukan deretan nomor', () => {
    render(<Pager page={1} pageCount={11} hrefFor={(hal) => `/cms/inbox?hal=${hal}`} />)
    expect(screen.getByRole('link', { name: 'Berikut' })).toHaveAttribute('href', '/cms/inbox?hal=2')
    expect(screen.queryByRole('link', { name: 'Sebelum' })).not.toBeInTheDocument()
    expect(screen.getByText('Hal 1 dari 11')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '11' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
})
