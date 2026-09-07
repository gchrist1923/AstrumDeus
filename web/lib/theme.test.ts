import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/contrast'
import { parseThemeColors, parseThemeTokens, readGlobalsCss } from '@/lib/theme'

const css = readGlobalsCss()
const warna = parseThemeColors(css)
const token = parseThemeTokens(css)

const WARNA_WAJIB = [
  'surface-base',
  'surface-raised',
  'surface-overlay',
  'border',
  'border-strong',
  'content-primary',
  'content-secondary',
  'content-muted',
  'accent',
  'accent-strong',
  'accent-soft',
  'danger',
  'danger-solid',
]

const PASANGAN_TEKS: Array<[string, string]> = [
  ['content-primary', 'surface-base'],
  ['content-primary', 'surface-raised'],
  ['content-primary', 'surface-overlay'],
  ['content-secondary', 'surface-base'],
  ['content-secondary', 'surface-raised'],
  ['content-muted', 'surface-base'],
  ['content-muted', 'surface-raised'],
  ['accent', 'surface-base'],
  ['accent', 'surface-raised'],
  ['accent-soft', 'surface-raised'],
  ['accent-strong', 'surface-raised'],
  ['danger', 'surface-base'],
  ['danger', 'surface-raised'],
  ['surface-raised', 'accent'],
  ['content-primary', 'danger-solid'],
]

const PASANGAN_KONTROL: Array<[string, string]> = [
  ['border-strong', 'surface-base'],
  ['border-strong', 'surface-raised'],
]

describe('parseThemeTokens', () => {
  it('melewati baris reset seperti --color-*: initial', () => {
    const hasil = parseThemeTokens('@theme {\n  --color-*: initial;\n  --color-accent: #F0B429;\n}')

    expect(hasil).toEqual({ 'color-accent': '#F0B429' })
  })

  it('melempar error bila blok @theme tidak ada', () => {
    expect(() => parseThemeTokens(':root { --color-accent: #F0B429; }')).toThrow(/@theme/)
  })
})

describe('token warna di globals.css', () => {
  it('memuat seluruh warna yang dipakai desain', () => {
    expect(Object.keys(warna).sort()).toEqual([...WARNA_WAJIB].sort())
  })

  it('menulis setiap warna sebagai hex enam digit, bukan rgba', () => {
    for (const [nama, nilai] of Object.entries(warna)) {
      expect(nilai, `token ${nama}`).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it.each(PASANGAN_TEKS)('kontras teks %s di atas %s minimal 4,5:1', (depan, belakang) => {
    expect(contrastRatio(warna[depan], warna[belakang])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(PASANGAN_KONTROL)('kontras batas kontrol %s di atas %s minimal 3:1', (depan, belakang) => {
    expect(contrastRatio(warna[depan], warna[belakang])).toBeGreaterThanOrEqual(3)
  })
})

describe('token huruf, skala dan breakpoint', () => {
  it('mendaftarkan dua keluarga huruf', () => {
    expect(token['font-display']).toContain('Chakra Petch')
    expect(token['font-text']).toContain('Barlow')
  })

  it('mendaftarkan seluruh tingkat skala tipografi', () => {
    for (const tingkat of ['display', 'page', 'section', 'card', 'body', 'article', 'small', 'label']) {
      expect(token[`text-${tingkat}`], `tingkat ${tingkat}`).toBeDefined()
    }
  })

  it('memakai breakpoint 640, 960 dan 1240 piksel', () => {
    expect(token['breakpoint-sm']).toBe('40rem')
    expect(token['breakpoint-md']).toBe('60rem')
    expect(token['breakpoint-lg']).toBe('77.5rem')
  })

  it('mendaftarkan container halaman selebar 1240 piksel', () => {
    expect(token['container-page']).toBe('77.5rem')
  })

  it('memberi bobot huruf pada tingkat display supaya memakai berat yang benar-benar diunduh', () => {
    expect(token['text-display--font-weight']).toBe('700')
    expect(token['text-label--font-weight']).toBe('700')
  })
})

describe('aturan gerak', () => {
  it('menonaktifkan animasi saat prefers-reduced-motion aktif', () => {
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
