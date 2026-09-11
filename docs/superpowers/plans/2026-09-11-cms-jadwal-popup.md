# CMS jadwal popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kisi jadwal menampilkan 2 chip + sisa; klik tanggal membuka dialog daftar/buat/ubah.

**Architecture:** Helper `chipKalender`. Overlay `JadwalDialog` (URL `hari` / `baru` / `id`). Panel kanan dihapus.

**Tech Stack:** Next.js App Router, Tailwind, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-jadwal-popup`, cabang `feat/cms-jadwal-popup`

## File map

- Create: `web/lib/schedule/chip-kalender.ts`, `chip-kalender.test.ts`
- Create: `web/components/admin/jadwal-dialog.tsx`, `jadwal-dialog.test.tsx`
- Modify: `web/app/internal/schedule/page.tsx`, `schedule.test.ts`

---

### Task 1: chipKalender

- [ ] Tes 0/2/3 item
- [ ] FAIL lalu helper

---

### Task 2: JadwalDialog

- [ ] Tes role dialog, judul, Tutup href, Escape
- [ ] FAIL lalu overlay seperti ConfirmSubmit

---

### Task 3: halaman kalender

- [ ] Tes sumber: chipKalender, `+${sisa} event`, JadwalDialog, baru=1, tidak “Pilih hari atau event”
- [ ] FAIL lalu page pakai dialog + 2 chip

---

### Task 4: vitest penuh + browser klik tanggal, +N, buat, ubah
