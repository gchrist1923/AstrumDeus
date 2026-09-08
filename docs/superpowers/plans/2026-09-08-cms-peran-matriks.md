# CMS peran kustom dan matriks hak Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** paket 2 (nav Kategori sudah ada). Paket 4 belum perlu; modul `halaman` di matriks boleh ada dulu (selalu false kecuali Admin) sampai builder hidup.

**Goal:** Admin membuat peran bernama bebas dengan matriks modul × lihat/tambah/ubah/hapus. Hak user = union peran. Peran Admin tidak bisa dihapus atau dikurangi. Nav dan URL mengikuti matriks, bukan empat string hardcoded.

**Architecture:** Tabel `AccessRole` + `AccessGrant` + `UserAccessRole`. Seed: peran sistem `Admin` (`isAdmin true`) plus templat Editor, Team, Finance. `User.roles` JSON **tetap diisi sinkron** string lama (`admin`/`editor`/`team`/`finance`) selama migrasi data, lalu semua cek `can*` membaca matriks. Ownership jadwal/kas tim tetap fungsi kode, bukan baris matriks.

**Tech Stack:** Prisma, Next.js, Vitest. Windows: `npx.cmd`.

## Global Constraints

- Aksi: `view` / `create` / `update` / `delete` (lihat / tambah / ubah / hapus)
- Tanpa lihat: nav hilang; URL ditolak (`redirect('/cms')` atau `/internal` sesuai area)
- Tambah/ubah/hapus tanpa lihat diabaikan (`grant` efektif hanya jika view true)
- Admin: tidak delete role; update yang mengurangi grant ditolak
- Beberapa peran per user; union
- Copy UI: templat Editor, Team, Finance
- Spec paket 3; ownership bukan centang extra
- Bahasa Indonesia; radius 0; 44px

