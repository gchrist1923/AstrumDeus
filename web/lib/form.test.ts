import { describe, expect, it } from 'vitest'
import { adaKosong, emailValid, teks } from '@/lib/form'

describe('emailValid', () => {
  it('menerima email sederhana', () => {
    expect(emailValid('admin@astrumdeus.id')).toBe(true)
  })

  it('menolak kosong dan tanpa @', () => {
    expect(emailValid('')).toBe(false)
    expect(emailValid('bukan-email')).toBe(false)
  })
})

describe('adaKosong', () => {
  it('true jika salah satu kunci kosong setelah trim', () => {
    const data = new FormData()
    data.set('nama', '  ')
    data.set('email', 'a@b.c')
    expect(adaKosong(data, ['nama', 'email'])).toBe(true)
  })

  it('false jika semua terisi', () => {
    const data = new FormData()
    data.set('nama', 'Grace')
    data.set('email', 'a@b.c')
    expect(adaKosong(data, ['nama', 'email'])).toBe(false)
    expect(teks(data, 'nama')).toBe('Grace')
  })
})
