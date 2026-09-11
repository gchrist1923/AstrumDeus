import { describe, expect, it } from 'vitest'
import { describeImageMeta, formatFileSize } from '@/lib/media/meta'

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

describe('formatFileSize', () => {
  it('memakai B, KB, dan MB dengan koma Indonesia', () => {
    expect(formatFileSize(24)).toBe('24 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(24 * 1024)).toBe('24 KB')
    expect(formatFileSize(Math.round(1.2 * 1024 * 1024))).toBe('1,2 MB')
  })
})

describe('describeImageMeta', () => {
  it('membaca PNG dari magic byte', () => {
    expect(describeImageMeta(PNG)).toEqual({ fileType: 'PNG', fileSize: '8 B' })
  })

  it('mengembalikan null jika bukan gambar', () => {
    expect(describeImageMeta(Uint8Array.from([0x25, 0x50, 0x44, 0x46]))).toBeNull()
  })
})
