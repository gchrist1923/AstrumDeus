# CMS unggah gambar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Editor dan Admin mengunggah JPEG/PNG/WebP ke disk `web/uploads/`, menyimpan path `/media/...` di database, dan menampilkan file itu di situs publik tanpa input path teks.

**Architecture:** Validasi magic-byte + ukuran di `web/lib/media/`. POST `/api/media` (session CMS + `canWriteContent`) menulis file bernama acak. GET `/media/[filename]` membaca disk. Komponen klien `ImageUpload` mengisi hidden input. Saat record ganti path `/media/...` yang tidak terpakai, file lama dihapus. Path seed di `web/public/` tetap valid.

**Tech Stack:** Next.js 16 App Router Route Handlers, Prisma, SQLite, Vitest, Testing Library. Di Windows pakai `npm.cmd` / `npx.cmd`.

## Global Constraints

- Bahasa UI Indonesia; token, tipografi, radius 0, hit 44px mengikuti `docs/superpowers/specs/2026-09-07-ui-ux-astrum-deus-design.md`
- Hanya JPEG, PNG, WebP; maksimal 15 MB; nama file acak + ekstensi dari jenis terdeteksi
- URL publik `/media/<nama-file>`; disk `web/uploads/` gitignored
- Sebelum paket 3: hanya Editor dan Admin yang POST (`canWriteContent`)
- Jangan hapus file `web/public/` (`/portrait.jpg`, `/hero.jpg`, `/logo-astrum-deus.png`)
- Hapus file lama hanya jika path `/media/...` dan tidak ada record lain yang memakai
- Bukan S3; bukan PDF/ZIP/lampiran kas
- Spec: `docs/superpowers/specs/2026-09-08-cms-admin-lanjutan-design.md` paket 1
- Jangan commit `web/package-lock.json` kecuali memang bagian task; jangan commit `.superpowers/` atau `web/uploads/`

---

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/lib/media/constants.ts` | `MAX_BYTES`, MIME, magic byte, regex nama file |
| `web/lib/media/validate.ts` | Deteksi jenis dari bytes; tolak PDF/besar |
| `web/lib/media/store.ts` | Path disk, tulis, baca, hapus, rilis path tak terpakai |
| `web/app/api/media/route.ts` | POST unggah (JSON `{ path }` atau error) |
| `web/app/media/[filename]/route.ts` | GET bytes gambar |
| `web/components/admin/image-upload.tsx` | Pratinjau + `Pilih gambar` + hidden input |
| `web/prisma/schema.prisma` | `Partner.logo` opsional |
| Form CMS + `save*` | Ganti input teks; panggil `releaseMediaPath` |
| `web/.gitignore` | Abaikan isi `uploads/` kecuali `.gitkeep` |

---

### Task 1: Validasi jenis dan ukuran

**Files:**
- Create: `web/lib/media/constants.ts`
- Create: `web/lib/media/validate.ts`
- Test: `web/lib/media/validate.test.ts`

**Interfaces:**
- Consumes: bytes `Uint8Array`
- Produces: `detectImageKind(bytes: Uint8Array): 'jpeg' | 'png' | 'webp' | null`; `validateImageBuffer(bytes: Uint8Array): { ok: true; kind: ImageKind } | { ok: false; error: 'jenis' | 'ukuran' }`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { validateImageBuffer } from '@/lib/media/validate'

const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const WEBP = Uint8Array.from([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
])
const PDF = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d])

describe('validateImageBuffer', () => {
  it('menerima JPEG, PNG, dan WebP di bawah 15 MB', () => {
    expect(validateImageBuffer(JPEG)).toEqual({ ok: true, kind: 'jpeg' })
    expect(validateImageBuffer(PNG)).toEqual({ ok: true, kind: 'png' })
    expect(validateImageBuffer(WEBP)).toEqual({ ok: true, kind: 'webp' })
  })

  it('menolak PDF', () => {
    expect(validateImageBuffer(PDF)).toEqual({ ok: false, error: 'jenis' })
  })

  it('menolak file lebih dari 15 MB meski magic JPEG valid', () => {
    const besar = new Uint8Array(15 * 1024 * 1024 + 1)
    besar.set(JPEG, 0)
    expect(validateImageBuffer(besar)).toEqual({ ok: false, error: 'ukuran' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run lib/media/validate.test.ts`

Expected: FAIL — modul `@/lib/media/validate` tidak ada.

- [ ] **Step 3: Write minimal implementation**

`web/lib/media/constants.ts`:

```ts
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
```

