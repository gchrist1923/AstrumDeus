export function ringkasPesan(teks: string, batas = 10): string {
  const kata = teks.trim().split(/\s+/).filter(Boolean)
  if (kata.length === 0) {
    return ''
  }
  if (kata.length <= batas) {
    return kata.join(' ')
  }
  return `${kata.slice(0, batas).join(' ')}...`
}
