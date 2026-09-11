# CMS internal ringkasan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ringkasan `/internal` menampilkan agenda hari ini dan saldo kas, tanpa kartu laporan.

**Architecture:** Helper `hariIniWib` untuk rentang tanggal WIB. Komponen `RingkasanInternal` merender kartu. Halaman memuat event hari ini dan saldo buku yang boleh dibaca.

**Tech Stack:** Next.js App Router, Prisma, Tailwind, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-internal-ringkasan`, cabang `feat/cms-internal-ringkasan`

## File map

- Create: `web/lib/schedule/hari-ini.ts`, `web/lib/schedule/hari-ini.test.ts`
- Create: `web/components/admin/ringkasan-internal.tsx`, `web/components/admin/ringkasan-internal.test.tsx`
- Create: `web/app/internal/internal.test.ts`
- Modify: `web/app/internal/page.tsx`

---

### Task 1: helper hari ini WIB

- [ ] Tes `hariIniWib` iso + awal/akhir 24 jam
- [ ] FAIL lalu implementasi dari `toDateInput`/`fromDateInput`

---

### Task 2: komponen RingkasanInternal

- [ ] Tes render: event, kosong, kas, tidak laporan
- [ ] FAIL lalu komponen kartu tautan

---

### Task 3: halaman `/internal`

- [ ] Tes sumber: `RingkasanInternal`, `hariIniWib`, `computeBalance`, tidak `/internal/reports`
- [ ] FAIL lalu page fetch + komponen

---

### Task 4: vitest penuh + browser `/internal`
