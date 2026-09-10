export const MAX_IMAGE_BYTES = 15 * 1024 * 1024
export const MEDIA_URL_PREFIX = '/media/'
export const MEDIA_FILENAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(jpe?g|png|webp)$/

export type ImageKind = 'jpeg' | 'png' | 'webp'

export const KIND_TO_EXT: Record<ImageKind, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
}

export const KIND_TO_MIME: Record<ImageKind, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}
