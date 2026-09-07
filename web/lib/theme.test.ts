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
  'danger-strong',
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
  ['content-primary', 'danger-strong'],
]

const PASANGAN_KONTROL: Array<[string, string]> = [
  ['border-strong', 'surface-base'],
  ['border-strong', 'surface-raised'],
  ['border-strong', 'surface-overlay'],
]

const WARNA_DISETUJUI: Record<string, string> = {
  'surface-base': '#171717',
  'surface-raised': '#212121',
  'surface-overlay': '#2A2A2A',
  border: '#383838',
  'border-strong': '#7C7C7C',
  'content-primary': '#FFFFFF',
  'content-secondary': '#BCBCBC',
  'content-muted': '#9B9B9B',
  accent: '#F0B429',
  'accent-strong': '#C68A15',
  'accent-soft': '#FFD166',
  danger: '#FF6369',
  'danger-solid': '#C62828',
  'danger-strong': '#9E1F1F',
}

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

  it('memakai nilai hex yang disetujui persis untuk setiap warna', () => {
    for (const [nama, hex] of Object.entries(WARNA_DISETUJUI)) {
      expect(warna[nama], `token ${nama}`).toBe(hex)
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
    const blok = css.match(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{([\s\S]*?)\}/)?.[1] ?? ''

    expect(blok).toContain('animation-duration: 0.01ms !important')
    expect(blok).toContain('animation-iteration-count: 1 !important')
    expect(blok).toContain('transition-duration: 0.01ms !important')
    expect(blok).toContain('scroll-behavior: auto !important')
  })
})