---

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/lib/auth/modules.ts` | Daftar 16 modul + label ID |
| `web/lib/auth/grants.ts` | Tipe grant, union, `effectiveGrant`, templat |
| `web/lib/auth/permissions.ts` | Ganti pemakaian `canAccessCms` dll. |
| `web/prisma/schema.prisma` | `AccessRole`, `AccessGrant`, `UserAccessRole` |
| `web/prisma/seed.ts` | Admin + 3 templat; tautkan user seed |
| `web/app/cms/peran/page.tsx` | Daftar peran |
| `web/app/cms/peran/[id]/page.tsx` | Matriks checkbox |
| `web/app/cms/peran/actions.ts` | CRUD + copy template + protect Admin |
| `web/app/cms/users/*` | Assign banyak peran (bukan JSON string mentah) |
| `web/components/admin/admin-shell.tsx` | Nav dari view grants |
| `web/lib/auth/require.ts` | Cek modul+aksi |

Modul (kunci stabil, label UI):

```
news Berita
roster Roster
matches Pertandingan
media-kit Media Kit
partners Partners
inbox Kotak masuk
menu Menu
situs Situs
users Pengguna
kategori Kategori
peran Peran
halaman Halaman
jadwal Jadwal
kas-operasional Kas operasional
kas-tim Kas tim
laporan Laporan
```

---

### Task 1: Model grant murni (tanpa Prisma)

**Files:**
- Create: `web/lib/auth/modules.ts`
- Create: `web/lib/auth/grants.ts`
- Test: `web/lib/auth/grants.test.ts`

**Interfaces:**

```ts
export type AccessModule =
  | 'news' | 'roster' | 'matches' | 'media-kit' | 'partners' | 'inbox'
  | 'menu' | 'situs' | 'users' | 'kategori' | 'peran' | 'halaman'
  | 'jadwal' | 'kas-operasional' | 'kas-tim' | 'laporan'

export type AccessAction = 'view' | 'create' | 'update' | 'delete'

export type Grant = Record<AccessAction, boolean>
export type GrantMatrix = Record<AccessModule, Grant>

export const EMPTY_GRANT: Grant = { view: false, create: false, update: false, delete: false }

export function clampGrant(g: Grant): Grant // create/update/delete false if !view
export function unionMatrices(matrices: GrantMatrix[]): GrantMatrix
export function can(matrix: GrantMatrix, module: AccessModule, action: AccessAction): boolean
export function editorTemplate(): GrantMatrix
export function teamTemplate(): GrantMatrix
export function financeTemplate(): GrantMatrix
export function adminTemplate(): GrantMatrix // semua true
export function isAdminMatrixReduced(next: GrantMatrix): boolean // true jika ada false
```

Templat Editor: view+create+update+delete pada `news, roster, matches, media-kit, partners, inbox, kategori, halaman`. Lainnya false. Tidak `menu, situs, users, peran, jadwal, kas-*, laporan`.

Templat Team: `jadwal` view+update (create/delete false — ownership di kode); `kas-tim` view+create+update. Tidak CMS.

Templat Finance: `kas-operasional` dan `kas-tim` view+create+update; `laporan` view; `jadwal` view saja. Tidak CMS.

- [ ] **Step 1: Failing tests**

```ts
it('peran hanya laporan lihat tidak bisa buka berita atau catat kas', () => {
  const matrix = unionMatrices([
    { ...emptyMatrix(), laporan: { view: true, create: false, update: false, delete: false } },
  ])
  expect(can(matrix, 'news', 'view')).toBe(false)
  expect(can(matrix, 'kas-operasional', 'create')).toBe(false)
  expect(can(matrix, 'laporan', 'view')).toBe(true)
})

it('Editor+Finance adalah union', () => {
  const matrix = unionMatrices([editorTemplate(), financeTemplate()])
  expect(can(matrix, 'news', 'update')).toBe(true)
  expect(can(matrix, 'laporan', 'view')).toBe(true)
  expect(can(matrix, 'peran', 'view')).toBe(false)
})

it('mengurangi matriks Admin terdeteksi', () => {
  const next = adminTemplate()
  next.news.view = false
  expect(isAdminMatrixReduced(next)).toBe(true)
})

it('aksi tulis tanpa lihat di-clamp', () => {
  expect(clampGrant({ view: false, create: true, update: true, delete: true })).toEqual(EMPTY_GRANT)
})
```

`emptyMatrix()`: setiap modul `EMPTY_GRANT`.

- [ ] **Step 2: FAIL missing modules**

- [ ] **Step 3: Implement modules.ts + grants.ts**

- [ ] **Step 4: Tes PASS**

- [ ] **Step 5: Commit** `feat: model matriks hak CMS dan templat peran`

---

### Task 2: Prisma AccessRole + seed + load matrix user

**Files:**
- Modify: `web/prisma/schema.prisma`

```prisma
model AccessRole {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  isAdmin   Boolean  @default(false)
  grants    String   // JSON GrantMatrix
  createdAt DateTime @default(now())
  users     UserAccessRole[]
}

model UserAccessRole {
  userId String
  roleId String
  user   User @relation(...)
  role   AccessRole @relation(...)
  @@id([userId, roleId])
}
```

Tambah relasi `accessRoles UserAccessRole[]` di `User`.

- Modify: `web/prisma/seed.ts` — upsert Admin (isAdmin, adminTemplate), Editor, Team, Finance; user `admin@astrumdeus.id` terhubung ke Admin (boleh tetap JSON `roles` `["admin","editor","finance"]` sampai users UI diganti).
- Create: `web/lib/auth/load-matrix.ts` — `getUserMatrix(userId): Promise<GrantMatrix>` union semua peran.
- Modify: `web/lib/auth/session.ts` — `AuthUser` tambah `matrix: GrantMatrix` (load saat session).
- Test: `web/lib/auth/load-matrix.test.ts` — mock prisma roles JSON.

Migrasi: `npx.cmd prisma migrate dev --name access_roles`

Jaga `User.roles` string: `parseRoles` masih dipakai tes lama sampai Task 3 mengganti `can*`.

- [ ] **Step 1: Tes load-matrix union dari JSON grants**

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Schema, migrate, seed, loader, session.matrix**

Jika getCurrentUser tanpa join roles (user lama), fallback: bila tidak ada `UserAccessRole`, derive matrix dari `parseRoles` + templat (admin→adminTemplate, dst) supaya tidak lock-out.

```ts
export function matrixFromLegacyRoles(roles: Role[]): GrantMatrix {
  const parts: GrantMatrix[] = []
  if (roles.includes('admin')) parts.push(adminTemplate())
  if (roles.includes('editor')) parts.push(editorTemplate())
  if (roles.includes('team')) parts.push(teamTemplate())
  if (roles.includes('finance')) parts.push(financeTemplate())
  return unionMatrices(parts)
}
```

Tes fallback.

- [ ] **Step 4: PASS + seed tidak merusak login**

- [ ] **Step 5: Commit** `feat: tabel peran akses dan matriks di session`

---

### Task 3: Ganti gate hardcoded dengan matriks

**Files:**
- Create: `web/lib/auth/permissions.ts`

```ts
export function canAccessCms(matrix: GrantMatrix): boolean {
  const cms: AccessModule[] = ['news','roster','matches','media-kit','partners','inbox','menu','situs','users','kategori','peran','halaman']
  return cms.some((m) => can(matrix, m, 'view'))
}
```

Internal: view `jadwal` | `kas-*` | `laporan`.

Tetap: `canWriteSchedule(matrix, ownerId, actorId)` — butuh `can(matrix,'jadwal','update')` **dan** (admin matrix full jadwal delete? Spec: Admin full. Team: update hanya milik sendiri). Implement:

```
if (can(matrix, 'jadwal', 'delete')) return true // admin-like
return can(matrix, 'jadwal', 'update') && ownerId === actorId
```

Kas: finance template punya kedua buku update; team hanya kas-tim + recordedBy === actor.

- Modify: semua pemakai `canAccessCms(user.roles)` → `canAccessCms(user.matrix)` atau `can(user.matrix, 'news', 'view')` per halaman.
- Modify: `require.ts` — `requireCmsUser` pakai matrix; tambah `requireGrant(user, module, action)`.
- Modify: `admin-shell.tsx` — tampilkan tautan hanya jika `can(matrix, module, 'view')`. Map href:

| href | modul |
| --- | --- |
| /cms/news | news |
| /cms/players | roster |
| /cms/matches | matches |
| /cms/media-kit | media-kit |
| /cms/partners | partners |
| /cms/inbox | inbox |
| /cms/menu | menu |
| /cms/settings | situs |
| /cms/users | users |
| /cms/kategori | kategori |
| /cms/peran | peran |
| /cms/halaman | halaman (404 sampai paket 4) |
| /internal/schedule | jadwal |
| /internal/cash | kas-operasional **atau** kas-tim |
| /internal/reports | laporan |

Halaman aksi: `saveNews` cek `update`/`create`; `deleteNews` cek `delete`.

- Modify: `web/lib/auth/roles.test.ts` — **jangan hapus** tes legacy `Role`; tambah tes permissions matrix. Boleh re-export adapter `canAccessCms(roles)` deprecated yang convert via `matrixFromLegacyRoles` supaya tes lama tetap, **atau** update tes ke matrix. Pilih update tes ke matrix + pertahankan `parseRoles` untuk JSON user lama.

Upload `POST /api/media`: izinkan jika user punya `create` atau `update` pada salah satu `news|roster|media-kit|partners|situs|halaman`.

- [ ] **Step 1: Failing tests permissions.ts (laporan-only, union, admin)**

Samakan dengan spec tes paket 3.

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Wire require + actions + shell + api/media**

- [ ] **Step 4: `npx.cmd vitest run` — perbaiki setiap pemakai `user.roles` untuk gate**

- [ ] **Step 5: Commit** `feat: hak CMS dan internal dibaca dari matriks peran`

---

### Task 4: UI `/cms/peran` + assign user

**Files:**
- Create: `web/app/cms/peran/page.tsx` — daftar + form nama + tombol `Salin Editor` / `Salin Team` / `Salin Finance` (tiga form actions dengan hidden `template`)
- Create: `web/app/cms/peran/[id]/page.tsx` — tabel modul × 4 checkbox. Label kolom: Lihat, Tambah, Ubah, Hapus. Peran `isAdmin`: checkbox disabled; submit ditolak server.
- Create: `web/app/cms/peran/actions.ts` — `createRole`, `copyTemplate`, `saveGrants`, `deleteRole` (tolak isAdmin; `deleteRole`  tidak tersedia di UI Admin)
- Modify: `web/app/cms/users/page.tsx` + `actions.ts` — multi checkbox peran; simpan `UserAccessRole`; sinkron `User.roles` JSON dari slug templat yang cocok plus `custom` diabaikan di parseRoles (hanya admin/editor/team/finance jika nama slug itu)

`deleteRole`: jika `isAdmin` throw/redirect. `saveGrants`: jika `isAdmin && isAdminMatrixReduced(next)` tolak.

Tes: `web/lib/auth/protect-admin.test.ts`

```ts
export function assertAdminRoleMutation(role: { isAdmin: boolean }, next?: GrantMatrix): 'ok' | 'hapus' | 'kurangi'
```

- [ ] **Step 1: Tes protect-admin hapus/kurangi**

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Pages + actions + users assign. Nav Peran hanya jika `can(matrix,'peran','view')`.**

Matriks: `<table>` bukan card-stack. Checkbox `min-h-11 min-w-11`. Jangan pill.

- [ ] **Step 4: vitest PASS**

- [ ] **Step 5: Commit** `feat: halaman matriks peran dan penugasan pengguna`

---

### Task 5: Verifikasi browser

- User kustom hanya Laporan lihat: tidak masuk `/cms/news`, tidak form kas.
- Assign Editor+Finance ke user uji: berita + laporan.
- Coba hapus Admin — tidak ada tombol / action ditolak.
- Coba uncentang grant Admin — disabled / error.
- Login seed admin masih full.

---

## Cakupan spec paket 3

| Requirement | Task |
| --- | --- |
| Peran bernama + matriks 4 aksi | 1, 4 |
| UI `/cms/peran` + salin templat | 4 |
| Admin terkunci | 1, 4, 5 |
| Union multi peran | 1, 3 |
| 16 modul | 1 |
| Tanpa lihat = no nav + URL deny | 3 |
| Templat Editor/Team/Finance | 1, 2 |
| Ganti canAccessCms hardcoded | 3 |
| Seed Admin + templat | 2 |
| Tes laporan-only, union, tolak hapus Admin | 1, 4, 5 |
