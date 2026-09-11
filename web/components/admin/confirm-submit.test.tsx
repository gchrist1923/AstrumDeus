import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'

describe('ConfirmSubmit', () => {
  it('membuka dialog dan batal tidak submit', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    expect(onSubmit).not.toHaveBeenCalled()
    const dialog = screen.getByRole('dialog', { name: 'Hapus' })
    expect(within(dialog).getByText('Hapus pesan ini?')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('Escape menutup dialog tanpa submit', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submit hanya dari Hapus di dialog', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }))
    expect(onSubmit).toHaveBeenCalled()
  })

  it('tidak memakai window.confirm', () => {
    const sumber = readFileSync(join(__dirname, 'confirm-submit.tsx'), 'utf8')
    expect(sumber).not.toMatch(/window\.confirm/)
  })
})
