# CMS kelola kategori Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** paket 1 boleh belum ada; paket ini tidak bergantung unggah. Kerjakan setelah unggah di-merge atau di cabang yang sama sesudah paket 1 hijau.

**Goal:** Satu halaman `/cms/kategori` supaya Editor/Admin menambah dan menonaktifkan turnamen, kategori kas, dan kategori berita; dropdown form baru hanya yang aktif; data lama tetap menampilkan nama nonaktif.

**Architecture:** Tambah `isActive` pada `Tournament` dan `NewsCategory` (`ExpenseCategory` sudah punya). Tidak ada hard delete di UI. Form berita ganti input teks jadi `<select name="categoryId">` dari kategori aktif (+ kategori current meski nonaktif supaya edit tidak kosong). Form pertandingan dan kas sudah select — filter `isActive: true`, dan sertakan id yang sedang dipakai jika nonaktif.

**Tech Stack:** Prisma migrate, Next.js App Router, Vitest. Windows: `npx.cmd`.

## Global Constraints

- Bahasa UI Indonesia; radius 0; hit 44px; spec UI 2026-09-07
- Sebelum paket 3: Editor + Admin (`canWriteContent` untuk tulis, `canAccessCms` untuk lihat)
- Tidak ada tombol Hapus pada kategori/turnamen
- Slug berita dari nama, unik; jika bentrok saat create, tampilkan `Nama kategori sudah dipakai.`
- Spec: `docs/superpowers/specs/2026-09-08-cms-admin-lanjutan-design.md` paket 2
- Jangan commit `dev.db` / `.superpowers/`

---

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/prisma/schema.prisma` | `Tournament.isActive`, `NewsCategory.isActive` |
| `web/lib/content/slug.ts` | `slugify` dibagi dari news/actions (DRY) |
| `web/app/cms/kategori/page.tsx` | Tiga bagian + form tambah + nonaktifkan |
| `web/app/cms/kategori/actions.ts` | create + deactivate |
| `web/app/cms/news/news-form.tsx` | select `categoryId` |
| `web/app/cms/news/actions.ts` | pakai `categoryId`, tidak upsert dari teks |
| `web/app/cms/matches/new/page.tsx` + `[id]/page.tsx` | turnamen aktif (+ current) |
| `web/app/internal/cash/page.tsx` | kategori kas aktif |
| `web/components/admin/admin-shell.tsx` | nav `Kategori` → `/cms/kategori` |

---

### Task 1: Schema `isActive` + slugify bersama

**Files:**
- Modify: `web/prisma/schema.prisma` — `Tournament.isActive Boolean @default(true)`; `NewsCategory.isActive Boolean @default(true)`
- Create: `web/lib/content/slug.ts`
- Test: `web/lib/content/slug.test.ts`
- Modify: `web/app/cms/news/actions.ts` — import `slugify` dari `lib/content/slug.ts` (perilaku save news belum diganti di task ini)
- Modify: `web/prisma/seed.ts` — create turnamen/kategori dengan `isActive: true` (default cukup)

**Interfaces:**
- Produces: `slugify(value: string): string` — lower, non-alphanumeric → `-`, trim `-`

- [ ] **Step 1: Write failing slug test**

```ts
import { describe, expect, it } from 'vitest'
import { slugify } from '@/lib/content/slug'

describe('slugify', () => {
  it('membuat slug unik-siap dari nama', () => {
    expect(slugify('Grand Final PMNC')).toBe('grand-final-pmnc')
    expect(slugify('  Recap!!! ')).toBe('recap')
  })
})
```

- [ ] **Step 2: Run — FAIL missing module**

`npx.cmd vitest run lib/content/slug.test.ts`

- [ ] **Step 3: Implement `slug.ts` (salin logika dari `news/actions.ts`), migrate**

```
cd D:\Me\Work\AstrumDeus\web
npx.cmd prisma migrate dev --name category_is_active
```

SQLite: kolom baru `Boolean @default(true)` mengisi baris lama = aktif.

- [ ] **Step 4: Tes slug PASS; `npx.cmd vitest run app` masih hijau untuk news actions**

- [ ] **Step 5: Commit** `feat: isActive pada turnamen dan kategori berita`

---

### Task 2: Halaman `/cms/kategori` tanpa hard delete

**Files:**
- Create: `web/app/cms/kategori/page.tsx`
- Create: `web/app/cms/kategori/actions.ts`
- Create: `web/app/cms/kategori/kategori.test.ts` — tes murni helper filter dropdown jika diekstrak; tes UI page sulit tanpa DB. **Tes wajib:** `web/lib/content/active-options.test.ts` untuk `activePlusCurrent`.
- Modify: `web/components/admin/admin-shell.tsx` — link Kategori untuk `canAccessCms`

**Interfaces:**
- Produces:

```ts
export function activePlusCurrent<T extends { id: string; isActive: boolean }>(
  rows: T[],
  currentId?: string,
): T[]
```

Hanya `isActive` atau `id === currentId`. Dipakai pertandingan, kas, berita.

Actions:

```ts
createTournament(formData) // name, organizer, season, year
deactivateTournament(formData) // id; set isActive false
createCashCategory(formData) // name, direction masuk|keluar
deactivateCashCategory(formData)
createNewsCategory(formData) // name → slugify; unique slug
deactivateNewsCategory(formData)
```

Semua: `requireCmsUser` + `canWriteContent` atau redirect `/cms`. `revalidatePath('/cms/kategori')` plus path form terkait (`/cms/matches`, `/cms/news`, `/internal/cash`).

UI tiga `<section>`: Turnamen, Kategori kas, Kategori berita. Tiap baris: nama + status Aktif/Nonaktif. Tombol hanya `Nonaktifkan` (min-h-11) jika aktif. **Tidak ada** tombol Hapus / `prisma.delete`. Form tambah di bawah tiap bagian.

Turnamen fields: nama, organizer, season, tahun (number). Kas: nama, select arah `masuk`/`keluar`. Berita: nama saja.

Copy tombol: `Nonaktifkan`. Hint: `Kategori nonaktif hilang dari form baru. Data lama tetap memakai nama ini.`

- [ ] **Step 1: Failing test `activePlusCurrent`**

```ts
import { describe, expect, it } from 'vitest'
import { activePlusCurrent } from '@/lib/content/active-options'

