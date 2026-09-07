import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { fontVariables } from '@/app/fonts'

const layout = readFileSync(path.join(process.cwd(), 'app', 'layout.tsx'), 'utf8')

describe('fontVariables', () => {
  it('menggabungkan variabel kedua keluarga huruf', () => {
    expect(fontVariables).toContain('--font-chakra-petch')
    expect(fontVariables).toContain('--font-barlow')
  })
})

describe('root layout', () => {
  it('menyetel bahasa halaman ke Bahasa Indonesia', () => {
    expect(layout).toContain('lang="id"')
  })

  it('memasang variabel font di elemen html', () => {
    expect(layout).toContain('fontVariables')
  })

  it('memakai token latar dan teks, bukan warna mentah', () => {
    expect(layout).toContain('bg-surface-base')
    expect(layout).toContain('text-content-primary')
    expect(layout).not.toMatch(/#[0-9A-Fa-f]{6}/)
  })
})
