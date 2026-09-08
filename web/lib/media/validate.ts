import { MAX_IMAGE_BYTES, type ImageKind } from '@/lib/media/constants'

function startsWith(bytes: Uint8Array, prefix: number[]): boolean {
  if (bytes.length < prefix.length) {
    return false
  }
  return prefix.every((nilai, i) => bytes[i] === nilai)
}

export function detectImageKind(bytes: Uint8Array): ImageKind | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return 'jpeg'
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'png'
  }
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp'
  }
  return null
}

export function validateImageBuffer(
  bytes: Uint8Array,
): { ok: true; kind: ImageKind } | { ok: false; error: 'jenis' | 'ukuran' } {
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'ukuran' }
  }
  const kind = detectImageKind(bytes)
  if (!kind) {
    return { ok: false, error: 'jenis' }
  }
  return { ok: true, kind }
}
