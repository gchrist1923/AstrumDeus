# CMS media kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pratinjau CMS tidak gepeng, jenis/ukuran media kit terisi otomatis readonly dari berkas, dan tambah aset lewat `/cms/media-kit/new` bukan form di bawah list.

**Architecture:** Helper murni `describeImageMeta` / `formatFileSize`. `ImageUpload` menambah `object-contain`, `hidePreview`, dan field meta opsional. Form media kit dipakai ulang di `new` dan `[id]`. `saveAsset` menimpa meta dari disk untuk path `/media/...`.

**Tech Stack:** Next.js App Router, React 19, Vitest, Testing Library, Prisma SQLite.

## Global Constraints

- Bahasa UI Indonesia; tombol **Tambah aset**, hint **Diisi otomatis dari berkas.**
- Token, radius 0, hit 44px, `lang="id"`
- `readOnly` bukan `disabled` pada jenis/ukuran supaya field ikut submit
- Jangan commit kecuali Grace minta; jangan sentuh checkout lebar-penuh atau situs
- Windows: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`; `npm.cmd` / `npx.cmd`
- Worktree: `D:\Me\Work\AstrumDeus-media-kit`, cabang `feat/cms-media-kit`

## File map

- Create: `web/lib/media/meta.ts`, `web/lib/media/meta.test.ts`
- Create: `web/app/cms/media-kit/asset-form.tsx`, `web/app/cms/media-kit/new/page.tsx`, `web/app/cms/media-kit/media-kit.test.ts`
- Modify: `web/components/admin/image-upload.tsx`, `web/components/admin/image-upload.test.tsx`
- Modify: `web/app/cms/media-kit/page.tsx`, `web/app/cms/media-kit/[id]/page.tsx`, `web/app/cms/media-kit/actions.ts`
- Modify: `web/components/admin/page-canvas.tsx`, `web/app/cms/view-only.test.ts`

---

### Task 1: Helper jenis dan ukuran

**Files:**
- Create: `web/lib/media/meta.ts`
- Test: `web/lib/media/meta.test.ts`

**Produces:**
- `KIND_LABEL: Record<ImageKind, string>` — jpeg `JPEG`, png `PNG`, webp `WebP`
- `formatFileSize(bytes: number): string`
- `describeImageMeta(bytes: Uint8Array): { fileType: string; fileSize: string } | null`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { describeImageMeta, formatFileSize } from '@/lib/media/meta'

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

describe('formatFileSize', () => {
  it('memakai B, KB, dan MB dengan koma Indonesia', () => {
    expect(formatFileSize(24)).toBe('24 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(24 * 1024)).toBe('24 KB')
    expect(formatFileSize(Math.round(1.2 * 1024 * 1024))).toBe('1,2 MB')
  })
})

describe('describeImageMeta', () => {
  it('membaca PNG dari magic byte', () => {
    expect(describeImageMeta(PNG)).toEqual({ fileType: 'PNG', fileSize: '8 B' })
  })

  it('mengembalikan null jika bukan gambar', () => {
    expect(describeImageMeta(Uint8Array.from([0x25, 0x50, 0x44, 0x46]))).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `$env:Path = "C:\Program Files\nodejs;" + $env:Path; npx.cmd vitest run lib/media/meta.test.ts`
Expected: FAIL (modul belum ada)

- [ ] **Step 3: Write minimal implementation** in `web/lib/media/meta.ts`

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Commit** — skip unless Grace asks

---

### Task 2: ImageUpload contain, hidePreview, meta

**Files:**
- Modify: `web/components/admin/image-upload.tsx`
- Test: `web/components/admin/image-upload.test.tsx`

**Consumes:** `describeImageMeta` dari Task 1 (dari `File` → `Uint8Array`)

**Produces:** props `hidePreview?: boolean`, `meta?: { fileTypeName: string; fileSizeName: string; defaultFileType?: string; defaultFileSize?: string }`

- [ ] **Step 1: Failing tests**
  - pratinjau punya class `object-contain`
  - `hidePreview` tidak merender `img` pratinjau
  - `meta` menampilkan jenis/ukuran readonly; setelah unggah PNG, nilai berubah

- [ ] **Step 2: Run tests, confirm fail**

- [ ] **Step 3: Implement** class contain; skip `<img>` if hidePreview; readonly inputs named from meta; update from `describeImageMeta` after unggah sukses (boleh dari `file` klien sebelum fetch)

- [ ] **Step 4: Tests pass** termasuk tes ImageUpload yang sudah ada

- [ ] **Step 5: Commit** — skip

---

### Task 3: Rute new + form bersama + list tombol

**Files:**
- Create: `web/app/cms/media-kit/asset-form.tsx`
- Create: `web/app/cms/media-kit/new/page.tsx`
- Modify: `web/app/cms/media-kit/page.tsx`, `web/app/cms/media-kit/[id]/page.tsx`
- Test: `web/app/cms/media-kit/media-kit.test.ts`
- Modify: `web/app/cms/view-only.test.ts` jika form pindah file

Pola tombol: sama `Tulis berita` di `web/app/cms/news/page.tsx`. Copy tombol: `Tambah aset`. Form: `ImageUpload` dengan `meta`. Default urutan di new: jangan hardcode list length di server new page — `sortOrder` default `0` atau dihitung di action; di form new `defaultValue={1}` cukup, editor boleh ubah.

- [ ] **Step 1: Source tests** — list punya `/cms/media-kit/new` dan `Tambah aset`; tidak `saveAsset` / `ImageUpload` / `Tambah aset` sebagai `h3`; new page `requireGrant(..., 'create')`

- [ ] **Step 2: Confirm fail**

- [ ] **Step 3: Implement pages + AssetForm**

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Commit** — skip

---

### Task 4: Server timpa meta + kanvas hidePreview

**Files:**
- Modify: `web/app/cms/media-kit/actions.ts`
- Modify: `web/components/admin/page-canvas.tsx`
- Test: `web/app/cms/media-kit/media-kit.test.ts` (source: `readMediaFile` / `describeImageMeta`)
- Test: `web/components/admin/page-canvas.test.tsx` — blok gambar `hidePreview`

- [ ] **Step 1: Failing tests**

- [ ] **Step 2: Confirm fail**

- [ ] **Step 3: `saveAsset` jika `isManagedMediaPath(nextHref)` baca file dan timpa fileType/fileSize. Path seed: pakai nilai form. Kanvas ImageUpload `hidePreview`.

- [ ] **Step 4: `npx.cmd vitest run` di `web/` — semua hijau

- [ ] **Step 5: Browser** — login `admin@astrumdeus.id` / `astrum-cms-dev`, `/cms/media-kit` tombol Tambah, unggah PNG, jenis/ukuran terisi, pratinjau tidak gepeng, kanvas tanpa preview ganda

- [ ] **Step 6: Commit** — skip
