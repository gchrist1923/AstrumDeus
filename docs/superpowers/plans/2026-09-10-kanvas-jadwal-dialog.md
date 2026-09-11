# Kanvas WYSIWYG, jadwal kalender, pager, dialog hapus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dialog hapus merek, pager ringkas jika >10 halaman, hapus halaman kustom, kanvas WYSIWYG (isi di tampilan + video/garis), kalender bulan untuk jadwal internal.

**Architecture:** `ConfirmSubmit` membuka `role="dialog"` bukan `window.confirm`. `Pager` cabang `pageCount > 10`. `deleteCustomPage` hanya `kind === 'custom'`. Kanvas: input/gambar/cover di sel kisi; panel kanan alat. Publik: `youtubeCover` + klik-untuk-putar. Jadwal: kisi Senin–Minggu + query `hari`/`id` mengisi panel.

**Tech Stack:** Next.js App Router, Prisma, Vitest, Testing Library. Windows: `$env:Path = "C:\Program Files\nodejs;" + $env:Path` lalu `npx.cmd` dari `web/`.

## Global Constraints

- Bahasa UI Indonesia; radius 0; hit 44px; spec UI 2026-09-07
- Specs: `2026-09-10-dialog-hapus-design.md`, `halaman-hapus-dan-pager`, `kanvas-wysiwyg`, `jadwal-kalender`
- Jangan commit `dev.db`, `.superpowers/`, `web/uploads/*`, `web/package-lock.json` kecuali bagian task
- Jangan push kecuali diminta; jangan commit ke `master`

Empat spec independen; satu cabang `feat/cms-kanvas-jadwal-dialog` karena Grace minta dikerjakan sekali jalan. Tiap task tetap bisa diuji sendiri.

---

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/components/admin/confirm-submit.tsx` | Dialog Batal/Hapus |
| `web/components/admin/pager.tsx` | Nomor ≤10; Sebelum/Berikut jika >10 |
| `web/app/cms/halaman/actions.ts` | `deleteCustomPage` |
| `web/lib/pages/types.ts` | `video` \| `divider` |
| `web/lib/pages/youtube.ts` | id + cover YouTube |
| `web/components/public/youtube-player.tsx` | klik-untuk-putar |
| `web/components/admin/page-canvas.tsx` | WYSIWYG + palet baru |
| `web/components/public/page-blocks.tsx` | warna, garis, video, list lama |
| `web/app/internal/schedule/page.tsx` | kisi + panel |

---

### Task 1: Dialog hapus

**Files:**
- Modify: `web/components/admin/confirm-submit.tsx`
- Modify: `web/components/admin/confirm-submit.test.tsx`

**Interfaces:**
- Consumes: `Button`, `message: string`
- Produces: pemicu `type="button"`; dialog `role="dialog"` `aria-modal`; Batal menutup; Hapus di dialog `type="submit"`

- [ ] **Step 1: Ganti tes — FAIL (masih window.confirm)**

```tsx
import type React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'

describe('ConfirmSubmit', () => {
  it('membuka dialog dan batal tidak submit', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    expect(onSubmit).not.toHaveBeenCalled()
    const dialog = screen.getByRole('dialog', { name: 'Hapus' })
    expect(within(dialog).getByText('Hapus pesan ini?')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submit hanya dari Hapus di dialog', () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }))
    expect(onSubmit).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2:** `npx.cmd vitest run components/admin/confirm-submit.test.tsx` FAIL
- [ ] **Step 3:** Implementasi dialog (overlay `fixed inset-0`, panel, Escape + klik overlay = batal). Tidak ada `window.confirm`.
- [ ] **Step 4:** tes PASS
- [ ] **Step 5:** Commit `feat: dialog hapus merek mengganti window.confirm`

---

### Task 2: Pager ringkas

**Files:** `web/components/admin/pager.tsx`, `web/components/admin/pager.test.tsx`

- [ ] Tes: `pageCount={11}` halaman 1 → `Berikut` href halaman 2, tidak 11 tautan nomor, teks `Hal 1 dari 11`. `pageCount={4}` tetap 4 tautan nomor, tidak ada `Berikut`.
- [ ] Implement: `pageCount > 10` → Sebelum (jika page>1) + `Hal {page} dari {pageCount}` + Berikut (jika page<pageCount).
- [ ] Commit `feat: pager ringkas jika lebih dari 10 halaman`

---

### Task 3: Hapus halaman kustom

**Files:** `actions.ts` `deleteCustomPage`; `page.tsx` + `[id]/page.tsx` ConfirmSubmit; `halaman.test.ts`

```ts
export async function deleteCustomPage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'delete')
  const id = teks(formData, 'id')
  const page = id ? await prisma.sitePage.findUnique({ where: { id } }) : null
  if (!page || page.kind !== 'custom') {
    redirect('/cms/halaman')
  }
  await prisma.sitePage.delete({ where: { id: page.id } })
  revalidateHalamanPublik(page.slug)
  redirect('/cms/halaman')
}
```

Hapus hanya di baris kustom + form di kanvas. Bawaan tidak. Pesan `Hapus halaman ini?`. Grant `can(..., 'delete')`.

- [ ] Tes source: `deleteCustomPage`, `kind !== 'custom'`, `Hapus halaman ini?`, daftar tidak menaruh Hapus di map builtins
- [ ] Commit `feat: hapus halaman kustom dari CMS`

---

### Task 4: Kanvas WYSIWYG

**Files:** `types.ts` tambah `'video' | 'divider'`; `youtube.ts` + tes; `youtube-player.tsx`; `page-canvas.tsx` + tes; `page-blocks.tsx` + tes

Palet: Teks (`heading`), Long text (`text`), Tombol, Gambar, Video, Garis. Tanpa Daftar.

Kanvas: input judul/textarea/tombol label+href/ImageUpload+img/cover video+url/hr. Klik sel = pilih (stopPropagation di input).

Panel: level (heading), warna `default|accent|muted` (heading/text/button/divider), ketebalan 1|2|4 (divider), lebar, pindah, Hapus blok (`Hapus blok ini?`).

Payload: `color?`, `thickness?`, video `{ url }`, divider `{}`.

Publik: kelas warna; `divider` hr; video `YoutubePlayer`; `list` tetap.

`youtubeId`: watch, youtu.be, embed. Cover `https://i.ytimg.com/vi/{id}/hqdefault.jpg`.

- [ ] Tes youtubeId; tes ketik judul di kanvas mengubah layout JSON; tes palet tidak Daftar; tes page-blocks video/divider; tes aria-pressed lebar tetap
- [ ] Commit `feat: kanvas WYSIWYG dengan video dan garis`

---

### Task 5: Jadwal kalender

**Files:** `web/lib/schedule/month.ts` (kisi Senin, `hari` YYYY-MM-DD); tes; `page.tsx` grid; form panel pakai `hari`/`id`; `saveEvent` redirect pertahankan `bulan`.

Klik sel → `?bulan=&hari=`. Klik chip → `?bulan=&id=` jika bisa tulis, else lihat. Default jam 09:00–10:00 (hari ini: dari sekarang +1 jam). Fokus judul via `autoFocus` jika mode buat.

Chip: jam `toDatetimeLocal` slice 11-16 + judul.

- [ ] Tes kisi: Sep 2026 mulai Selasa → sel pertama 31 Agu; 30 hari. Tes page source `hari=`.
- [ ] Commit `feat: kisi bulan untuk jadwal internal`

---

## Urutan

1 dialog → 2 pager → 3 hapus halaman → 4 kanvas → 5 jadwal.
