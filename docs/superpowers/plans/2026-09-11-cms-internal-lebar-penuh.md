# Lebar penuh CMS/Internal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CMS dan Internal memakai lebar viewport: nav kiri, header judul kiri / Keluar kanan, konten besar; form pendek tetap sempit di tengah kolom.

**Architecture:** Satu perubahan `AdminShell` (buang `max-w-page`). Form pendek existing ditambah `mx-auto`. Publik tidak disentuh.

**Tech Stack:** Next.js App Router, Tailwind v4, Vitest. Windows: `$env:Path = "C:\Program Files\nodejs;" + $env:Path` lalu `npx.cmd` dari `web/`.

## Global Constraints

- Spec: `2026-09-11-cms-internal-lebar-penuh-design.md`
- Padding tepi `px-5` / `md:px-8` tetap
- Jangan commit `dev.db`, `.superpowers/`, `web/uploads/*`, `web/package-lock.json`
- Jangan kerja di `master`

## Berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/components/admin/admin-shell.tsx` | Lebar penuh |
| `web/components/admin/admin-shell.test.tsx` | Tes sumber shell |
| Form CMS `max-w-xl` / `max-w-2xl` | `mx-auto` |
| `web/app/cms/users/page.tsx` | Form baru `max-w-xl mx-auto` |

---

### Task 1: AdminShell lebar penuh

**Files:**
- Create: `web/components/admin/admin-shell.test.tsx`
- Modify: `web/components/admin/admin-shell.tsx`

- [ ] **Step 1: Tes FAIL**

```ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const sumber = readFileSync(
  path.join(process.cwd(), 'components', 'admin', 'admin-shell.tsx'),
  'utf8',
)

describe('AdminShell lebar', () => {
  it('header dan badan tidak dikunci max-w-page', () => {
    expect(sumber).not.toMatch(/max-w-page/)
    expect(sumber).toMatch(/justify-between/)
    expect(sumber).toMatch(/md:w-52/)
    expect(sumber).toMatch(/flex-1/)
    expect(sumber).toMatch(/px-5/)
    expect(sumber).toMatch(/md:px-8/)
  })
})
```

- [ ] **Step 2:** `npx.cmd vitest run components/admin/admin-shell.test.tsx` FAIL (masih `max-w-page`)
- [ ] **Step 3:** Header: `flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8` (tanpa `mx-auto max-w-page`). Badan: `flex w-full flex-col gap-10 px-5 py-10 md:flex-row md:px-8`.
- [ ] **Step 4:** tes PASS

---

### Task 2: Form pendek di tengah

Tambah `mx-auto` (dan `w-full` jika perlu) pada form/wrapper `max-w-xl` / `max-w-2xl` di:

- `news-form.tsx`, `player-form.tsx`, `match-form.tsx`
- `menu/page.tsx`, `settings/page.tsx`
- `partners/[id]/page.tsx`, `media-kit/page.tsx`, `media-kit/[id]/page.tsx`
- `kategori/page.tsx` (ul), `kategori/{berita,kas,turnamen}/page.tsx`
- `peran/page.tsx` (form create saja, bukan intro p)
- `halaman/new/page.tsx`, `halaman/[id]/page.tsx` (form status + hapus + wrapper bawaan, bukan intro daftar)
- `users/page.tsx` form `saveUser`: `max-w-xl mx-auto`

Jangan `mx-auto` pada intro `p` di samping judul tabel, atau search inbox.

- [ ] Tes sumber: `news-form` / `player-form` / `menu/page` memakai `mx-auto` bersama max-w
- [ ] Implement
- [ ] `npx.cmd vitest run` hijau