describe('activePlusCurrent', () => {
  const rows = [
    { id: 'a', isActive: true },
    { id: 'b', isActive: false },
    { id: 'c', isActive: true },
  ]

  it('hanya yang aktif bila tidak ada current', () => {
    expect(activePlusCurrent(rows).map((r) => r.id)).toEqual(['a', 'c'])
  })

  it('menyertakan current nonaktif', () => {
    expect(activePlusCurrent(rows, 'b').map((r) => r.id)).toEqual(['a', 'b', 'c'])
  })
})
```

- [ ] **Step 2: FAIL missing module**

- [ ] **Step 3: Implement helper + page + actions + nav**

Tes extra: grep/plan — file `kategori/page.tsx` tidak mengandung `delete` / `Hapus` untuk kategori. Boleh tes string:

```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('UI kategori', () => {
  it('tidak menawarkan hapus keras', () => {
    const page = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
    const actions = readFileSync(new URL('./actions.ts', import.meta.url), 'utf8')
    expect(page).not.toMatch(/Hapus/)
    expect(actions).not.toMatch(/\.delete\(/)
  })
})
```

Letakkan di `web/app/cms/kategori/kategori.test.ts`.

- [ ] **Step 4: `npx.cmd vitest run lib/content/active-options.test.ts app/cms/kategori/kategori.test.ts` PASS**

- [ ] **Step 5: Commit** `feat: halaman CMS kategori tanpa hapus keras`

---

### Task 3: Dropdown form memakai yang aktif

**Files:**
- Modify: `web/app/cms/news/news-form.tsx` — `categories: { id; name }[]`; `<select name="categoryId">`; hapus input teks `category`
- Modify: `web/app/cms/news/new/page.tsx` — fetch aktif
- Modify: `web/app/cms/news/[id]/page.tsx` — `activePlusCurrent` + pass `categoryId`
- Modify: `web/app/cms/news/actions.ts` — `categoryId` dari form; **jangan** upsert dari nama bebas; jika id tidak ada atau nonaktif (kecuali sudah terpasang di post ini), redirect/biarkan gagal Prisma. Validasi: kategori harus ada; untuk create, `isActive true`.
- Modify: `web/app/cms/matches/new/page.tsx` — `where: { isActive: true }`
- Modify: `web/app/cms/matches/[id]/page.tsx` — `activePlusCurrent`
- Modify: `web/app/internal/cash/page.tsx` — sudah `isActive: true`; jika entri baru saja, cukup. Laporan sudah `entry.category.name` — nonaktif tetap tampil. Tidak ubah laporan.

**Interfaces:**
- Consumes: `activePlusCurrent`
- Produces: news save memakai `categoryId: teks(formData, 'categoryId')`

Tes: `web/app/cms/news/save-category.test.ts` sulit tanpa Prisma. Tes murni validasi:

```ts
export function assertSelectableCategory(
  category: { id: string; isActive: boolean } | null,
  mode: 'create' | 'update',
  previousCategoryId?: string,
): boolean {
  if (!category) return false
  if (category.isActive) return true
  return mode === 'update' && previousCategoryId === category.id
}
```

Tes: create + nonaktif → false; update keeping inactive → true.

News form: `Field` label `Kategori`.

- [ ] **Step 1: Failing tests `assertSelectableCategory`**

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Wire forms + news actions + helper**

- [ ] **Step 4: `npx.cmd vitest run` PASS; perbaiki tes news form jika ada**

- [ ] **Step 5: Commit** `feat: dropdown CMS hanya kategori aktif`

---

### Task 4: Verifikasi browser

- Login editor. `/cms/kategori` di nav. Tambah turnamen → `/cms/matches/new` dropdown berisi nama itu.
- Nonaktifkan kategori kas yang punya entri. Form kas tidak menawarkannya. Daftar/laporan entri lama masih nama itu.
- Tidak ada tombol Hapus di halaman kategori.
- Form berita: select, bukan teks bebas. Simpan berita dengan kategori aktif.

---

## Cakupan spec paket 2

| Requirement | Task |
| --- | --- |
| `/cms/kategori` tiga bagian | 2 |
| Editor/Admin | 2 |
| Nonaktif bukan hapus | 2, 4 |
| Data lama tetap nama | 3, 4 |
| Field turnamen/kas/berita | 2 |
| Dropdown hanya aktif | 3 |
| Berita bukan teks bebas | 3 |
| Tes tambah turnamen, nonaktif kas, tiada hapus | 2–4 |
