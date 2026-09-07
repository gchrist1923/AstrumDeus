import { readFileSync } from 'node:fs'
import path from 'node:path'

export function parseThemeTokens(css: string): Record<string, string> {
  const blok = css.match(/@theme\s*\{([\s\S]*?)\n\}/)

  if (!blok) {
    throw new Error('Blok @theme tidak ditemukan di CSS yang diberikan')
  }

  const token: Record<string, string> = {}

  for (const baris of blok[1].split('\n')) {
    const cocok = baris.match(/^\s*--([a-z0-9-]+):\s*([^;]+);/)

    if (cocok) {
      token[cocok[1]] = cocok[2].trim()
    }
  }

  return token
}

export function parseThemeColors(css: string): Record<string, string> {
  const warna: Record<string, string> = {}

  for (const [kunci, nilai] of Object.entries(parseThemeTokens(css))) {
    if (kunci.startsWith('color-') && /^#[0-9A-Fa-f]{6}$/.test(nilai)) {
      warna[kunci.slice('color-'.length)] = nilai
    }
  }

  return warna
}

export function readGlobalsCss(): string {
  return readFileSync(path.join(process.cwd(), 'app', 'globals.css'), 'utf8')
}
