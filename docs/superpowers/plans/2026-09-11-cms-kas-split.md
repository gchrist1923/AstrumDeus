# CMS kas split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menu dan rute kas operasional vs kas tim terpisah, mengikuti hak `kas-operasional` / `kas-tim`.

**Architecture:** `internalNavLinks` dua tautan. Halaman bersama `KasBukuPage` di `/internal/cash/operasional` dan `/tim`. Indeks `/internal/cash` redirect.

**Tech Stack:** Next.js App Router, Prisma, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-kas-split`, cabang `feat/cms-kas-split`

## File map

- Modify: `web/components/admin/admin-shell.tsx`
- Create: `web/components/admin/internal-nav.test.ts`
- Create: `web/lib/finance/cash-path.ts` (+ test)
- Create: `web/app/internal/cash/kas-buku.tsx`
- Create: `web/app/internal/cash/operasional/page.tsx`, `tim/page.tsx`
- Modify: `web/app/internal/cash/page.tsx`, `actions.ts`, `cash.test.ts`
- Modify: `web/lib/auth/require.ts`, `web/app/internal/page.tsx`

---

### Task 1: path + nav

- [ ] Tes `cashBookPath` dan `internalNavLinks` Team/Finance
- [ ] FAIL lalu helper + nav

---

### Task 2: rute halaman

- [ ] Tes sumber: requireCashBookView, `/internal/cash/operasional`, tidak pager `?buku=`
- [ ] FAIL lalu KasBukuPage + redirect indeks

---

### Task 3: vitest penuh + browser admin (dua menu) dan user Team (hanya kas tim)
