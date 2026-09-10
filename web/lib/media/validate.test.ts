import { describe, expect, it } from 'vitest'
import { validateImageBuffer } from '@/lib/media/validate'

const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const WEBP = Uint8Array.from([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
])
const PDF = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d])

describe('validateImageBuffer', () => {
  it('menerima JPEG, PNG, dan WebP di bawah 15 MB', () => {
    expect(validateImageBuffer(JPEG)).toEqual({ ok: true, kind: 'jpeg' })
    expect(validateImageBuffer(PNG)).toEqual({ ok: true, kind: 'png' })
    expect(validateImageBuffer(WEBP)).toEqual({ ok: true, kind: 'webp' })
  })

  it('menolak PDF', () => {
    expect(validateImageBuffer(PDF)).toEqual({ ok: false, error: 'jenis' })
  })

  it('menolak file lebih dari 15 MB meski magic JPEG valid', () => {
    const besar = new Uint8Array(15 * 1024 * 1024 + 1)
    besar.set(JPEG, 0)
    expect(validateImageBuffer(besar)).toEqual({ ok: false, error: 'ukuran' })
  })
})
