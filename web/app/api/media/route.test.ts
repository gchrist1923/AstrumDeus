import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/session', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCurrentUser } from '@/lib/auth/session'
import { POST } from '@/app/api/media/route'

const JPEG = new Blob([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46])], {
  type: 'image/jpeg',
})
const PDF = new Blob([Uint8Array.from([0x25, 0x50, 0x44, 0x46])], { type: 'application/pdf' })

function body(file: Blob, name: string) {
  const data = new FormData()
  data.set('file', file, name)
  return { formData: async () => data } as unknown as Request
}

describe('POST /api/media', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'ad-media-post-'))
    process.env.UPLOADS_DIR = dir
  })

  afterEach(async () => {
    delete process.env.UPLOADS_DIR
    await rm(dir, { recursive: true, force: true })
  })

  it('visitor mendapat 401', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)
    const res = await POST(body(JPEG, 'foto.jpg'))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual({ error: 'gagal' })
  })

  it('team tanpa CMS mendapat 401', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 'u1',
      email: 'team@x.id',
      name: 'Team',
      roles: ['team'],
    })
    const res = await POST(body(JPEG, 'foto.jpg'))
    expect(res.status).toBe(401)
  })

  it('editor menerima JPEG dan mengembalikan path /media/...', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 'u2',
      email: 'ed@x.id',
      name: 'Ed',
      roles: ['editor'],
    })
    const res = await POST(body(JPEG, 'foto.jpg'))
    expect(res.status).toBe(201)
    const json = (await res.json()) as { path: string }
    expect(json.path).toMatch(/^\/media\/.+\.jpg$/)
  })

  it('menolak PDF dengan 400 jenis', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 'u2',
      email: 'ed@x.id',
      name: 'Ed',
      roles: ['editor'],
    })
    const res = await POST(body(PDF, 'dokumen.pdf'))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'jenis' })
  })
})
