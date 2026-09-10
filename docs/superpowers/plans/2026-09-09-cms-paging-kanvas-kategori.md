# CMS paging, kanvas, dan hub kategori Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Paging 5/hal pada kotak masuk dan kas, search + hapus pesan, hub kategori dengan hapus jika belum terpakai, dan kanvas tiga kolom supaya drag tidak perlu scroll.

**Architecture:** Helper `paginate` murni + komponen `Pager` (query `hal`). Inbox dan kas memotong `findMany` dengan `skip`/`take`. Kategori pecah jadi hub + tiga rute detail; hapus keras ditolak jika masih ada relasi. Kanvas: palet sticky, drop di tampilan kisi, inspector kanan untuk blok terpilih. Native HTML5 drag, tanpa library baru.

**Tech Stack:** Next.js App Router, Prisma/SQLite, Vitest, Testing Library. Windows: `$env:Path = "C:\Program Files\nodejs;" + $env:Path` lalu `npx.cmd` / `npm.cmd`.

## Global Constraints

- Bahasa UI Indonesia; radius 0; hit 44px; spec UI 2026-09-07
- Spec: `docs/superpowers/specs/2026-09-09-cms-paging-kanvas-kategori-design.md`
- 5 baris per halaman; query `hal` 1-based diklem; search inbox query `q` reset `hal=1`
- Saldo kas dari semua entri buku, bukan halaman aktif
- Hapus inbox: grant `inbox` `delete` + konfirmasi `Hapus pesan ini?`
- Hapus kategori: grant `kategori` `delete`; ditolak jika masih dipakai; Nonaktifkan tetap ada
- Jangan commit `dev.db`, `.superpowers/`, `web/uploads/*`, `web/package-lock.json` kecuali memang bagian task
- Jangan push kecuali Grace minta

---

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/lib/admin/paginate.ts` | `paginate`, `pageFromQuery`, `DEFAULT_PER_PAGE` |
| `web/components/admin/pager.tsx` | Tautan nomor halaman |
| `web/components/admin/confirm-submit.tsx` | Submit dengan `window.confirm` |
| `web/app/cms/inbox/page.tsx` | Tabel, search GET, paging, aksi |
| `web/app/cms/inbox/actions.ts` | `deleteInboxMessage` + status |
| `web/app/internal/cash/page.tsx` | Paging daftar entri, saldo penuh |
| `web/app/cms/kategori/page.tsx` | Hub tiga kartu |
| `web/app/cms/kategori/turnamen/page.tsx` | Daftar + tambah + nonaktif + hapus |
| `web/app/cms/kategori/kas/page.tsx` | Sama untuk kategori kas |
| `web/app/cms/kategori/berita/page.tsx` | Sama untuk kategori berita |
| `web/app/cms/kategori/actions.ts` | create, deactivate, delete* |
| `web/components/admin/page-canvas.tsx` | Palet / tampilan / inspector |
| `web/components/ui/button.tsx` | `:active` kelihatan pada secondary |

---

### Task 1: Helper paging + Pager

**Files:**
- Create: `web/lib/admin/paginate.ts`
- Create: `web/lib/admin/paginate.test.ts`
- Create: `web/components/admin/pager.tsx`
- Create: `web/components/admin/pager.test.tsx`

**Interfaces:**
- Produces: `DEFAULT_PER_PAGE = 5`
- Produces: `pageFromQuery(value: string | undefined): number` — `parseInt`, non-finite → `1` (belum diklem)
- Produces: `paginate({ total, page, perPage }: { total: number; page: number; perPage?: number }): { page: number; pageCount: number; skip: number; take: number; hasPrev: boolean; hasNext: boolean }`
- Produces: `Pager({ page, pageCount, hrefFor }: { page: number; pageCount: number; hrefFor: (hal: number) => string })`

- [ ] **Step 1: Write failing paginate tests**

```ts
import { describe, expect, it } from 'vitest'
import { DEFAULT_PER_PAGE, pageFromQuery, paginate } from '@/lib/admin/paginate'

