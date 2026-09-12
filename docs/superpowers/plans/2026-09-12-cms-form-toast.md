# Toast form CMS Implementation Plan

> **For agentic workers:** Implement in the current session. TDD. Do not commit unless Grace asks.

**Goal:** Toast sukses/error setelah mutasi form CMS + Internal, plus validasi browser dan server pada field wajib.

**Architecture:** Helper murni `flashDariQuery` / `pathDenganFlash` memetakan query ke pesan. `FlashToast` di AdminShell membaca searchParams. Setiap server action redirect lewat `pathDenganFlash`.

**Tech Stack:** Next.js App Router, React 19, Vitest, Testing Library.

## Global Constraints

- Bahasa Indonesia, radius 0, hit 44px, token UI 2026-09-07
- `kesalahan=isi` untuk field kosong; `kesalahan=wajib` tetap untuk menu bawaan
- Login dan form kontak publik tidak diubah
- Tidak menambah library toast

## Task 1: Helper flash + form

- Tes `flashDariQuery`, `pathDenganFlash`, `emailValid`, `adaKosong`
- Implement `web/lib/flash.ts` dan perluas `web/lib/form.ts`

## Task 2: Komponen toast

- Tes render sukses/error, Tutup, role
- Implement `web/components/admin/flash-toast.tsx`
- Pasang di `AdminShell` dalam `Suspense`

## Task 3: Action + form

- Semua `actions.ts` CMS/Internal redirect dengan flash
- Validasi server field wajib
- Situs: `required` + `type="email"` + `min={0}`
- Hapus banner `role="alert"` inline (diganti toast)

## Task 4: Verifikasi

- `npm.cmd test` di `web/`
- Browser: simpan Situs, validasi kosong, hapus
