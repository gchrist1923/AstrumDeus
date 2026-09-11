# CMS Situs publik Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Field CMS Situs yang sudah tersimpan (nama, favicon, judul/deskripsi meta, alamat, telepon) tampil di header, footer, tab browser, dan halaman Contact.

**Architecture:** Satu helper `getPublicSiteSettings()` menggantikan `getSiteBranding` dan `getSiteContact`. Layout, chrome, dan Contact hanya membaca helper itu. Form `/cms/settings` tidak diubah.

**Tech Stack:** Next.js App Router 16, Prisma `SiteSetting`, Vitest + Testing Library. Windows: `$env:Path = "C:\Program Files\nodejs;" + $env:Path` lalu perintah dari `web/` memakai `npx.cmd`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-11-cms-situs-publik-design.md`
- Bahasa UI Indonesia; token, radius 0, hit 44px mengikuti spec UI 2026-09-07
- Jangan ubah form CMS Situs, `socialLinks`, gelar/turnamen/WWCD, atau cabang `feat/cms-internal-lebar-penuh`
- Kerja di cabang baru dari `origin/master`, misalnya `feat/cms-situs-publik` — jangan di `master`, jangan campur diff lebar penuh
- Jangan commit `dev.db`, `.superpowers/`, `web/uploads/*`, `web/package-lock.json`
- Jangan commit kecuali Grace meminta (langkah commit di bawah dilewati jika belum diminta)

## Berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/lib/content/public-site.ts` | `getPublicSiteSettings()` + tipe + fallback |
| `web/lib/content/public-site.test.ts` | Tes helper |
| `web/lib/content/branding.ts` | Hapus (diganti public-site) |
| `web/lib/content/branding.test.ts` | Hapus |
| `web/app/layout.tsx` | Metadata + teruskan `siteName` / logo / favicon |
| `web/app/favicon.ico` | Hapus |
| `web/components/layout/site-chrome.tsx` | Props `siteName` ke header/footer |
| `web/components/layout/site-header.tsx` | Nama situs + logo dekoratif |
| `web/components/layout/site-footer.tsx` | Baris kredit + logo dekoratif |
| `web/components/public/contact-details.tsx` | Email / alamat / telepon |
| `web/app/contact/page.tsx` | Pakai helper + `ContactDetails` |
| `web/lib/content/cms.ts` | Hapus `getSiteContact` |

Tipe yang semua task belakangan harus pakai:

```ts
export type PublicSiteSettings = {
  siteName: string
  logo: string
  favicon: string
  metaTitle: string
  metaDescription: string
  contactEmail: string
  contactAddress: string
  contactPhone: string
}
```

Fallback: nama `Astrum Deus`; logo/favicon `/logo-astrum-deus.png`; judul meta = `siteName` yang sudah di-fallback; deskripsi meta `Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.`; email `halo@astrumdeus.id`; alamat/telepon `""`.

---

### Task 1: Helper `getPublicSiteSettings`

**Files:**
- Create: `web/lib/content/public-site.ts`
- Create: `web/lib/content/public-site.test.ts`

**Interfaces:**
- Consumes: `prisma.siteSetting.findUnique({ where: { id: 'default' } })`
- Produces: `getPublicSiteSettings(): Promise<PublicSiteSettings>`

`branding.ts` tetap sampai Task 4 supaya `layout.tsx` belum pecah.

- [ ] **Step 1: Cabang dari origin/master**

```bash
git fetch origin
git checkout -b feat/cms-situs-publik origin/master
```

Lalu `SetActiveBranch` ke `feat/cms-situs-publik`. Spec dan plan di `docs/superpowers/` mungkin hanya ada di cabang lain — salin dua file itu ke cabang ini jika belum ada.

- [ ] **Step 2: Tes FAIL**

`web/lib/content/public-site.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    siteSetting: { findUnique: vi.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { getPublicSiteSettings } from '@/lib/content/public-site'

const LOGO = '/logo-astrum-deus.png'
const META_DESC =
  'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.'

describe('getPublicSiteSettings', () => {
  beforeEach(() => {
    vi.mocked(prisma.siteSetting.findUnique).mockReset()
  })

  it('memakai fallback lengkap bila row null', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue(null)

    await expect(getPublicSiteSettings()).resolves.toEqual({
      siteName: 'Astrum Deus',
      logo: LOGO,
      favicon: LOGO,
      metaTitle: 'Astrum Deus',
      metaDescription: META_DESC,
      contactEmail: 'halo@astrumdeus.id',
      contactAddress: '',
      contactPhone: '',
    })
  })

  it('memakai nilai CMS bila terisi', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      siteName: 'AD Esports',
      logo: '/media/logo.png',
      favicon: '/media/icon.png',
      defaultMetaTitle: 'AD | PUBGM',
      defaultMetaDesc: 'Deskripsi CMS',
      contactEmail: 'halo@ad.id',
      contactAddress: 'Jakarta',
      contactPhone: '0812 000',
    } as never)

    await expect(getPublicSiteSettings()).resolves.toEqual({
      siteName: 'AD Esports',
      logo: '/media/logo.png',
      favicon: '/media/icon.png',
      metaTitle: 'AD | PUBGM',
      metaDescription: 'Deskripsi CMS',
      contactEmail: 'halo@ad.id',
      contactAddress: 'Jakarta',
      contactPhone: '0812 000',
    })
  })

  it('judul meta kosong jatuh ke nama situs; alamat/telepon kosong tetap kosong', async () => {
    vi.mocked(prisma.siteSetting.findUnique).mockResolvedValue({
      siteName: 'Nama Baru',
      logo: '',
      favicon: '  ',
      defaultMetaTitle: '',
      defaultMetaDesc: '   ',
      contactEmail: '',
      contactAddress: '   ',
      contactPhone: '',
    } as never)

    await expect(getPublicSiteSettings()).resolves.toEqual({
      siteName: 'Nama Baru',
      logo: LOGO,
      favicon: LOGO,
      metaTitle: 'Nama Baru',
      metaDescription: META_DESC,
      contactEmail: 'halo@astrumdeus.id',
      contactAddress: '',
      contactPhone: '',
    })
  })
})
```

- [ ] **Step 3: Jalankan tes, pastikan FAIL**

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npx.cmd vitest run lib/content/public-site.test.ts
```

Expected: FAIL (modul belum ada).

- [ ] **Step 4: Implementasi**

`web/lib/content/public-site.ts`:

```ts
import { prisma } from '@/lib/db'

const LOGO = '/logo-astrum-deus.png'
const META_DESC =
  'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.'

export type PublicSiteSettings = {
  siteName: string
  logo: string
  favicon: string
  metaTitle: string
  metaDescription: string
  contactEmail: string
  contactAddress: string
  contactPhone: string
}

function terisi(nilai: string | undefined): string {
  return nilai?.trim() ?? ''
}

function atau(nilai: string | undefined, fallback: string): string {
  return terisi(nilai) || fallback
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 'default' } })
  const siteName = atau(row?.siteName, 'Astrum Deus')

  return {
    siteName,
    logo: atau(row?.logo, LOGO),
    favicon: atau(row?.favicon, LOGO),
    metaTitle: atau(row?.defaultMetaTitle, siteName),
    metaDescription: atau(row?.defaultMetaDesc, META_DESC),
    contactEmail: atau(row?.contactEmail, 'halo@astrumdeus.id'),
    contactAddress: terisi(row?.contactAddress),
    contactPhone: terisi(row?.contactPhone),
  }
}
```

- [ ] **Step 5: Tes PASS**

```powershell
npx.cmd vitest run lib/content/public-site.test.ts
```

Expected: PASS.

`branding.ts` belum dihapus.

- [ ] **Step 6: Commit** (hanya jika Grace minta)

```bash
git add web/lib/content/public-site.ts web/lib/content/public-site.test.ts
git commit -m "feat: baca semua field situs publik dari satu helper"
```

---

### Task 2: Nama situs di header + chrome


**Files:**
- Modify: `web/components/layout/site-chrome.tsx`
- Modify: `web/components/layout/site-header.tsx`
- Modify: `web/components/layout/site-header.test.tsx`
- Modify: `web/components/layout/site-chrome.test.tsx`

**Interfaces:**
- Consumes: `siteName: string` (default `'Astrum Deus'`)
- Produces: tautan Home bernama `siteName`; nama `max-md:sr-only`; logo `alt=""`

- [ ] **Step 1: Tes FAIL**

Tambah di `site-header.test.tsx` (tes tautan Home yang lama tetap: default nama `Astrum Deus`):

```ts
  it('logo dekoratif; nama situs jadi nama tautan Home', () => {
    render(<SiteHeader siteName="AD Esports" />)

    expect(screen.getByRole('link', { name: 'AD Esports' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('img')).toHaveAttribute('alt', '')
    expect(screen.getByText('AD Esports')).toHaveClass('max-md:sr-only')
    expect(screen.getByText('AD Esports')).toHaveClass('font-display')
  })
```

Tambah di `site-chrome.test.tsx` (jangan cek layout dulu — itu Task 4):

```ts
    expect(chrome).toMatch(/siteName/)
    expect(header).toMatch(/siteName/)
```

- [ ] **Step 2: Jalankan tes, pastikan FAIL**

```powershell
npx.cmd vitest run components/layout/site-header.test.tsx components/layout/site-chrome.test.tsx
```

Expected: FAIL (prop belum ada / alt masih `Astrum Deus`).

- [ ] **Step 3: Implementasi**

`SiteChrome` — tambah `siteName = 'Astrum Deus'` ke props, teruskan ke header saja (footer di Task 3):

```tsx
<SiteHeader flags={flags} extra={extra} logoSrc={logoSrc} siteName={siteName} />
```

`SiteHeader` — tautan Home:

```tsx
<Link href="/" className={`flex items-center gap-3 ${KELAS_FOKUS}`}>
  <Image
    src={logoSrc}
    alt=""
    width={40}
    height={40}
    priority
    unoptimized={logoSrc.startsWith('/media/')}
  />
  <span className="max-md:sr-only font-display text-label uppercase text-content-primary">
    {siteName}
  </span>
</Link>
```

Default `siteName = 'Astrum Deus'` supaya tes lama tanpa prop tetap lulus.

- [ ] **Step 4: Tes PASS**

```powershell
npx.cmd vitest run components/layout/site-header.test.tsx components/layout/site-chrome.test.tsx
```

Expected: PASS. Tes tautan `{ name: 'Astrum Deus' }` yang lama tetap lulus lewat teks nama.

- [ ] **Step 5: Commit** (hanya jika Grace minta)

```bash
git add web/components/layout/site-chrome.tsx web/components/layout/site-header.tsx web/components/layout/site-header.test.tsx web/components/layout/site-chrome.test.tsx
git commit -m "feat: tampilkan nama situs di header publik"
```

---

### Task 3: Baris kredit footer

**Files:**
- Modify: `web/components/layout/site-footer.tsx`
- Modify: `web/components/layout/site-footer.test.tsx`
- Modify: `web/components/layout/site-chrome.tsx`

**Interfaces:**
- Consumes: `siteName: string` (default `'Astrum Deus'`)
- Produces: `{siteName}. Tim esports PUBG Mobile.`; logo `alt=""`; chrome meneruskan `siteName` ke footer

- [ ] **Step 1: Tes FAIL**

```ts
  it('baris kredit memakai nama situs; logo dekoratif', () => {
    render(<SiteFooter siteName="AD Esports" />)

    expect(screen.getByText('AD Esports. Tim esports PUBG Mobile.')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', '')
  })
```

- [ ] **Step 2:**

```powershell
npx.cmd vitest run components/layout/site-footer.test.tsx
```

Expected: FAIL.

- [ ] **Step 3:** Props `siteName = 'Astrum Deus'`. Image `alt=""`. Paragraf:

```tsx
<p className="mt-14 border-t border-border pt-6 text-small text-content-muted">
  {siteName}. Tim esports PUBG Mobile.
</p>
```

`SiteChrome` teruskan `siteName` ke footer:

```tsx
<SiteFooter flags={flags} extra={extra} logoSrc={logoSrc} siteName={siteName} />
```

- [ ] **Step 4:** tes PASS

- [ ] **Step 5: Commit** (hanya jika Grace minta)

```bash
git add web/components/layout/site-footer.tsx web/components/layout/site-footer.test.tsx web/components/layout/site-chrome.tsx
git commit -m "feat: baris footer memakai nama situs dari CMS"
```

---

### Task 4: Metadata tab + hapus favicon.ico

**Files:**
- Modify: `web/app/layout.tsx`
- Create: `web/app/layout-metadata.test.ts`
- Delete: `web/app/favicon.ico`
- Delete: `web/lib/content/branding.ts`
- Delete: `web/lib/content/branding.test.ts`

**Interfaces:**
- Consumes: `getPublicSiteSettings()`
- Produces: `generateMetadata` memakai `metaTitle`, `metaDescription`, `favicon`; `RootLayout` memakai `logo` + `siteName`

- [ ] **Step 1: Tes FAIL**

`web/app/layout-metadata.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

describe('metadata situs', () => {
  it('generateMetadata memakai helper, bukan literal judul/deskripsi', () => {
    const sumber = readFileSync(path.join(root, 'app', 'layout.tsx'), 'utf8')

    expect(sumber).toMatch(/getPublicSiteSettings/)
    expect(sumber).not.toMatch(/getSiteBranding/)
    expect(sumber).toMatch(/title:\s*situs\.metaTitle/)
    expect(sumber).toMatch(/description:\s*situs\.metaDescription/)
    expect(sumber).toMatch(/icon:\s*situs\.favicon/)
    expect(sumber).toMatch(/siteName=\{situs\.siteName\}/)
    expect(sumber).toMatch(/logoSrc=\{situs\.logo\}/)
    expect(sumber).not.toMatch(/title: 'Astrum Deus'/)
  })

  it('tidak menyisakan favicon.ico statis yang mengalahkan CMS', () => {
    expect(existsSync(path.join(root, 'app', 'favicon.ico'))).toBe(false)
  })
})
```

- [ ] **Step 2: Jalankan tes, pastikan FAIL**

```powershell
npx.cmd vitest run app/layout-metadata.test.ts
```

Expected: FAIL (`getSiteBranding` masih ada; `favicon.ico` masih ada).

- [ ] **Step 3: Implementasi**

`web/app/layout.tsx` — ganti import branding:

```ts
import { getPublicSiteSettings } from '@/lib/content/public-site'
```

```ts
export async function generateMetadata(): Promise<Metadata> {
  const situs = await getPublicSiteSettings()
  return {
    title: situs.metaTitle,
    description: situs.metaDescription,
    icons: { icon: situs.favicon },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const flags = await getMenuFlags()
  const situs = await getPublicSiteSettings()
  const extra = await getExtraNav()

  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        <SiteChrome flags={flags} extra={extra} logoSrc={situs.logo} siteName={situs.siteName}>
          {children}
        </SiteChrome>
      </body>
    </html>
  )
}
```

Hapus `web/app/favicon.ico`, `web/lib/content/branding.ts`, dan `web/lib/content/branding.test.ts`.

- [ ] **Step 4: Tes PASS**

```powershell
npx.cmd vitest run app/layout-metadata.test.ts lib/content/public-site.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit** (hanya jika Grace minta)

```bash
git add web/app/layout.tsx web/app/layout-metadata.test.ts
git rm web/app/favicon.ico web/lib/content/branding.ts web/lib/content/branding.test.ts
git commit -m "fix: judul, deskripsi, dan favicon tab mengikuti CMS Situs"
```

---

### Task 5: Contact — email, alamat, telepon

**Files:**
- Create: `web/components/public/contact-details.tsx`
- Create: `web/components/public/contact-details.test.tsx`
- Modify: `web/app/contact/page.tsx`
- Modify: `web/lib/content/cms.ts` (hapus `getSiteContact`)

**Interfaces:**
- Consumes: `PublicSiteSettings` (`contactEmail`, `contactAddress`, `contactPhone`)
- Produces: `ContactDetails`; catatan hardcoded di page tetap sama

- [ ] **Step 1: Tes FAIL**

`web/components/public/contact-details.test.tsx`:

```ts
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContactDetails } from '@/components/public/contact-details'

describe('ContactDetails', () => {
  it('menyembunyikan alamat dan telepon jika kosong', () => {
    render(<ContactDetails email="halo@ad.id" address="" phone="" />)

    expect(screen.getByRole('link', { name: 'halo@ad.id' })).toHaveAttribute(
      'href',
      'mailto:halo@ad.id',
    )
    expect(screen.queryByText('Jakarta')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /0812/ })).not.toBeInTheDocument()
  })

  it('menampilkan alamat teks dan telepon tel: jika terisi', () => {
    render(
      <ContactDetails email="halo@ad.id" address="Jakarta" phone="0812 000" />,
    )

    expect(screen.getByText('Jakarta')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '0812 000' })).toHaveAttribute(
      'href',
      'tel:0812000',
    )
  })
})
```

Catatan: `tel:` membuang spasi di href, teks tautan tetap nilai CMS.

- [ ] **Step 2:**

```powershell
npx.cmd vitest run components/public/contact-details.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implementasi**

`web/components/public/contact-details.tsx` — salin kelas fokus yang dipakai `contact/page.tsx`:

```tsx
const KELAS_FOKUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function ContactDetails({
  email,
  address,
  phone,
}: {
  email: string
  address: string
  phone: string
}) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <p>
        <a href={`mailto:${email}`} className={`text-accent underline underline-offset-4 ${KELAS_FOKUS}`}>
          {email}
        </a>
      </p>
      {address ? <p className="text-content-secondary">{address}</p> : null}
      {phone ? (
        <p>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className={`text-accent underline underline-offset-4 ${KELAS_FOKUS}`}
          >
            {phone}
          </a>
        </p>
      ) : null}
    </div>
  )
}
```

`web/app/contact/page.tsx`:

```tsx
import { ContactForm } from '@/components/public/contact-form'
import { ContactDetails } from '@/components/public/contact-details'
import { getPublicSiteSettings } from '@/lib/content/public-site'
import { requirePage } from '@/lib/content/require-page'

export default async function ContactPage() {
  requirePage('contact')
  const situs = await getPublicSiteSettings()

  return (
    <main>
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-page uppercase text-balance">Contact</h1>
        <p className="mt-6 max-w-[40rem] text-content-secondary text-pretty">
          Pilih tujuan di form supaya pesan sponsor tidak tercampur dengan tryout.
        </p>
        <ContactDetails
          email={situs.contactEmail}
          address={situs.contactAddress}
          phone={situs.contactPhone}
        />
        <div className="mt-12 max-w-[40rem]">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
```

Hapus `getSiteContact` dari `web/lib/content/cms.ts`. Biarkan salinan di `dummy.ts` (tidak dipakai Contact).

- [ ] **Step 4:** tes PASS + pastikan tidak ada import `getSiteContact` dari cms tersisa

```powershell
npx.cmd vitest run components/public/contact-details.test.tsx
```

Grep: `getSiteContact` hanya boleh tersisa di `dummy.ts`.

- [ ] **Step 5: Commit** (hanya jika Grace minta)

```bash
git add web/components/public/contact-details.tsx web/components/public/contact-details.test.tsx web/app/contact/page.tsx web/lib/content/cms.ts
git commit -m "feat: tampilkan alamat dan telepon CMS di halaman Contact"
```

---

### Task 6: Verifikasi

- [ ] **Step 1: Suite penuh**

```powershell
npx.cmd vitest run
```

Expected: semua tes lulus. Perbaiki regresi (header/footer axe, chrome extra nav) jika ada.

- [ ] **Step 2: Browser** (dev server yang sudah jalan; jangan buka `next dev` kedua di :3000)

1. Buka `/cms/settings`, ganti Nama situs, Judul meta, Deskripsi meta, Favicon, Alamat, Telepon, Simpan.
2. Buka `/` — header `md` menampilkan nama baru; tab browser judul meta; favicon (hard-refresh).
3. Scroll footer — baris `{Nama}. Tim esports PUBG Mobile.`
4. `/contact` — email, alamat, telepon; kosongkan telepon di CMS, Simpan, reload Contact — baris telepon hilang.
5. `/cms` dan `/internal` — tidak ada header publik.

- [ ] **Step 3:** Jangan klaim selesai tanpa keluaran tes dan cek browser di atas.