describe('paginate', () => {
  it('20 item jadi 4 halaman isi 5', () => {
    const hasil = paginate({ total: 20, page: 1 })
    expect(DEFAULT_PER_PAGE).toBe(5)
    expect(hasil.pageCount).toBe(4)
    expect(hasil.take).toBe(5)
    expect(hasil.skip).toBe(0)
    expect(hasil.hasPrev).toBe(false)
    expect(hasil.hasNext).toBe(true)
  })

  it('halaman 2 skip 5', () => {
    const hasil = paginate({ total: 20, page: 2 })
    expect(hasil.page).toBe(2)
    expect(hasil.skip).toBe(5)
  })

  it('mengklem hal di bawah 1 dan di atas last', () => {
    expect(paginate({ total: 20, page: 0 }).page).toBe(1)
    expect(paginate({ total: 20, page: 99 }).page).toBe(4)
  })

  it('total 0 tetap satu halaman kosong', () => {
    const hasil = paginate({ total: 0, page: 3 })
    expect(hasil.pageCount).toBe(1)
    expect(hasil.page).toBe(1)
    expect(hasil.skip).toBe(0)
  })

  it('pageFromQuery baca angka atau 1', () => {
    expect(pageFromQuery('3')).toBe(3)
    expect(pageFromQuery(undefined)).toBe(1)
    expect(pageFromQuery('x')).toBe(1)
  })
})
```

- [ ] **Step 2: Run — FAIL missing module**

```
cd D:\Me\Work\AstrumDeus\web
npx.cmd vitest run lib/admin/paginate.test.ts
```

Expected: FAIL cannot find module `@/lib/admin/paginate`

- [ ] **Step 3: Implement paginate**

```ts
export const DEFAULT_PER_PAGE = 5

export function pageFromQuery(value: string | undefined): number {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) ? n : 1
}

