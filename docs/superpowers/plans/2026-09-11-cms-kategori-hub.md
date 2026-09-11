# CMS kategori hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hub kategori rata kiri; halaman jenis memakai ikon kembali di samping judul.

**Architecture:** Kunci `page.tsx` hub tanpa `mx-auto`. Komponen `KategoriJudul` mengganti tautan teks di tiga rute detail.

**Tech Stack:** Next.js App Router, Tailwind, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-kategori`, cabang `feat/cms-kategori-hub`

## File map

- Create: `web/components/admin/kategori-judul.tsx`
- Modify: `web/app/cms/kategori/page.tsx`, `turnamen/page.tsx`, `kas/page.tsx`, `berita/page.tsx`, `kategori.test.ts`

---

### Task 1: tes sumber lalu UI

- [ ] Tes: hub tanpa `mx-auto`; detail `KategoriJudul` + `aria-label="Kembali ke kategori"` + svg; tidak teks `Kembali ke kategori`
- [ ] `npx.cmd vitest run app/cms/kategori/kategori.test.ts` FAIL
- [ ] Implementasi `KategoriJudul` + pakai di tiga halaman; hub tetap rata kiri
- [ ] Tes PASS

---

### Task 2: vitest penuh + browser `/cms/kategori` lalu Turnamen
