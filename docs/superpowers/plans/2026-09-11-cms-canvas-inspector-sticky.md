# CMS canvas inspector sticky Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kolom Blok dipilih di kanvas halaman tetap terlihat saat gulir, sama seperti Palet.

**Architecture:** Tambah `lg:sticky lg:top-4` pada aside inspector di `PageCanvas`, identik dengan aside palet.

**Tech Stack:** Next.js App Router, Tailwind, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-canvas-sticky`, cabang `feat/cms-canvas-inspector-sticky`

## File map

- Modify: `web/components/admin/page-canvas.test.tsx`
- Modify: `web/components/admin/page-canvas.tsx`

---

### Task 1: tes sumber lalu sticky inspector

- [ ] Tes: aside Palet dan aside Blok dipilih keduanya `lg:sticky` dan `lg:top-4`
- [ ] `npx.cmd vitest run components/admin/page-canvas.test.tsx` FAIL (inspector belum sticky)
- [ ] Tambah kelas pada aside inspector
- [ ] Tes PASS

---

### Task 2: vitest penuh + browser gulir halaman kanvas