export function paginate({
  total,
  page,
  perPage = DEFAULT_PER_PAGE,
}: {
  total: number
  page: number
  perPage?: number
}): {
  page: number
  pageCount: number
  skip: number
  take: number
  hasPrev: boolean
  hasNext: boolean
} {
  const pageCount = Math.max(1, Math.ceil(total / perPage) || 1)
  const current = Number.isFinite(page) ? Math.trunc(page) : 1
  const clamped = Math.min(pageCount, Math.max(1, current))
  return {
    page: clamped,
    pageCount,
    skip: (clamped - 1) * perPage,
    take: perPage,
    hasPrev: clamped > 1,
    hasNext: clamped < pageCount,
  }
}
```

- [ ] **Step 4: Run paginate tests — PASS**

`npx.cmd vitest run lib/admin/paginate.test.ts`

- [ ] **Step 5: Write failing Pager test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pager } from '@/components/admin/pager'

describe('Pager', () => {
  it('20 item / 5 menampilkan 4 tautan, halaman aktif ditandai', () => {
    render(<Pager page={2} pageCount={4} hrefFor={(hal) => `/cms/inbox?hal=${hal}`} />)
    expect(screen.getAllByRole('link')).toHaveLength(4)
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('href', '/cms/inbox?hal=3')
  })

  it('satu halaman tidak merender nav', () => {
    const { container } = render(<Pager page={1} pageCount={1} hrefFor={(hal) => `?hal=${hal}`} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 6: Run — FAIL missing Pager**

`npx.cmd vitest run components/admin/pager.test.tsx`

- [ ] **Step 7: Implement Pager**

```tsx
export function Pager({
  page,
  pageCount,
  hrefFor,
}: {
  page: number
  pageCount: number
  hrefFor: (hal: number) => string
}) {
  if (pageCount <= 1) return null
  return (
    <nav aria-label="Halaman" className="mt-6 flex flex-wrap gap-2">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((hal) => (
        <a
          key={hal}
          href={hrefFor(hal)}
          aria-current={hal === page ? 'page' : undefined}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center px-4 font-display text-label uppercase ${
            hal === page ? 'bg-accent text-surface-raised' : 'border-2 border-border-strong'
          }`}
        >
          {String(hal)}
        </a>
      ))}
    </nav>
  )
}
```

- [ ] **Step 8: Run pager + paginate — PASS**

`npx.cmd vitest run lib/admin/paginate.test.ts components/admin/pager.test.tsx`

- [ ] **Step 9: Commit**

```
git add web/lib/admin/paginate.ts web/lib/admin/paginate.test.ts web/components/admin/pager.tsx web/components/admin/pager.test.tsx
git commit -m "feat: helper paging 5 per halaman untuk CMS dan kas"
```

---

### Task 2: Kotak masuk tabel, search, hapus, paging

**Files:**
- Create: `web/components/admin/confirm-submit.tsx`
- Create: `web/components/admin/confirm-submit.test.tsx`
- Create: `web/app/cms/inbox/inbox.test.ts`
- Modify: `web/app/cms/inbox/page.tsx`
- Modify: `web/app/cms/inbox/actions.ts`

**Interfaces:**
- Consumes: `paginate`, `pageFromQuery`, `Pager`
- Produces: `deleteInboxMessage(formData: FormData): Promise<void>` — `requireGrant(user, 'inbox', 'delete')`, `prisma.contactMessage.delete`, redirect `/cms/inbox` dengan `q` dan `hal` dari form (hidden)
- Produces: `ConfirmSubmit` client — `type="submit"`, `window.confirm(message)` sebelum submit

- [ ] **Step 1: Write failing ConfirmSubmit test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'

describe('ConfirmSubmit', () => {
  it('mencegah submit jika confirm false', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const onSubmit = vi.fn((e: Event) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
          Hapus
        </ConfirmSubmit>
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hapus' }))
    expect(window.confirm).toHaveBeenCalledWith('Hapus pesan ini?')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run — FAIL missing module**

`npx.cmd vitest run components/admin/confirm-submit.test.tsx`

- [ ] **Step 3: Implement ConfirmSubmit**

```tsx
'use client'

import { Button, type ButtonProps } from '@/components/ui/button'

export function ConfirmSubmit({
  message,
  onClick,
  ...props
}: ButtonProps & { message: string }) {
  return (
    <Button
      {...props}
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
    />
  )
}
```

- [ ] **Step 4: ConfirmSubmit test PASS**

- [ ] **Step 5: Write failing inbox source tests**

```ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(nama: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'inbox', nama), 'utf8')
}

describe('UI kotak masuk', () => {
  it('memakai tabel, search q, paging, dan hapus', () => {
    const page = baca('page.tsx')
    expect(page).toMatch(/<table/)
    expect(page).toMatch(/name="q"/)
    expect(page).toMatch(/paginate\(/)
    expect(page).toMatch(/subject: \{ contains:/)
    expect(page).toMatch(/email: \{ contains:/)
    expect(page).toMatch(/name: \{ contains:/)
    expect(page).not.toMatch(/message: \{ contains:/)
    expect(page).toMatch(/deleteInboxMessage/)
    expect(page).toMatch(/Hapus pesan ini\?/)
    const actions = baca('actions.ts')
    expect(actions).toMatch(/requireGrant\(user, 'inbox', 'delete'\)/)
    expect(actions).toMatch(/contactMessage\.delete/)
  })
})
```

- [ ] **Step 6: Run — FAIL (page masih `<ul>`)**

`npx.cmd vitest run app/cms/inbox/inbox.test.ts`

- [ ] **Step 7: Add `deleteInboxMessage` in actions.ts**

Keep `updateInboxStatus`. Add:

```ts
export async function deleteInboxMessage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'inbox', 'delete')

  const id = teks(formData, 'id')
  const q = teks(formData, 'q')
  const hal = teks(formData, 'hal')
  if (id) {
    await prisma.contactMessage.delete({ where: { id } })
  }

  revalidatePath('/cms/inbox')
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (hal) params.set('hal', hal)
  const qs = params.toString()
  redirect(qs ? `/cms/inbox?${qs}` : '/cms/inbox')
}
```

- [ ] **Step 8: Rewrite `inbox/page.tsx`**

```tsx
import { deleteInboxMessage, updateInboxStatus } from '@/app/cms/inbox/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Pager } from '@/components/admin/pager'
import { Button } from '@/components/ui/button'
import { pageFromQuery, paginate } from '@/lib/admin/paginate'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { toDateInput } from '@/lib/datetime'

function hrefInbox(q: string, hal: number): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (hal > 1) params.set('hal', String(hal))
  const qs = params.toString()
  return qs ? `/cms/inbox?${qs}` : '/cms/inbox'
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hal?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'inbox', 'view')
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const bisaUbah = can(user.matrix, 'inbox', 'update')
  const bisaHapus = can(user.matrix, 'inbox', 'delete')

  const where = q
    ? {
        OR: [
          { subject: { contains: q } },
          { email: { contains: q } },
          { name: { contains: q } },
        ],
      }
    : {}

  const total = await prisma.contactMessage.count({ where })
  const paging = paginate({ total, page: pageFromQuery(params.hal) })
  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: paging.skip,
    take: paging.take,
  })

  return (
    <div>
      <h2 className="mb-6 font-display text-section uppercase">Kotak masuk</h2>
      <form method="get" action="/cms/inbox" className="mb-6 max-w-xl">
        <Field id="q" label="Cari">
          <input id="q" name="q" defaultValue={q} className={KELAS_KONTROL} />
        </Field>
        <Button type="submit" className="mt-4">
          Cari
        </Button>
      </form>
      {messages.length === 0 ? (
        <p className="text-content-secondary">{q ? 'Tidak ada pesan yang cocok.' : 'Belum ada pesan.'}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[60rem] border-2 border-border-strong text-left">
            <thead>
              <tr className="font-display text-label uppercase text-content-muted">
                <th className="border-b-2 border-border-strong px-4 py-3">Status</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Subjek</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Pengirim</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Tanggal</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Pesan</th>
                <th className="border-b-2 border-border-strong px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="align-top">
                  <td className="border-b border-border-strong px-4 py-3 font-display text-label uppercase text-accent">
                    {message.status}
                  </td>
                  <td className="border-b border-border-strong px-4 py-3 font-display text-body font-semibold">
                    {message.subject}
                  </td>
                  <td className="border-b border-border-strong px-4 py-3 text-small text-content-muted">
                    {message.name} · {message.email}
                  </td>
                  <td className="border-b border-border-strong px-4 py-3 text-small text-content-muted">
                    {toDateInput(message.createdAt)}
                  </td>
                  <td className="border-b border-border-strong px-4 py-3 text-body text-pretty">{message.message}</td>
                  <td className="border-b border-border-strong px-4 py-3">
                    <div className="flex flex-col gap-2">
                      {bisaUbah ? (
                        <form action={updateInboxStatus} className="flex flex-wrap gap-2">
                          <input type="hidden" name="id" value={message.id} />
                          <Button type="submit" name="status" value="dibaca" variant="secondary">
                            Dibaca
                          </Button>
                          <Button type="submit" name="status" value="selesai" variant="secondary">
                            Selesai
                          </Button>
                        </form>
                      ) : null}
                      {bisaHapus ? (
                        <form action={deleteInboxMessage}>
                          <input type="hidden" name="id" value={message.id} />
                          <input type="hidden" name="q" value={q} />
                          <input type="hidden" name="hal" value={String(paging.page)} />
                          <ConfirmSubmit message="Hapus pesan ini?" variant="destructive">
                            Hapus
                          </ConfirmSubmit>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pager page={paging.page} pageCount={paging.pageCount} hrefFor={(hal) => hrefInbox(q, hal)} />
    </div>
  )
}
```

GET search harus **tanpa** hidden `hal` supaya ganti `q` kembali ke halaman 1.

- [ ] **Step 9: Run inbox + confirm tests — PASS**

`npx.cmd vitest run app/cms/inbox/inbox.test.ts components/admin/confirm-submit.test.tsx`

- [ ] **Step 10: Commit**

```
git commit -m "feat: tabel kotak masuk dengan search, hapus, dan paging"
```

---

### Task 3: Paging daftar kas

**Files:**
- Modify: `web/app/internal/cash/page.tsx`
- Modify: `web/app/internal/cash/cash.test.ts`

**Interfaces:**
- Consumes: `paginate`, `pageFromQuery`, `Pager`
- `searchParams`: `{ buku?: string; hal?: string }`
- Saldo: `computeBalance` dari **semua** `entriesAll` (tanpa skip). Daftar: `entriesAll.slice` **dilarang** — pakai `findMany` kedua atau satu query all + paginate slice hanya jika test membuktikan saldo dari array penuh. **Wajib:** `count`/`findMany` all untuk saldo, `findMany` skip/take untuk daftar.

- [ ] **Step 1: Extend cash.test.ts (failing)**

Tambah assertion di describe yang sama:

```ts
  it('paging 5 entri dan saldo dari semua baris', () => {
    const page = readFileSync(path.join(process.cwd(), 'app', 'internal', 'cash', 'page.tsx'), 'utf8')
    expect(page).toMatch(/paginate\(/)
    expect(page).toMatch(/skip: paging\.skip/)
    expect(page).toMatch(/computeBalance\(/)
    expect(page).toMatch(/entriesAll/)
  })
```

- [ ] **Step 2: Run — FAIL entriesAll missing**

`npx.cmd vitest run app/internal/cash/cash.test.ts`

- [ ] **Step 3: Update CashPage data loading**

Ganti `searchParams` jadi `{ buku?: string; hal?: string }`.

Setelah `selected` ada:

```ts
  const kategoriPromise = prisma.expenseCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  const entriesAll = await prisma.cashEntry.findMany({
    where: { cashBookId: selected.id },
    select: { direction: true, amount: true },
    orderBy: { date: 'desc' },
  })
  const total = entriesAll.length
  const paging = paginate({ total, page: pageFromQuery(params.hal) })
  const [entries, categories] = await Promise.all([
    prisma.cashEntry.findMany({
      where: { cashBookId: selected.id },
      include: { category: true, recordedBy: true },
      orderBy: { date: 'desc' },
      skip: paging.skip,
      take: paging.take,
    }),
    kategoriPromise,
  ])
  const saldo = computeBalance(selected.openingBalance, entriesAll)
```

Tab buku: `href={`/internal/cash?buku=${book.id}`}` (tanpa `hal` → halaman 1).

Pager: `hrefFor={(hal) => `/internal/cash?buku=${selected.id}&hal=${hal}`}`.

Import `Pager`, `pageFromQuery`, `paginate`.

Daftar `entries` (bukan `entriesAll`) untuk `<ul>` Koreksi.

- [ ] **Step 4: cash tests PASS**

`npx.cmd vitest run app/internal/cash/cash.test.ts`

- [ ] **Step 5: Commit**

```
git commit -m "feat: paging 5 entri pada buku kas"
```

---

### Task 4: Hub kategori + hapus jika belum terpakai

**Files:**
- Modify: `web/app/cms/kategori/page.tsx` (jadi hub)
- Create: `web/app/cms/kategori/turnamen/page.tsx`
- Create: `web/app/cms/kategori/kas/page.tsx`
- Create: `web/app/cms/kategori/berita/page.tsx`
- Modify: `web/app/cms/kategori/actions.ts`
- Modify: `web/app/cms/kategori/kategori.test.ts`

**Interfaces:**
- Produces: `deleteTournament`, `deleteCashCategory`, `deleteNewsCategory` — `requireKategori('delete')`; hitung relasi; jika `n > 0` redirect `...?kesalahan=pakai&n=`; else `.delete({ where: { id } })`
- Redirect create/deactivate ke rute detail, bukan `/cms/kategori`
- Hub: tiga `<a>` ke `/cms/kategori/turnamen`, `/kas`, `/berita`. Tidak merender `<ul>` daftar item.

Pesan error (pakai `N` dari query):

- Turnamen: `Tidak bisa dihapus. Masih dipakai ${n} pertandingan atau statistik.`
- Kas: `Tidak bisa dihapus. Masih dipakai ${n} entri kas.`
- Berita: `Tidak bisa dihapus. Masih dipakai ${n} berita.`

Konfirmasi: `Hapus turnamen ini?` / `Hapus kategori ini?`

- [ ] **Step 1: Replace kategori.test.ts (failing vs current hubless page)**

```ts
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function baca(rel: string): string {
  return readFileSync(path.join(process.cwd(), 'app', 'cms', 'kategori', rel), 'utf8')
}

describe('UI kategori', () => {
  it('hub hanya tiga tautan jenis, tanpa daftar item', () => {
    const hub = baca('page.tsx')
    expect(hub).toMatch(/\/cms\/kategori\/turnamen/)
    expect(hub).toMatch(/\/cms\/kategori\/kas/)
    expect(hub).toMatch(/\/cms\/kategori\/berita/)
    expect(hub).not.toMatch(/deactivateTournament/)
    expect(hub).not.toMatch(/prisma\.tournament\.findMany/)
  })

  it('hapus ditolak jika masih ada relasi', () => {
    const actions = baca('actions.ts')
    expect(actions).toMatch(/deleteTournament/)
    expect(actions).toMatch(/playerStat\.count/)
    expect(actions).toMatch(/match\.count/)
    expect(actions).toMatch(/cashEntry\.count/)
    expect(actions).toMatch(/newsPost\.count/)
    expect(baca('turnamen/page.tsx')).toMatch(/Hapus turnamen ini\?/)
    expect(baca('kas/page.tsx')).toMatch(/Hapus kategori ini\?/)
    expect(baca('berita/page.tsx')).toMatch(/Hapus kategori ini\?/)
  })
})
```

- [ ] **Step 2: Run — FAIL missing detail routes**

`npx.cmd vitest run app/cms/kategori/kategori.test.ts`

- [ ] **Step 3: Update actions redirects + deletes**

`revalidateKategori` tetap. Semua `redirect('/cms/kategori')` create/deactivate ganti:

- turnamen → `/cms/kategori/turnamen`
- kas → `/cms/kategori/kas`
- berita → `/cms/kategori/berita` (termasuk `?kesalahan=nama`)

`requireKategori` terima `'create' | 'update' | 'delete'`.

```ts
export async function deleteTournament(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/turnamen')

  const [matches, stats] = await Promise.all([
    prisma.match.count({ where: { tournamentId: id } }),
    prisma.playerStat.count({ where: { tournamentId: id } }),
  ])
  const n = matches + stats
  if (n > 0) {
    redirect(`/cms/kategori/turnamen?kesalahan=pakai&n=${n}`)
  }
  await prisma.tournament.delete({ where: { id } })
  revalidateKategori()
  redirect('/cms/kategori/turnamen')
}

export async function deleteCashCategory(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/kas')
  const n = await prisma.cashEntry.count({ where: { categoryId: id } })
  if (n > 0) {
    redirect(`/cms/kategori/kas?kesalahan=pakai&n=${n}`)
  }
  await prisma.expenseCategory.delete({ where: { id } })
  revalidateKategori()
  redirect('/cms/kategori/kas')
}

export async function deleteNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/berita')
  const n = await prisma.newsPost.count({ where: { categoryId: id } })
  if (n > 0) {
    redirect(`/cms/kategori/berita?kesalahan=pakai&n=${n}`)
  }
  await prisma.newsCategory.delete({ where: { id } })
  revalidateKategori()
  redirect('/cms/kategori/berita')
}
```

- [ ] **Step 4: Hub page**

```tsx
import Link from 'next/link'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'

const JENIS = [
  { href: '/cms/kategori/turnamen', label: 'Turnamen' },
  { href: '/cms/kategori/kas', label: 'Kategori kas' },
  { href: '/cms/kategori/berita', label: 'Kategori berita' },
] as const

export default async function CmsKategoriPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'kategori', 'view')
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="font-display text-section uppercase">Kategori</h2>
        <p className="mt-3 max-w-2xl text-body text-content-secondary">
          Pilih jenis kategori. Nonaktif hilang dari form baru. Hapus hanya jika belum dipakai data.
        </p>
      </header>
      <ul className="flex max-w-xl flex-col gap-3">
        {JENIS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex min-h-11 items-center border-2 border-border-strong px-4 font-display text-label uppercase"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 5: Three detail pages**

Pindahkan section dari page lama. Tiap halaman: `Link` kembali `/cms/kategori`. `ConfirmSubmit` untuk Hapus. Nonaktifkan tetap `Button variant="secondary"` tanpa confirm.

Tampilkan alert jika `kesalahan=pakai`:

```tsx
const n = Number.parseInt(params.n ?? '0', 10)
{params.kesalahan === 'pakai' ? (
  <p role="alert" className="text-body text-danger">
    Tidak bisa dihapus. Masih dipakai {n} pertandingan atau statistik.
  </p>
) : null}
```

(teks kas/berita sesuai spec.)

`bisaHapus = can(user.matrix, 'kategori', 'delete')`. Hapus tampil untuk semua item (aktif atau nonaktif) jika `bisaHapus`.

- [ ] **Step 6: kategori tests PASS**

`npx.cmd vitest run app/cms/kategori/kategori.test.ts`

- [ ] **Step 7: Commit**

```
git commit -m "feat: hub kategori dan hapus jika belum terpakai"
```

---

### Task 5: Kanvas tiga kolom

**Files:**
- Modify: `web/components/admin/page-canvas.tsx`
- Modify: `web/components/admin/page-canvas.test.tsx`
- Modify: `web/components/ui/button.tsx` — secondary `active:bg-accent active:text-surface-raised`

**Interfaces:**
- Tetap: `PageCanvas({ pageId, initialRows, action })`, hidden `id` + `layout` JSON
- Palet kiri sticky; zona drop `aria-label="Baris N"` dan `Baris baru` di **tampilan** tengah (bukan daftar form panjang)
- State `selectedId: string | null` — default `initialRows[0]?.blocks[0]?.id ?? null`
- Inspector kanan: `BlockFields` + lebar 4/6/8/12 dengan `aria-pressed` + `variant` primary jika aktif; Pindah kiri/kanan `disabled` di ujung
- Jika tidak ada pilihan: teks `Pilih blok di tampilan.`
- Blok kosong di tampilan: plaseholder muted (`Judul`, `Teks`, …). Jangan ubah `PageBlocks` publik.

- [ ] **Step 1: Add failing tests to page-canvas.test.tsx**

```ts
  it('menandai lebar aktif dengan aria-pressed', () => {
    render(
      <PageCanvas
        pageId="p1"
        initialRows={[
          {
            id: 'r1',
            blocks: [{ id: 'b1', type: 'text', width: 6, payload: { text: 'Isi' } }],
          },
        ]}
      />,
    )
    expect(screen.getByRole('button', { name: 'Lebar 6' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Lebar 4' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('form layout tiga kolom palet tampilan inspector', () => {
    const { container } = render(<PageCanvas pageId="p1" initialRows={[]} />)
    expect(container.querySelector('form')?.className).toMatch(/lg:grid-cols-/)
    expect(screen.getByText('Pilih blok di tampilan.')).toBeInTheDocument()
  })
```

Ubah tes lebar: setelah klik `Lebar 8`, assert `aria-pressed="true"` pada 8.

Tes ImageUpload: pilih blok gambar dulu (`getByLabelText('Blok Logo')` atau klik tampilan) sebelum `Pilih gambar` — inspector hanya untuk terpilih. Default selected first block → ImageUpload tetap di dokumen.

- [ ] **Step 2: Run — FAIL aria-pressed missing**

`npx.cmd vitest run components/admin/page-canvas.test.tsx`

- [ ] **Step 3: Restructure page-canvas.tsx**

Form class: `grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)_20rem] lg:items-start`

Aside palet: `lg:sticky lg:top-4`

Tampilan: tiap baris `grid grid-cols-12 gap-6` + `onDrop` `taruhDiBaris`. Tiap blok:

```tsx
<button
  type="button"
  draggable
  aria-label={`Blok ${namaBlok(block)}`}
  aria-pressed={selectedId === block.id}
  className={`col-span-${/* pakai map COL_SPAN yang sama seperti page-blocks, termasuk max-md:col-span-12 */} min-h-11 border-2 p-4 text-left ${
    selectedId === block.id ? 'border-accent' : 'border-border-strong'
  }`}
  onClick={() => setSelectedId(block.id)}
  onDragStart={...}
>
  {/* plaseholder jika namaBlok === type */}
</button>
```

Jangan interpolasi Tailwind dinamis `col-span-${n}` — pakai record:

```ts
const COL_SPAN: Record<4 | 6 | 8 | 12, string> = {
  4: 'col-span-4 max-md:col-span-12',
  6: 'col-span-6 max-md:col-span-12',
  8: 'col-span-8 max-md:col-span-12',
  12: 'col-span-12 max-md:col-span-12',
}
```

Naik/Turun di header baris tampilan.

Inspector: cari blok `selectedId`; render `BlockFields` + lebar + pindah.

Saat `tambahJenisDiBarisBaru` / drop palet: `setSelectedId` ke id blok baru (`buatBlok` dulu, simpan id).

Button secondary: tambah `active:bg-accent active:text-surface-raised` di `KELAS_VARIAN.secondary`.

- [ ] **Step 4: All page-canvas tests PASS**

`npx.cmd vitest run components/admin/page-canvas.test.tsx components/ui/button.test.tsx`

Perbaiki tes lama: `getByLabelText('Blok heading')` vs `Blok ${nama}` — klik palet masih menambah baris; drop ke `Baris baru` / `Baris 1` tetap.

- [ ] **Step 5: Full vitest**

```
cd D:\Me\Work\AstrumDeus\web
npx.cmd vitest run
```

Expected: all files pass (baseline 332 + tes baru).

- [ ] **Step 6: Browser (lokal)**

Login `admin@astrumdeus.id` / `astrum-cms-dev`.

1. `/cms/inbox` — tabel, Cari email, 5 baris, Hapus confirm
2. `/internal/cash` — halaman 2, saldo sama dengan halaman 1
3. `/cms/kategori` — 3 kartu; turnamen Hapus yang terpakai tampil error
4. Kanvas custom — drag dari palet ke tampilan tanpa scroll form; lebar aktif emas

- [ ] **Step 7: Commit**

```
git commit -m "feat: kanvas palet, tampilan kisi, dan inspector blok"
```

---

## Self-review (plan vs spec)

| Spec | Task |
| --- | --- |
| `paginate` 20→4, klem 0/99 | Task 1 |
| Inbox tabel, `q` subjek/email/nama, bukan isi pesan | Task 2 |
| Hapus inbox + confirm + grant delete | Task 2 |
| Kas 5/hal, saldo semua entri, ganti buku tanpa `hal` | Task 3 |
| Hub 3 kartu + rute detail | Task 4 |
| Hapus kategori ditolak jika relasi; Nonaktifkan tetap | Task 4 |
| Kanvas 3 kolom, aria-pressed lebar, drop di tampilan | Task 5 |
| Di luar: paging berita, search kas, ubah renderer publik | tidak ada task |
