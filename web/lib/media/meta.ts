import { type ImageKind } from '@/lib/media/constants'
import { detectImageKind } from '@/lib/media/validate'

export const KIND_LABEL: Record<ImageKind, string> = {
  jpeg: 'JPEG',
  png: 'PNG',
  webp: 'WebP',
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${formatJumlah(bytes / 1024)} KB`
  }
  return `${formatJumlah(bytes / (1024 * 1024))} MB`
}

export function describeImageMeta(bytes: Uint8Array): { fileType: string; fileSize: string } | null {
  const kind = detectImageKind(bytes)
  if (!kind) {
    return null
  }
  return { fileType: KIND_LABEL[kind], fileSize: formatFileSize(bytes.byteLength) }
}

function formatJumlah(nilai: number): string {
  const dibulatkan = nilai >= 10 ? Math.round(nilai) : Math.round(nilai * 10) / 10
  return String(dibulatkan).replace('.', ',')
}
