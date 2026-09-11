# CMS peran Ubah Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Daftar peran punya aksi Ubah; buat peran langsung ke halaman pilih menu CMS/internal.

**Architecture:** Tetap `saveGrants` + matriks. UI daftar seperti Partners. Redirect create ke detail. Detail dikelompokkan CMS vs Internal + ikon kembali.

**Tech Stack:** Next.js App Router, Prisma, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-peran`, cabang `feat/cms-peran-ubah`

## File map

- Modify: `web/app/cms/peran/page.tsx`, `[id]/page.tsx`, `actions.ts`, `peran.test.ts`
- Create: `web/components/admin/peran-judul.tsx` (ikon kembali, href `/cms/peran`)

---

### Task 1: tes sumber lalu UI + redirect

- [ ] Tes daftar `Ubah`; create redirect ke `role.id`; detail CMS + Internal
- [ ] FAIL
- [ ] Implement
- [ ] PASS

---

### Task 2: vitest penuh + browser `/cms/peran`
