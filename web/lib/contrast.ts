interface Rgb {
  r: number
  g: number
  b: number
}

function hexToRgb(hex: string): Rgb {
  const bersih = hex.trim().replace(/^#/, '')

  if (!/^[0-9a-fA-F]{6}$/.test(bersih)) {
    throw new Error(`Warna harus hex enam digit, dapat: ${hex}`)
  }

  return {
    r: Number.parseInt(bersih.slice(0, 2), 16),
    g: Number.parseInt(bersih.slice(2, 4), 16),
    b: Number.parseInt(bersih.slice(4, 6), 16),
  }
}

function luminansiKanal(nilai: number): number {
  const c = nilai / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)

  return 0.2126 * luminansiKanal(r) + 0.7152 * luminansiKanal(g) + 0.0722 * luminansiKanal(b)
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const terang = Math.max(a, b)
  const gelap = Math.min(a, b)

  return (terang + 0.05) / (gelap + 0.05)
}