`web/lib/media/validate.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run lib/media/validate.test.ts`

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web/lib/media/constants.ts web/lib/media/validate.ts web/lib/media/validate.test.ts
git commit -m "feat: validasi unggah JPEG PNG WebP maksimal 15 MB"
```

---

### Task 2: Simpan, baca, dan rilis file di disk

**Files:**
- Create: `web/lib/media/store.ts`
- Create: `web/uploads/.gitkeep`
- Modify: `web/.gitignore`
- Test: `web/lib/media/store.test.ts`

**Interfaces:**
- Consumes: `validateImageBuffer`, `KIND_TO_EXT`, `MEDIA_URL_PREFIX`, `MEDIA_FILENAME_RE`
- Produces:
  - `getUploadsDir(): string` — `process.env.UPLOADS_DIR` atau `path.join(process.cwd(), 'uploads')`
  - `isManagedMediaPath(urlPath: string): boolean`
  - `publicPathForFilename(filename: string): string` — `/media/${filename}`
  - `saveImageBuffer(bytes: Uint8Array): Promise<{ path: string; filename: string }>`
  - `readMediaFile(filename: string): Promise<{ bytes: Uint8Array; kind: ImageKind } | null>`
  - `deleteMediaFile(urlPath: string): Promise<void>`
  - `countMediaPathUses(urlPath: string): Promise<number>`
  - `releaseMediaPath(oldPath: string | null | undefined, newPath: string): Promise<void>`

- [ ] **Step 1: Write the failing test**

Pakai direktori temp; jangan tulis ke `web/uploads` produksi. Mock Prisma untuk hitungan referensi.

```ts
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    player: { count: vi.fn() },
    newsPost: { count: vi.fn() },
    mediaKitAsset: { count: vi.fn() },
    partner: { count: vi.fn() },
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
    vi.mocked(prisma.partner.count).mockResolvedValue(0)
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run lib/media/store.test.ts`

Expected: FAIL — `@/lib/media/store` tidak ada.

- [ ] **Step 3: Write minimal implementation**

Tambah di `web/.gitignore`:

```
/uploads/*
!/uploads/.gitkeep
```

Buat `web/uploads/.gitkeep` (kosong).

`web/lib/media/store.ts`:

```ts
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
  const [players, posts, assets, partners, settings] = await Promise.all([
    prisma.player.count({ where: { photo: urlPath } }),
    prisma.newsPost.count({ where: { cover: urlPath } }),
    prisma.mediaKitAsset.count({ where: { href: urlPath } }),
    prisma.partner.count({ where: { logo: urlPath } }),
    prisma.siteSetting.count({
      where: { OR: [{ logo: urlPath }, { favicon: urlPath }] },
    }),
  ])
  return players + posts + assets + partners + settings
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
```

Catatan: `Partner.logo` belum ada di schema sampai Task 5. Di Task 2, `countMediaPathUses` **jangan** query `partner.logo` dulu — pakai hanya `player.photo`, `newsPost.cover`, `mediaKitAsset.href`, `siteSetting.logo|favicon`. Tes mock `prisma.partner.count` boleh tetap ada; implementasi Task 2 **omit** partner sampai field ada, atau stub `count` partner = 0 tanpa field. **Pilih omit partner** di Task 2; tambah di Task 5.

Sesuaikan tes Task 2: hapus `prisma.partner` dari mock sampai Task 5, atau mock boleh unused. Tes di atas yang mock `partner.count` — ubah tes supaya tidak mengimpor partner sampai Task 5:

Mock hanya:

```ts
vi.mock('@/lib/db', () => ({
  prisma: {
    player: { count: vi.fn() },
    newsPost: { count: vi.fn() },
    mediaKitAsset: { count: vi.fn() },
    siteSetting: { count: vi.fn() },
  },
}))
```

Dan `countMediaPathUses` tanpa partner di Task 2.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run lib/media/store.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/lib/media/store.ts web/lib/media/store.test.ts web/.gitignore web/uploads/.gitkeep
git commit -m "feat: simpan unggahan di disk dan hapus file /media yang tak terpakai"
```

---

### Task 3: GET `/media/[filename]` dan POST `/api/media`

**Files:**
- Create: `web/app/media/[filename]/route.ts`
- Create: `web/app/api/media/route.ts`
- Test: `web/app/media/route.test.ts`
- Test: `web/app/api/media/route.test.ts`

**Interfaces:**
- Consumes: `saveImageBuffer`, `readMediaFile`, `getCurrentUser`, `canWriteContent`
- Produces: GET `200` image bytes + `Content-Type`; `404` nama ilegal/missing. POST `201 { path }`; `400 { error: 'jenis' | 'ukuran' }`; `401 { error: 'gagal' }`; `500 { error: 'gagal' }`

Error copy di UI (bukan di JSON):

- `jenis` → `Pilih file JPG, PNG, atau WebP.`
- `ukuran` → `Ukuran file maksimal 15 MB.`
- `gagal` → `Unggahan gagal. Coba lagi.`

- [ ] **Step 1: Write the failing tests**

`web/app/media/route.test.ts`:

```ts
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
```

`web/app/api/media/route.test.ts`:

```ts
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
  return new Request('http://localhost/api/media', { method: 'POST', body: data })
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run app/media/route.test.ts app/api/media/route.test.ts`

Expected: FAIL — route modules tidak ada.

- [ ] **Step 3: Write minimal implementation**

`web/app/media/[filename]/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { readMediaFile } from '@/lib/media/store'

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params
  const file = await readMediaFile(filename)
  if (!file) {
    return new NextResponse(null, { status: 404 })
  }
  return new NextResponse(Buffer.from(file.bytes), {
    status: 200,
    headers: {
      'Content-Type': file.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
```

`web/app/api/media/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { canWriteContent } from '@/lib/auth/roles'
import { getCurrentUser } from '@/lib/auth/session'
import { saveImageBuffer } from '@/lib/media/store'
import { validateImageBuffer } from '@/lib/media/validate'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || !canWriteContent(user.roles)) {
    return NextResponse.json({ error: 'gagal' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'jenis' }, { status: 400 })
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    const hasil = validateImageBuffer(bytes)
    if (!hasil.ok) {
      return NextResponse.json({ error: hasil.error }, { status: 400 })
    }
    const saved = await saveImageBuffer(bytes)
    return NextResponse.json({ path: saved.path }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'gagal' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run app/media/route.test.ts app/api/media/route.test.ts`

Expected: PASS. Jika GET gagal karena `Buffer` di jsdom, ganti body GET ke `file.bytes` dengan `Content-Type` via `Uint8Array` langsung: `new NextResponse(file.bytes, { headers: ... })`.

- [ ] **Step 5: Commit**

```bash
git add web/app/media/[filename]/route.ts web/app/api/media/route.ts web/app/media/route.test.ts web/app/api/media/route.test.ts
git commit -m "feat: GET /media dan POST /api/media untuk unggah gambar"
```

---

### Task 4: Komponen `ImageUpload`

**Files:**
- Create: `web/components/admin/image-upload.tsx`
- Test: `web/components/admin/image-upload.test.tsx`
- Modify: tidak mengubah token global

**Interfaces:**
- Consumes: `POST /api/media`, hidden input `name`
- Produces: `ImageUpload({ name, label, defaultValue?, required?: boolean })`

Copy tetap:

- Tombol: `Pilih gambar` / `Mengunggah…`
- Hint: `JPG, PNG, atau WebP. Maksimal 15 MB.`
- Error jenis/ukuran/gagal sesuai spec
- `aria-invalid` + `aria-describedby` ke error; fokus kembali ke `<input type="file">`

UI: radius 0, `min-h-11`, bukan pill, bukan gradient. Pratinjau `<img>` (bukan next/image) supaya `/media/...` tidak lewat optimizer.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ImageUpload } from '@/components/admin/image-upload'

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('mengisi hidden input dari defaultValue dan menampilkan hint', () => {
    render(<ImageUpload name="photo" label="Foto" defaultValue="/portrait.jpg" />)
    expect(screen.getByDisplayValue('/portrait.jpg')).toHaveAttribute('name', 'photo')
    expect(screen.getByText('JPG, PNG, atau WebP. Maksimal 15 MB.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pilih gambar' })).toBeEnabled()
    expect(screen.getByRole('img', { name: 'Pratinjau Foto' })).toHaveAttribute('src', '/portrait.jpg')
  })

  it('menolak PDF di klien tanpa fetch', async () => {
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const pdf = new File([Uint8Array.from([0x25, 0x50, 0x44, 0x46])], 'x.pdf', { type: 'application/pdf' })
    await user.upload(input, pdf)
    expect(screen.getByText('Pilih file JPG, PNG, atau WebP.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('mengirim JPEG dan menulis path dari server', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ path: '/media/abcd.jpg' }),
    } as Response)
    const user = userEvent.setup()
    render(<ImageUpload name="photo" label="Foto" />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const jpeg = new File([Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])], 'a.jpg', { type: 'image/jpeg' })
    await user.upload(input, jpeg)
    expect(fetch).toHaveBeenCalled()
    expect(screen.getByDisplayValue('/media/abcd.jpg')).toHaveAttribute('name', 'photo')
  })
})
```

Tambah tes ukuran: file dengan `Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 + 1 })` menampilkan `Ukuran file maksimal 15 MB.` tanpa fetch.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run components/admin/image-upload.test.tsx`

Expected: FAIL — komponen tidak ada.

- [ ] **Step 3: Write minimal implementation**

Klien: cek `file.size` dulu, lalu magic byte lewat `file.slice(0, 12).arrayBuffer()` + `validateImageBuffer` (fungsi murni, aman di-import klien). Lalu `fetch('/api/media', { method: 'POST', body: form, credentials: 'include' })`.

Tombol `Pilih gambar` `type="button"` memanggil `input.click()`. Saat unggah: `disabled` + teks `Mengunggah…`. Hidden input `type="hidden"` `name={name}` `required={required}`. File input `accept="image/jpeg,image/png,image/webp"` `className="sr-only"` (atau `sr-only` Tailwind) dengan `id` untuk label. Error `id={`${name}-error`}` `role="alert"`. Setelah error, `input.focus()`.

Jangan pakai `rounded-full` / gradient / Inter.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\Me\Work\AstrumDeus\web; npx.cmd vitest run components/admin/image-upload.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/components/admin/image-upload.tsx web/components/admin/image-upload.test.tsx
git commit -m "feat: komponen ImageUpload ganti input path teks"
```

---

### Task 5: Pasang di form CMS + hapus file lama + logo partner

**Files:**
- Modify: `web/prisma/schema.prisma` — `Partner.logo String?`
- Create: migrasi Prisma `partner_logo`
- Modify: `web/lib/media/store.ts` — tambah `prisma.partner.count({ where: { logo: urlPath } })` dan tes mock
- Modify: `web/lib/content/types.ts` — `Partner.logo: string | null`
- Modify: `web/lib/content/map.ts` — `mapPartner` menyertakan `logo`
- Modify: `web/components/public/partner-plate.tsx` + tes — bila `logo` ada, tampilkan `<img alt={name}>` di dalam plat (tautan tetap dari `href`)
- Modify: `web/app/cms/players/player-form.tsx` — `ImageUpload name="photo"`
- Modify: `web/app/cms/players/actions.ts` — baca foto lama, `releaseMediaPath` setelah update
- Modify: `web/app/cms/news/news-form.tsx` — `ImageUpload name="cover"` (tidak required)
- Modify: `web/app/cms/news/actions.ts` — `releaseMediaPath` cover lama
- Modify: `web/app/cms/media-kit/page.tsx` dan `[id]/page.tsx` — `ImageUpload name="href"` untuk aset gambar
- Modify: `web/app/cms/media-kit/actions.ts` — rilis `href` lama
- Modify: `web/app/cms/partners/page.tsx` dan `[id]/page.tsx` — `ImageUpload name="logo"`
- Modify: `web/app/cms/partners/actions.ts` — simpan `logo`, rilis lama
- Modify: `web/app/cms/settings/page.tsx` — `ImageUpload` logo dan favicon
- Modify: `web/app/cms/settings/actions.ts` — simpan `logo`/`favicon`, rilis lama
- Modify: `web/app/layout.tsx` — `generateMetadata` icons dari `SiteSetting.favicon`
- Modify: `web/components/layout/site-header.tsx` + `site-footer.tsx` + `site-chrome.tsx` — `logoSrc` dari setting (fallback `/logo-astrum-deus.png`)
- Test: `web/lib/media/release-player.test.ts` — mock prisma player find/update tidak wajib; tes `releaseMediaPath` sudah ada. Tambah tes `countMediaPathUses` menghitung partner.logo setelah schema.

**Interfaces:**
- Consumes: `ImageUpload`, `releaseMediaPath`, `teks(formData, field)`
- Produces: form menyimpan `/media/...` atau path public lama

Pola rilis di setiap `save*` yang punya path gambar:

```ts
const id = teks(formData, 'id')
const nextPhoto = teks(formData, 'photo') || '/portrait.jpg'
let prevPhoto: string | null = null
if (id) {
  const existing = await prisma.player.findUnique({ where: { id } })
  prevPhoto = existing?.photo ?? null
}
// create/update ...
await releaseMediaPath(prevPhoto, nextPhoto)
```

Panggil `releaseMediaPath` **setelah** row baru tersimpan supaya count tidak menghitung row lama yang masih menunjuk path lama. Urutan: update row dulu, lalu `releaseMediaPath(old, new)` — count path lama = 0 jika tidak ada row lain.

Untuk `deletePlayer` / `deleteNews` / `deleteAsset` / `deletePartner`: setelah delete, `releaseMediaPath(oldPath, '')` supaya file terhapus jika unused.

`ImageUpload` adalah client component; form server tetap `<form action={savePlayer}>`. Jangan bungkus seluruh form jadi client.

Settings: field `logo` dan `favicon` sudah ada di `SiteSetting` tapi belum di form — tambahkan.

Header/footer sekarang hardcode `/logo-astrum-deus.png`. Baca branding di layout server:

```ts
export async function getSiteBranding(): Promise<{ logo: string; favicon: string }> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 'default' } })
  return {
    logo: row?.logo || '/logo-astrum-deus.png',
    favicon: row?.favicon || '/logo-astrum-deus.png',
  }
}
```

Letakkan di `web/lib/content/branding.ts` (bukan dummy). Tes unit: fungsi murni fallback jika row null — atau tes `getSiteBranding` dengan mock prisma. Minimal: tes partner-plate logo image.

Migrasi:

```
cd D:\Me\Work\AstrumDeus\web
npx.cmd prisma migrate dev --name partner_logo
```

Kalau `next dev` mengunci query engine, hentikan server dulu.

- [ ] **Step 1: Write failing tests for partner logo + branding fallback**

Perluas `partner-plate.test.tsx`: partner dengan `logo: '/media/x.png'` merender `img` alt nama partner; `logoText` tidak wajib tampil jika ada logo.

Perluas `store.test.ts` mock `partner.count` setelah schema.

Tes `releaseMediaPath` sudah menutup “ganti foto menghapus file lama jika tidak terpakai”.

- [ ] **Step 2: Run tests — expect fail on Partner.logo type**

- [ ] **Step 3: Schema, migrate, wire forms, branding**

- [ ] **Step 4: Run** `npx.cmd vitest run`

Expected: seluruh suite hijau (jangan turunkan tes yang sudah ada). Perbarui fixture `Partner` di tes yang pecah karena field `logo` baru (`logo: null`).

- [ ] **Step 5: Commit**

```bash
git add web/prisma/schema.prisma web/prisma/migrations web/lib web/app web/components web/uploads/.gitkeep
git commit -m "feat: unggah gambar di roster, berita, media kit, partner, dan situs"
```

Jangan add `web/prisma/dev.db` atau `web/uploads/*` selain `.gitkeep`.

---

### Task 6: Verifikasi browser

**Files:** tidak wajib kode baru; perbaiki regresi jika ketemu.

- [ ] **Step 1:** `cd D:\Me\Work\AstrumDeus\web; npm.cmd run dev` (jika belum). Login `admin@astrumdeus.id` / `astrum-cms-dev`.
- [ ] **Step 2:** CMS Roster → ubah pemain → unggah JPEG < 15 MB → pratinjau → Simpan → buka `/roster/...` gambar baru tampil.
- [ ] **Step 3:** Unggah PDF → pesan `Pilih file JPG, PNG, atau WebP.` Fokus di input file.
- [ ] **Step 4:** Logout, `POST /api/media` sebagai visitor (fetch di tab publik) → 401.
- [ ] **Step 5:** Ganti foto pemain lagi; file `/media/` lama hilang dari `web/uploads` jika tidak dipakai record lain.
- [ ] **Step 6:** Path seed `/portrait.jpg` pada pemain yang belum diganti masih tampil.
- [ ] **Step 7:** Settings: ganti logo; header memakai `/media/...`. Favicon metadata berubah.
- [ ] **Step 8:** Commit perbaikan jika ada; jika tidak, jangan commit kosong.

---

## Cakupan spec paket 1

| Requirement | Task |
| --- | --- |
| Disk `web/uploads/`, gitignore | 2 |
| URL `/media/<file>` Route Handler | 3 |
| JPEG/PNG/WebP, 15 MB | 1, 3 |
| Editor/Admin unggah; visitor ditolak | 3 |
| Form pemain, berita, media kit, partner, logo/favicon | 5 |
| ImageUpload + copy error ID | 4 |
| Nama acak; seed public tetap valid | 2, 5 |
| Hapus file lama jika unused | 2, 5 |
| Tes PDF, >15MB, GET bytes, visitor POST | 1, 3, 6 |
