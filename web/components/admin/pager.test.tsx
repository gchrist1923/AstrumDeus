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
})
