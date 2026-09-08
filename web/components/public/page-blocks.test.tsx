import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageBlocks } from '@/components/public/page-blocks'

describe('PageBlocks', () => {
  it('merender judul halaman jika baris kosong', () => {
    render(<PageBlocks rows={[]} title="Academy" />)

    expect(screen.getByRole('heading', { name: 'Academy' })).toBeInTheDocument()
  })
})
