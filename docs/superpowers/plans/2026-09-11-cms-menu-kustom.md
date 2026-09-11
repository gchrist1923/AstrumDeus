# CMS menu halaman kustom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Halaman kustom yang terbit muncul di `/cms/menu` dan bisa dimatikan dari situ lewat `isEnabled`.

**Architecture:** Helper murni memfilter halaman. Form Menu menambah checkbox `custom:{id}`. `saveMenuFlags` meng-update `SitePage` terbit tanpa membuat `MenuItem`.

**Tech Stack:** Next.js App Router, Prisma, Vitest.

## Global Constraints

- Bahasa UI: kelompok **Halaman terbit**
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-menu`, cabang `feat/cms-menu-kustom`
- Windows: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`

## File map

- Create: `web/lib/pages/menu-kustom.ts`, `web/lib/pages/menu-kustom.test.ts`
- Create: `web/app/cms/menu/menu.test.ts`
- Modify: `web/app/cms/menu/page.tsx`, `web/app/cms/menu/actions.ts`

---

### Task 1: helper customPagesForMenu

**Produces:** `customFieldName(id: string): string` → `custom:${id}`

`customPagesForMenu(pages): { id, title, isEnabled, fieldName }[]` — filter `kind==='custom' && status==='published'`, urut judul.

- [ ] Tes gagal lalu implementasi

---

### Task 2: UI + saveMenuFlags

- [ ] Tes sumber: `customPagesForMenu`, `Halaman terbit`, `custom:`
- [ ] actions: `customFieldName` / `custom:`, `sitePage.update`, `isEnabled`
- [ ] Render kelompok kustom; simpan checkbox ke `isEnabled`

---

### Task 3: vitest penuh + browser `/cms/menu`
