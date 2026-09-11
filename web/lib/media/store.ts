import { randomBytes } from 'node:crypto'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  KIND_TO_EXT,
  KIND_TO_MIME,
  MEDIA_FILENAME_RE,
  MEDIA_URL_PREFIX,
  type ImageKind,
} from '@/lib/media/constants'
import { detectImageKind, validateImageBuffer } from '@/lib/media/validate'
import { prisma } from '@/lib/db'

export function getUploadsDir(): string {
  return process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads')
}

export function isManagedMediaPath(urlPath: string): boolean {
  if (!urlPath.startsWith(MEDIA_URL_PREFIX)) {
    return false
  }
  return MEDIA_FILENAME_RE.test(urlPath.slice(MEDIA_URL_PREFIX.length))
}

export function publicPathForFilename(filename: string): string {
  return `${MEDIA_URL_PREFIX}${filename}`
}

export function filenameFromPublicPath(urlPath: string): string | null {
  if (!isManagedMediaPath(urlPath)) {
    return null
  }
  return urlPath.slice(MEDIA_URL_PREFIX.length)
}

export async function saveImageBuffer(bytes: Uint8Array): Promise<{ path: string; filename: string }> {
  const hasil = validateImageBuffer(bytes)
  if (!hasil.ok) {
    throw new Error(hasil.error)
  }
  const filename = `${randomBytes(16).toString('hex')}.${KIND_TO_EXT[hasil.kind]}`
  const dir = getUploadsDir()
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), bytes)
  return { path: publicPathForFilename(filename), filename }
}

export async function readMediaFile(filename: string): Promise<{ bytes: Uint8Array; kind: ImageKind; mime: string } | null> {
  if (!MEDIA_FILENAME_RE.test(filename)) {
    return null
  }
  try {
    const buf = await readFile(path.join(getUploadsDir(), filename))
    const bytes = new Uint8Array(buf)
    const kind = detectImageKind(bytes)
    if (!kind) {
      return null
    }
    return { bytes, kind, mime: KIND_TO_MIME[kind] }
  } catch {
    return null
  }
}

export async function deleteMediaFile(urlPath: string): Promise<void> {
  const filename = filenameFromPublicPath(urlPath)
  if (!filename) {
    return
  }
  try {
    await unlink(path.join(getUploadsDir(), filename))
  } catch {
    // sudah tidak ada
  }
}

export async function countMediaPathUses(urlPath: string): Promise<number> {
  const [players, posts, assets, settings, partners] = await Promise.all([
    prisma.player.count({ where: { photo: urlPath } }),
    prisma.newsPost.count({ where: { cover: urlPath } }),
    prisma.mediaKitAsset.count({ where: { href: urlPath } }),
    prisma.siteSetting.count({
      where: { OR: [{ logo: urlPath }, { favicon: urlPath }, { heroImage: urlPath }] },
    }),
    prisma.partner.count({ where: { logo: urlPath } }),
  ])
  return players + posts + assets + settings + partners
}

export async function releaseMediaPath(
  oldPath: string | null | undefined,
  newPath: string,
): Promise<void> {
  if (!oldPath || oldPath === newPath || !isManagedMediaPath(oldPath)) {
    return
  }
  const uses = await countMediaPathUses(oldPath)
  if (uses === 0) {
    await deleteMediaFile(oldPath)
  }
}
