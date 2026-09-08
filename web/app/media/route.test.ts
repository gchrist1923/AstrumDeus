import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { saveImageBuffer } from '@/lib/media/store'
import { GET } from '@/app/media/[filename]/route'

const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46])

describe('GET /media/[filename]', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'ad-media-get-'))
    process.env.UPLOADS_DIR = dir
  })

  afterEach(async () => {
    delete process.env.UPLOADS_DIR
    await rm(dir, { recursive: true, force: true })
  })

  it('mengembalikan bytes JPEG untuk file yang ada', async () => {
    const saved = await saveImageBuffer(JPEG)
    const res = await GET(new Request(`http://localhost/media/${saved.filename}`), {
      params: Promise.resolve({ filename: saved.filename }),
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/jpeg')
    const buf = new Uint8Array(await res.arrayBuffer())
    expect(buf.byteLength).toBe(JPEG.byteLength)
  })

  it('404 untuk traversal dan file hilang', async () => {
    const traversal = await GET(new Request('http://localhost/media/x'), {
      params: Promise.resolve({ filename: '../secret.jpg' }),
    })
    expect(traversal.status).toBe(404)
    const missing = await GET(new Request('http://localhost/media/tidak-ada.jpg'), {
      params: Promise.resolve({ filename: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.jpg' }),
    })
    expect(missing.status).toBe(404)
  })
})
