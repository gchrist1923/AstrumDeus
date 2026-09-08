# CMS daftar halaman dan kanvas kisi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Depends on:** paket 1 (ImageUpload di blok gambar), paket 2 (nav pola CMS), paket 3 (modul `halaman` + `menu`). Home dan 7 halaman bawaan **bukan** kanvas.

**Goal:** Daftar `/cms/halaman` untuk tujuh rute bawaan (toggle Y/N, mandatory terkunci) dan halaman baru (slug, draft/terbit, nav, kanvas kisi 12 kolom). Publik `/{slug}` merender blok; toggle mati atau draft = 404.

**Architecture:** Tabel `SitePage` (`kind: builtin | custom`). Builtin di-seed dari 7 `MenuItem` yang ada; `isEnabled` tetap sumber toggle (sinkron dua arah). Custom: JSON `blocks` array baris. Renderer publik + editor klien kisi. Reserved slugs ditolak.

**Tech Stack:** Prisma, Next.js App Router catch-all hati-hati (jangan telan `/news`), Vitest + Testing Library, `@dnd-kit` hanya jika sudah ada di repo — **jangan tambah dependency** kecuali tes drag mustahil tanpa. Default: tombol `Naik/Turun` + `Lebar 4/6/8/12` dulu; drag palet ke baris boleh HTML Drag and Drop API native.

## Global Constraints

- Bahasa Indonesia; radius 0; 44px; spec UI
- Tujuh bawaan: Home, Roster, Matches, News, Media Kit, Partners, Contact — **tidak membuka kanvas**; edit lewat form CMS existing
- Home komposisi tetap kode
- Lebar blok hanya 4, 6, 8, 12; jumlah lebar per baris ≤ 12; tidak overlap
- Di bawah `md` (960px): tiap blok `col-span-12` berurutan
- Nav custom: `status === 'published'` **dan** `showInNav && isEnabled`
- Reserved slugs: `roster`, `matches`, `news`, `media-kit`, `partners`, `contact`, `login`, `cms`, `internal`, `media`, `api`, `toggle` (plus `''` dan `index`)
- Spec paket 4
- Hak: `can(matrix, 'halaman', ...)` dan toggle builtin `can(matrix, 'menu', 'update')`

---

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/lib/pages/reserved.ts` | Daftar slug terlarang + `assertCustomSlug` |
| `web/lib/pages/grid.ts` | Validasi baris: widths, no overflow |
| `web/lib/pages/types.ts` | Block union: heading, text, image, button, list |
| `web/prisma` | model `SitePage` |
| `web/app/cms/halaman/page.tsx` | Daftar |
| `web/app/cms/halaman/new/page.tsx` | Buat slug/judul |
| `web/app/cms/halaman/[id]/page.tsx` | Kanvas hanya `kind=custom`; builtin → tautan ke form existing |
| `web/app/cms/halaman/actions.ts` | CRUD, toggle, publish |
| `web/app/[slug]/page.tsx` | Publik custom page; `notFound` jika reserved (biarkan rute konkrit menang) |
| `web/lib/nav.ts` | Item nav dinamis dari halaman custom |
| `web/components/admin/page-canvas.tsx` | Editor kisi |
| `web/components/public/page-blocks.tsx` | Renderer |

Blok JSON:

```ts
export type BlockType = 'heading' | 'text' | 'image' | 'button' | 'list'

export interface PageBlock {
  id: string
  type: BlockType
  width: 4 | 6 | 8 | 12
  // heading: { text, level: 2 | 3 }
  // text: { html or plain paragraphs string }
  // image: { src, alt }  // src dari ImageUpload paket 1
  // button: { label, href }
  // list: { items: string[] }
  payload: Record<string, unknown>
}

export interface PageRow {
  id: string
  blocks: PageBlock[]
}
```

`SitePage.layout` = JSON `PageRow[]`.

---

### Task 1: Slug terlarang + validasi kisi

**Files:**
- Create: `web/lib/pages/reserved.ts`
- Create: `web/lib/pages/grid.ts`
- Test: `web/lib/pages/reserved.test.ts`
- Test: `web/lib/pages/grid.test.ts`

**Interfaces:**

```ts
export const RESERVED_SLUGS: readonly string[]

export function normalizeSlug(raw: string): string // slugify

export function slugIsReserved(slug: string): boolean

export function rowWidth(blocks: { width: number }[]): number

export function canPlaceBlock(row: { width: number }[], width: 4 | 6 | 8 | 12): boolean
// rowWidth + width <= 12

