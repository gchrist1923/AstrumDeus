# CMS pengguna Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Form buat pengguna dengan peran multiple; daftar tanpa Simpan peran.

**Architecture:** Sederhanakan `users/page.tsx`. Hapus `saveUserRoles`. Perbarui tes peran yang mengunci `saveUserRoles` di halaman pengguna.

**Tech Stack:** Next.js App Router, Prisma, Vitest.

## Global Constraints

- Bahasa UI Indonesia
- Jangan commit kecuali Grace minta
- Worktree: `D:\Me\Work\AstrumDeus-pengguna`, cabang `feat/cms-pengguna`

## File map

- Modify: `web/app/cms/users/page.tsx`, `web/app/cms/users/actions.ts`
- Create: `web/app/cms/users/users.test.ts`
- Modify: `web/app/cms/peran/peran.test.ts`

---

### Task 1: tes sumber gagal lalu UI + hapus saveUserRoles

- [ ] Tes: tidak Simpan peran / saveUserRoles; form saveUser + role- + Tambah pengguna; toggleUserActive tetap
- [ ] peran.test.ts: `saveUser` bukan `saveUserRoles`
- [ ] Implementasi: form dulu, list ringkas, hapus fungsi saveUserRoles

---

### Task 2: vitest penuh + browser `/cms/users`
