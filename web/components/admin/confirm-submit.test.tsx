import type React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'

describe('ConfirmSubmit', () => {
  it('mencegah submit jika confirm false', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    expect(window.confirm).toHaveBeenCalledWith('Hapus pesan ini?')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