export function assertValidLayout(rows: PageRow[]): void
// tiap width ∈ {4,6,8,12}; tiap baris sum <= 12; id unik
```

- [ ] **Step 1: Failing tests**

```ts
it('menolak slug news', () => {
  expect(slugIsReserved('news')).toBe(true)
  expect(slugIsReserved('academy')).toBe(false)
})

it('menolak baris yang overflow', () => {
  expect(canPlaceBlock([{ width: 8 }, { width: 4 }], 4)).toBe(false)
  expect(canPlaceBlock([{ width: 6 }], 6)).toBe(true)
})

it('hanya lebar 4/6/8/12', () => {
  expect(() =>
    assertValidLayout([{ id: 'r1', blocks: [{ id: 'b1', type: 'heading', width: 3 as 4, payload: {} }] }]),
  ).toThrow()
})
```

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement reserved + grid**

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit** `feat: validasi slug halaman dan kisi 12 kolom`

---

### Task 2: Prisma SitePage + seed 7 bawaan + daftar CMS

**Files:**
- Modify: `web/prisma/schema.prisma`

```prisma
model SitePage {
  id        String  @id @default(cuid())
  slug      String  @unique
  title     String
  kind      String  // builtin | custom
  menuKey   String? @unique // home, roster, ...
  status    String  @default("published") // draft | published
  showInNav Boolean @default(true)
  isEnabled Boolean @default(true)
  layout    String  @default("[]")
}
```

- Modify: `web/prisma/seed.ts` — 7 builtin sesuai NAV_ITEMS; custom tidak wajib
- Create: `web/app/cms/halaman/page.tsx` — tabel: judul, slug, jenis, status, toggle. Builtin mandatory (home/news/contact) toggle disabled. Tombol `Kanvas` hanya custom. Builtin `Ubah isi` link: home `/cms/settings` (stats) + note bukan builder; roster `/cms/players`; dst.
- Create: `web/app/cms/halaman/actions.ts` — `toggleBuiltinEnabled` memanggil logika sama seperti menu (`MenuItem.isEnabled`); sinkron `SitePage.isEnabled`. Tolak mandatory off.
- Modify: `admin-shell` link Halaman jika grant view.
- Test: seed helper `builtinPages()` count 7; tes `toggle` mandatory throw.

Sinkron menu: saat toggle halaman builtin, update `MenuItem`. `getMenuFlags` tetap dari MenuItem.

- [ ] **Step 1: Tes reserved tidak di seed; 7 builtin keys**

```ts
expect(BUILTIN_PAGES).toHaveLength(7)
expect(BUILTIN_PAGES.filter((p) => p.mandatory).map((p) => p.menuKey)).toEqual(['home','news','contact'])
```

- [ ] **Step 2: FAIL**

- [ ] **Step 3: schema migrate `site_pages`, seed, list UI, toggle action**

`npx.cmd prisma migrate dev --name site_pages`

- [ ] **Step 4: PASS + vitest suite**

- [ ] **Step 5: Commit** `feat: daftar CMS tujuh halaman bawaan tanpa kanvas`

---

### Task 3: CRUD halaman custom + route publik + nav

**Files:**
- Create: `web/app/cms/halaman/new/page.tsx` — judul, slug, status, showInNav
- Modify: `actions.ts` — `createPage`: `slugIsReserved` → error `Slug tidak tersedia.`; unique; kind custom; layout `[]`
- Create: `web/app/[slug]/page.tsx`

```ts
export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slugIsReserved(slug)) notFound() // rute konkrit /news tetap menang lebih dulu
  const page = await prisma.sitePage.findUnique({ where: { slug } })
  if (!page || page.kind !== 'custom' || page.status !== 'published' || !page.isEnabled) notFound()
  return <PageBlocks rows={JSON.parse(page.layout)} />
}
```

Next.js: `app/news/page.tsx` lebih spesifik daripada `app/[slug]`. Jangan buat `app/[...slug]`.

- Modify: `web/lib/nav.ts` — `getVisibleNavItems(flags, extra?: NavItem[])` atau `getPublicNav(flags)` async di header: extra dari `SitePage` custom published + showInNav + isEnabled. Tipe `NavKey` saat ini union ketat — **jangan rusak flags**. Extra items: `{ key: 'custom-${slug}', label: title, href: '/'+slug, mandatory: false }` dengan tipe baru:

```ts
export interface ExtraNavItem { label: string; href: string }
export function mergeNav(base: NavItem[], extra: ExtraNavItem[]): { label: string; href: string }[]
```

Header/mobile-menu: terima `extra` dari layout server (fetch pages). Tes `mergeNav`.

- Tes: `web/lib/pages/public-visibility.test.ts`

```ts
export function isPublicCustomPage(page: { kind; status; isEnabled }): boolean {
  return page.kind === 'custom' && page.status === 'published' && page.isEnabled
}
```

Toggle mati atau draft → false.

- [ ] **Step 1: Tes visibility + reserved create + mergeNav**

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement create, [slug] page, nav extra, PageBlocks kosong = halaman judul saja**

- [ ] **Step 4: PASS; tes layout/header yang mengharapkan 7 item — extra default []**

- [ ] **Step 5: Commit** `feat: halaman custom publik dengan nav dan 404`

---

### Task 4: Kanvas kisi + renderer blok

**Files:**
- Create: `web/components/admin/page-canvas.tsx` (client)
- Create: `web/components/public/page-blocks.tsx`
- Test: `web/components/public/page-blocks.test.tsx`
- Test: `web/components/admin/page-canvas.test.tsx` — drop palet menambah blok; pindah slot memanggil `canPlaceBlock`
- Modify: `web/app/cms/halaman/[id]/page.tsx` — jika builtin, **jangan** render canvas; tampilkan teks `Isi halaman ini diubah lewat form CMS, bukan kanvas.` + tautan. Jika custom, `PageCanvas` + ImageUpload di blok image.
- Modify: `saveLayout` action — `assertValidLayout`; `can(matrix,'halaman','update')`
- Renderer publik: CSS grid `grid-cols-12`; blok `col-span-4|6|8|12`; `max-md:col-span-12`. Token proyek `--breakpoint-md: 60rem` (960px) di `web/app/globals.css`. Jangan menambah breakpoint baru.

Palet kiri: lima jenis blok, `draggable="true"` `data-block-type`. Baris adalah drop target; `onDrop` menolak jika `!canPlaceBlock`. Geser antar slot: blok di kanvas juga `draggable`; drop ke slot lain atau ke “Baris baru”. Sediakan tombol `Pindah kiri` / `Pindah kanan` dengan hit 44px sebagai alternatif keyboard (bukan pengganti drag).

Image block: `ImageUpload` name per-block tidak di form klasik — canvas simpan layout JSON lewat satu `saveLayout` (hidden input atau fetch). Pola: canvas client `useState` rows; submit `<input type="hidden" name="layout" value={JSON.stringify(rows)} />`.

- [ ] **Step 1: Failing PageBlocks tests**

```tsx
it('merender heading dan tombol', () => {
  render(
    <PageBlocks
      rows={[
        {
          id: 'r1',
          blocks: [
            { id: 'h', type: 'heading', width: 12, payload: { text: 'Academy', level: 2 } },
            { id: 'b', type: 'button', width: 4, payload: { label: 'Daftar', href: '/contact' } },
          ],
        },
      ]}
    />,
  )
  expect(screen.getByRole('heading', { name: 'Academy' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Daftar' })).toHaveAttribute('href', '/contact')
})
```

Builtin page file tidak import `PageCanvas`.

```ts
it('tujuh bawaan tidak membuka kanvas', () => {
  const src = readFileSync('app/cms/halaman/[id]/page.tsx', 'utf8')
  // runtime: if kind==='builtin' return tanpa PageCanvas
})
```

Lebih baik tes fungsi `shouldEditOnCanvas(kind): boolean` = kind === 'custom'.

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Renderer + canvas + saveLayout + ImageUpload di payload.src**

- [ ] **Step 4: vitest PASS**

- [ ] **Step 5: Commit** `feat: kanvas kisi 12 kolom untuk halaman CMS baru`

---

### Task 5: Verifikasi browser + silang paket

- Buat `/academy` terbit + nav nyala → muncul di header → merender blok.
- Toggle mati → 404, nav hilang; data tetap di CMS.
- Slug `news` ditolak.
- Buka halaman News di daftar → bukan kanvas.
- Editor tanpa grant Halaman (paket 3) tidak buka `/cms/halaman`.
- Blok gambar unggah lewat `/api/media` (paket 1).

---

## Cakupan spec paket 4

| Requirement | Task |
| --- | --- |
| Daftar 7 bawaan, mandatory lock, Y/N | 2 |
| Edit bawaan bukan kanvas; Home kode | 2, 4 |
| Halaman baru slug/judul/draft/nav | 3 |
| Reserved slug ditolak | 1, 3 |
| Nav hanya terbit+enabled | 3 |
| Off/draft 404 | 3 |
| Kisi 12, lebar 4/6/8/12, stack di bawah md | 1, 4 |
| Blok heading teks gambar tombol list | 4 |
| Tes academy, 404, slug news, bukan kanvas bawaan | 3–5 |
