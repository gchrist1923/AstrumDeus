import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    player: { count: vi.fn() },
    newsPost: { count: vi.fn() },
    mediaKitAsset: { count: vi.fn() },
    siteSetting: { count: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { saveImageBuffer, readMediaFile, releaseMediaPath, isManagedMediaPath } from '@/lib/media/store'

const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46])

describe('store media', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'ad-uploads-'))
    process.env.UPLOADS_DIR = dir
    vi.mocked(prisma.player.count).mockResolvedValue(0)
    vi.mocked(prisma.newsPost.count).mockResolvedValue(0)
    vi.mocked(prisma.mediaKitAsset.count).mockResolvedValue(0)
    vi.mocked(prisma.siteSetting.count).mockResolvedValue(0)
  })

  afterEach(async () => {
    delete process.env.UPLOADS_DIR
    await rm(dir, { recursive: true, force: true })
  })

  it('menyimpan JPEG dengan nama acak dan path /media/...', async () => {
    const saved = await saveImageBuffer(JPEG)
    expect(saved.path).toMatch(/^\/media\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.jpg$/)
    const dibaca = await readMediaFile(saved.filename)
    expect(dibaca?.kind).toBe('jpeg')
    expect(dibaca?.bytes.byteLength).toBe(JPEG.byteLength)
    const disk = await readFile(path.join(dir, saved.filename))
    expect(disk.byteLength).toBe(JPEG.byteLength)
  })

  it('menghapus file lama /media/... bila tidak ada record lain', async () => {
    const lama = await saveImageBuffer(JPEG)
    await releaseMediaPath(lama.path, '/media/baru.jpg')
    await expect(readMediaFile(lama.filename)).resolves.toBeNull()
  })

  it('tidak menghapus bila masih ada record yang memakai path', async () => {
    const lama = await saveImageBuffer(JPEG)
    vi.mocked(prisma.player.count).mockResolvedValue(1)
    await releaseMediaPath(lama.path, '/media/baru.jpg')
    await expect(readMediaFile(lama.filename)).resolves.not.toBeNull()
  })

  it('tidak menghapus path seed di public/', async () => {
    expect(isManagedMediaPath('/portrait.jpg')).toBe(false)
    await expect(releaseMediaPath('/portrait.jpg', '/media/x.jpg')).resolves.toBeUndefined()
  })
})
