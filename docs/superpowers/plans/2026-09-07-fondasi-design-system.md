# Fondasi dan Design System Astrum Deus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyiapkan aplikasi Next.js beserta design system Astrum Deus, sampai kerangka situs berupa header, navigasi ponsel dan footer berjalan dan teruji.

**Architecture:** Aplikasi Next.js App Router tinggal di subfolder `web/`, sementara `docs/`, `issue.md` dan `AGENTS.md` tetap di root repo. Token desain didefinisikan sekali di `web/app/globals.css` memakai `@theme` Tailwind v4, sehingga CSS itu jadi satu-satunya sumber nilai warna, huruf dan breakpoint. Nilai token diuji otomatis: ada test yang membaca `globals.css`, menghitung rasio kontras tiap pasangan warna, dan gagal bila ada yang di bawah ambang WCAG. Komponen dipisah antara primitif di `components/ui/` dan kerangka halaman di `components/layout/`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Vitest, React Testing Library, vitest-axe, next/font.

## Global Constraints

Nilai berikut dikutip apa adanya dari `docs/superpowers/specs/2026-09-07-ui-ux-astrum-deus-design.md` dan berlaku untuk semua task.

- Warna: `surface-base` `#171717`, `surface-raised` `#212121`, `surface-overlay` `#2A2A2A`, `border` `#383838`, `border-strong` `#7C7C7C`, `content-primary` `#FFFFFF`, `content-secondary` `#BCBCBC`, `content-muted` `#9B9B9B`, `accent` `#F0B429`, `accent-strong` `#C68A15`, `accent-soft` `#FFD166`, `danger` `#FF6369`, `danger-solid` `#C62828`
- Huruf display Chakra Petch bobot 600 dan 700, huruf teks Barlow bobot 400 sampai 700
- Radius sudut 0 di seluruh antarmuka
- Skala spasi 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 piksel
- Breakpoint 640px, 960px dan 1240px, container maksimum 1240px, gutter 32px di desktop dan 20px di ponsel
- Bahasa antarmuka Bahasa Indonesia, atribut `lang="id"`
- Area sentuh minimal 44x44px
- Warna tidak boleh jadi satu-satunya pembawa makna
- Setiap kontrol yang bisa dijangkau keyboard punya focus state yang terlihat
- Kontras teks minimal 4,5:1, kontras batas kontrol minimal 3:1
- Gerak menghormati `prefers-reduced-motion`
- `AGENTS.md` di root repo melarang commit dan push tanpa izin Grace. Langkah commit di tiap task hanya dijalankan setelah Grace memberi izin, dan tidak ada push sama sekali di plan ini.

---

## Pembagian plan

Spec mencakup dua subsistem yang bisa berdiri sendiri, jadi dipecah menjadi tiga plan. Plan ini yang pertama dan wajib selesai lebih dulu karena dua plan berikutnya memakai token serta komponennya.

1. **Plan ini**: fondasi, design system dan kerangka situs
2. **Plan berikutnya**: halaman publik dengan konten dummy, yaitu Home, Roster, Matches, News, Media Kit, Partners dan Contact
3. **Plan terakhir**: area internal, yaitu login, sidebar, Schedule Team, pencatatan kas dan laporan

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/app/globals.css` | Satu-satunya sumber token warna, huruf, breakpoint dan aturan reduced motion |
| `web/app/layout.tsx` | Root layout, `lang="id"`, memasang variabel font dan kerangka situs |
| `web/app/page.tsx` | Halaman sementara, diganti Home sungguhan di plan berikutnya |
| `web/app/fonts.ts` | Deklarasi next/font untuk Chakra Petch dan Barlow |
| `web/lib/theme.ts` | Membaca dan mem-parse token dari `globals.css` untuk dipakai test |
| `web/lib/contrast.ts` | Perhitungan luminansi relatif dan rasio kontras |
| `web/lib/nav.ts` | Daftar menu, status wajib atau opsional, dan penyaringan berdasarkan flag |
| `web/components/ui/button.tsx` | Tombol dengan tiga varian |
| `web/components/ui/states.tsx` | EmptyState, ErrorState dan Skeleton |
| `web/components/layout/site-header.tsx` | Header sticky dan navigasi desktop |
| `web/components/layout/mobile-menu.tsx` | Tombol Menu dan panel penuh layar di bawah 960px |
| `web/components/layout/site-footer.tsx` | Footer beserta navigasi sekunder |

Setiap berkas test diletakkan bersebelahan dengan kode yang diuji, memakai pola `<nama>.test.ts` atau `<nama>.test.tsx`.

---

### Task 1: Scaffold aplikasi dan harness test

**Files:**
- Create: `web/` beserta seluruh isi hasil scaffold
- Create: `web/vitest.config.ts`
- Create: `web/vitest.setup.ts`
- Modify: `web/package.json`
- Test: `web/app/harness.test.tsx`

**Interfaces:**
- Consumes: tidak ada, ini task pertama
- Produces: perintah `npm test` di dalam `web/` yang menjalankan Vitest dengan React Testing Library, matcher `toBeInTheDocument` dari jest-dom, matcher `toHaveNoViolations` dari vitest-axe, serta alias impor `@/` yang menunjuk ke root `web/`

Task ini butuh Node.js, dan mesin Grace belum memasangnya. Perintah pemasangan mengubah sistem, jadi minta izin Grace sebelum menjalankan langkah 1. Scaffold dan `next/font` juga butuh koneksi internet.

- [x] **Step 1: Pasang Node.js LTS**

Sudah dijalankan pada 7 September 2026. Jalur winget gagal dengan MSI error 1619 dan log instalasinya kosong, sehingga dipakai paket zip portabel yang tidak butuh hak administrator:

```powershell
$ver = "v24.19.0"
Invoke-WebRequest -Uri "https://nodejs.org/dist/$ver/node-$ver-win-x64.zip" -OutFile "$env:TEMP\node.zip" -UseBasicParsing
Expand-Archive -Path "$env:TEMP\node.zip" -DestinationPath "C:\Users\gchri\tools" -Force
$nodeDir = "C:\Users\gchri\tools\node-$ver-win-x64"
[Environment]::SetEnvironmentVariable('Path', "$([Environment]::GetEnvironmentVariable('Path','User'));$nodeDir", 'User')
```

- [x] **Step 2: Verifikasi Node dan npm terpasang**

```powershell
node -v
npm -v
```

Hasil: `v24.19.0` dan `11.17.0`. Terminal yang sudah terbuka sebelum pemasangan perlu dibuka ulang supaya PATH-nya termuat.

- [ ] **Step 3: Scaffold aplikasi ke subfolder `web/`**

Jalankan dari root repo `D:\Me\Work\AstrumDeus`:

```powershell
npx create-next-app@latest web --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --disable-git --yes
```

Harapan: selesai tanpa error, dan `web/app/page.tsx` ada.

Flag `--no-src-dir` dipakai supaya kode berada di `web/app/`, bukan `web/src/app/`. Flag `--disable-git` penting karena repo ini sudah punya git di root, dan tanpa flag itu ada risiko `web/.git` terbentuk sehingga `web/` masuk ke riwayat sebagai gitlink, bukan sebagai berkas biasa.

- [ ] **Step 4: Verifikasi build scaffold berhasil**

```powershell
cd web
npm run build
```

Harapan: build selesai dengan status sukses. Kalau gagal di tahap ini, masalahnya ada di scaffold, bukan di kode kita.

- [ ] **Step 5: Pasang dependensi test**

```powershell
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom vitest-axe
```

- [ ] **Step 6: Tulis test harness yang masih gagal**

Buat `web/app/harness.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'

describe('harness test', () => {
  it('merender komponen React dan mengenali matcher jest-dom', () => {
    render(<p>halo</p>)

    expect(screen.getByText('halo')).toBeInTheDocument()
  })

  it('mengenali matcher aksesibilitas dan bisa menemukan pelanggaran', async () => {
    const { container } = render(<img src="/contoh.png" />)

    const hasil = await axe(container)

    expect(hasil).not.toHaveNoViolations()
  })
})
```

Test kedua sengaja merender gambar tanpa `alt`. Kalau matcher axe terpasang benar, pelanggaran itu terdeteksi. Ini memastikan harness-nya benar-benar bekerja, bukan sekadar lolos karena tidak memeriksa apa pun.

- [ ] **Step 7: Jalankan test untuk memastikan gagal**

```powershell
npm test
```

Harapan: GAGAL, karena skrip `test` belum ada di `package.json`. npm akan melaporkan `Missing script: "test"`.

- [ ] **Step 8: Buat konfigurasi Vitest**

Buat `web/vitest.config.ts`:

```ts
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 9: Buat setup file Vitest**

Buat `web/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import { expect } from 'vitest'

expect.extend(axeMatchers)
```

- [ ] **Step 10: Tambahkan skrip test ke package.json**

Tambahkan dua entri ini ke dalam objek `scripts` di `web/package.json`, di samping skrip `dev`, `build`, `start` dan `lint` yang sudah ada:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 11: Jalankan test untuk memastikan lolos**

```powershell
npm test
```

Harapan: LOLOS, dua test di `app/harness.test.tsx` berhasil.

- [ ] **Step 12: Commit**

Jalankan dari root repo, setelah Grace memberi izin commit:

```powershell
cd ..
git add web
git commit -m "chore: scaffold aplikasi Next.js dan harness test"
```

---

### Task 2: Token desain dan test kontras

**Files:**
- Create: `web/lib/theme.ts`
- Create: `web/lib/contrast.ts`
- Create: `web/lib/contrast.test.ts`
- Create: `web/lib/theme.test.ts`
- Modify: `web/app/globals.css`

**Interfaces:**
- Consumes: harness test dari Task 1, alias `@/`
- Produces:
  - `parseThemeTokens(css: string): Record<string, string>` di `@/lib/theme`, mengembalikan token tanpa awalan `--`, misalnya kunci `color-accent` dan `text-body`
  - `parseThemeColors(css: string): Record<string, string>` di `@/lib/theme`, hanya token warna hex, dengan kunci tanpa awalan `color-`, misalnya `accent`
  - `readGlobalsCss(): string` di `@/lib/theme`, membaca `web/app/globals.css` dari disk
  - `relativeLuminance(hex: string): number` dan `contrastRatio(foreground: string, background: string): number` di `@/lib/contrast`
  - Token CSS di `web/app/globals.css`: seluruh `--color-*` dari Global Constraints, `--font-display`, `--font-text`, skala `--text-*`, dan breakpoint `--breakpoint-sm`, `--breakpoint-md`, `--breakpoint-lg`

- [ ] **Step 1: Tulis test perhitungan kontras yang masih gagal**

Buat `web/lib/contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { contrastRatio, relativeLuminance } from '@/lib/contrast'

describe('relativeLuminance', () => {
  it('mengembalikan 0 untuk hitam dan 1 untuk putih', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5)
  })

  it('menolak nilai yang bukan hex enam digit', () => {
    expect(() => relativeLuminance('#FFF')).toThrow(/hex enam digit/)
    expect(() => relativeLuminance('rgba(255,255,255,.7)')).toThrow(/hex enam digit/)
  })
})

describe('contrastRatio', () => {
  it('mengembalikan 21 untuk putih di atas hitam', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 2)
  })

  it('mengembalikan 1 untuk dua warna yang sama', () => {
    expect(contrastRatio('#212121', '#212121')).toBeCloseTo(1, 5)
  })

  it('tidak peduli urutan argumen', () => {
    expect(contrastRatio('#F0B429', '#212121')).toBeCloseTo(contrastRatio('#212121', '#F0B429'), 5)
  })

  it('menghitung aksen emas di atas surface-raised sebesar 8,6:1', () => {
    expect(contrastRatio('#F0B429', '#212121')).toBeCloseTo(8.6, 1)
  })
})
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- lib/contrast.test.ts
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/lib/contrast`.

- [ ] **Step 3: Tulis perhitungan kontras**

Buat `web/lib/contrast.ts`:

```ts
interface Rgb {
  r: number
  g: number
  b: number
}

function hexToRgb(hex: string): Rgb {
  const bersih = hex.trim().replace(/^#/, '')

  if (!/^[0-9a-fA-F]{6}$/.test(bersih)) {
    throw new Error(`Warna harus hex enam digit, dapat: ${hex}`)
  }

  return {
    r: Number.parseInt(bersih.slice(0, 2), 16),
    g: Number.parseInt(bersih.slice(2, 4), 16),
    b: Number.parseInt(bersih.slice(4, 6), 16),
  }
}

function luminansiKanal(nilai: number): number {
  const c = nilai / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)

  return 0.2126 * luminansiKanal(r) + 0.7152 * luminansiKanal(g) + 0.0722 * luminansiKanal(b)
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const terang = Math.max(a, b)
  const gelap = Math.min(a, b)

  return (terang + 0.05) / (gelap + 0.05)
}
```

- [ ] **Step 4: Jalankan test untuk memastikan lolos**

```powershell
npm test -- lib/contrast.test.ts
```

Harapan: LOLOS, enam test.

- [ ] **Step 5: Tulis test token yang masih gagal**

Buat `web/lib/theme.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/contrast'
import { parseThemeColors, parseThemeTokens, readGlobalsCss } from '@/lib/theme'

const css = readGlobalsCss()
const warna = parseThemeColors(css)
const token = parseThemeTokens(css)

const WARNA_WAJIB = [
  'surface-base',
  'surface-raised',
  'surface-overlay',
  'border',
  'border-strong',
  'content-primary',
  'content-secondary',
  'content-muted',
  'accent',
  'accent-strong',
  'accent-soft',
  'danger',
  'danger-solid',
]

const PASANGAN_TEKS: Array<[string, string]> = [
  ['content-primary', 'surface-base'],
  ['content-primary', 'surface-raised'],
  ['content-primary', 'surface-overlay'],
  ['content-secondary', 'surface-base'],
  ['content-secondary', 'surface-raised'],
  ['content-muted', 'surface-base'],
  ['content-muted', 'surface-raised'],
  ['accent', 'surface-base'],
  ['accent', 'surface-raised'],
  ['accent-soft', 'surface-raised'],
  ['accent-strong', 'surface-raised'],
  ['danger', 'surface-base'],
  ['danger', 'surface-raised'],
  ['surface-raised', 'accent'],
  ['content-primary', 'danger-solid'],
]

const PASANGAN_KONTROL: Array<[string, string]> = [
  ['border-strong', 'surface-base'],
  ['border-strong', 'surface-raised'],
  ['border-strong', 'surface-overlay'],
]

describe('parseThemeTokens', () => {
  it('melewati baris reset seperti --color-*: initial', () => {
    const hasil = parseThemeTokens('@theme {\n  --color-*: initial;\n  --color-accent: #F0B429;\n}')

    expect(hasil).toEqual({ 'color-accent': '#F0B429' })
  })

  it('melempar error bila blok @theme tidak ada', () => {
    expect(() => parseThemeTokens(':root { --color-accent: #F0B429; }')).toThrow(/@theme/)
  })
})

describe('token warna di globals.css', () => {
  it('memuat seluruh warna yang dipakai desain', () => {
    expect(Object.keys(warna).sort()).toEqual([...WARNA_WAJIB].sort())
  })

  it('menulis setiap warna sebagai hex enam digit, bukan rgba', () => {
    for (const [nama, nilai] of Object.entries(warna)) {
      expect(nilai, `token ${nama}`).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it.each(PASANGAN_TEKS)('kontras teks %s di atas %s minimal 4,5:1', (depan, belakang) => {
    expect(contrastRatio(warna[depan], warna[belakang])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(PASANGAN_KONTROL)('kontras batas kontrol %s di atas %s minimal 3:1', (depan, belakang) => {
    expect(contrastRatio(warna[depan], warna[belakang])).toBeGreaterThanOrEqual(3)
  })
})

describe('token huruf, skala dan breakpoint', () => {
  it('mendaftarkan dua keluarga huruf', () => {
    expect(token['font-display']).toContain('Chakra Petch')
    expect(token['font-text']).toContain('Barlow')
  })

  it('mendaftarkan seluruh tingkat skala tipografi', () => {
    for (const tingkat of ['display', 'page', 'section', 'card', 'body', 'article', 'small', 'label']) {
      expect(token[`text-${tingkat}`], `tingkat ${tingkat}`).toBeDefined()
    }
  })

  it('memakai breakpoint 640, 960 dan 1240 piksel', () => {
    expect(token['breakpoint-sm']).toBe('40rem')
    expect(token['breakpoint-md']).toBe('60rem')
    expect(token['breakpoint-lg']).toBe('77.5rem')
  })

  it('mendaftarkan container halaman selebar 1240 piksel', () => {
    expect(token['container-page']).toBe('77.5rem')
  })

  it('memberi bobot huruf pada tingkat display supaya memakai berat yang benar-benar diunduh', () => {
    expect(token['text-display--font-weight']).toBe('700')
    expect(token['text-label--font-weight']).toBe('700')
  })
})

describe('aturan gerak', () => {
  it('menonaktifkan animasi saat prefers-reduced-motion aktif', () => {
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
```

- [ ] **Step 6: Jalankan test untuk memastikan gagal**

```powershell
npm test -- lib/theme.test.ts
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/lib/theme`.

- [ ] **Step 7: Tulis pembaca token**

Buat `web/lib/theme.ts`:

```ts
import { readFileSync } from 'node:fs'
import path from 'node:path'

export function parseThemeTokens(css: string): Record<string, string> {
  const blok = css.match(/@theme\s*\{([\s\S]*?)\n\}/)

  if (!blok) {
    throw new Error('Blok @theme tidak ditemukan di CSS yang diberikan')
  }

  const token: Record<string, string> = {}

  for (const baris of blok[1].split('\n')) {
    const cocok = baris.match(/^\s*--([a-z0-9-]+):\s*([^;]+);/)

    if (cocok) {
      token[cocok[1]] = cocok[2].trim()
    }
  }

  return token
}

export function parseThemeColors(css: string): Record<string, string> {
  const warna: Record<string, string> = {}

  for (const [kunci, nilai] of Object.entries(parseThemeTokens(css))) {
    if (kunci.startsWith('color-') && /^#[0-9A-Fa-f]{6}$/.test(nilai)) {
      warna[kunci.slice('color-'.length)] = nilai
    }
  }

  return warna
}

export function readGlobalsCss(): string {
  return readFileSync(path.join(process.cwd(), 'app', 'globals.css'), 'utf8')
}
```

Regex `[a-z0-9-]+` tidak cocok dengan karakter bintang, sehingga baris reset seperti `--color-*: initial;` otomatis terlewat.

- [ ] **Step 8: Tulis token ke globals.css**

Ganti seluruh isi `web/app/globals.css` dengan:

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --radius-*: initial;
  --breakpoint-*: initial;

  --color-surface-base: #171717;
  --color-surface-raised: #212121;
  --color-surface-overlay: #2A2A2A;
  --color-border: #383838;
  --color-border-strong: #7C7C7C;
  --color-content-primary: #FFFFFF;
  --color-content-secondary: #BCBCBC;
  --color-content-muted: #9B9B9B;
  --color-accent: #F0B429;
  --color-accent-strong: #C68A15;
  --color-accent-soft: #FFD166;
  --color-danger: #FF6369;
  --color-danger-solid: #C62828;

  --font-display: var(--font-chakra-petch), "Chakra Petch", system-ui, sans-serif;
  --font-text: var(--font-barlow), "Barlow", system-ui, sans-serif;

  --text-display: clamp(3.375rem, 9.5vw, 8.25rem);
  --text-display--line-height: 0.9;
  --text-display--font-weight: 700;
  --text-page: clamp(2.5rem, 6vw, 4.5rem);
  --text-page--line-height: 1;
  --text-page--font-weight: 700;
  --text-section: clamp(1.875rem, 4.2vw, 3.25rem);
  --text-section--line-height: 1;
  --text-section--font-weight: 700;
  --text-card: 1.5rem;
  --text-card--line-height: 1.25;
  --text-card--font-weight: 700;
  --text-body: 1.0625rem;
  --text-body--line-height: 1.55;
  --text-article: 1.1875rem;
  --text-article--line-height: 1.7;
  --text-small: 0.875rem;
  --text-small--line-height: 1.45;
  --text-label: 0.75rem;
  --text-label--line-height: 1.2;
  --text-label--letter-spacing: 0.16em;
  --text-label--font-weight: 700;

  --radius-none: 0;

  --container-page: 77.5rem;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 60rem;
  --breakpoint-lg: 77.5rem;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Tiga baris reset di awal menghapus palet, radius dan breakpoint bawaan Tailwind, sehingga tidak ada utility warna di luar token Astrum Deus, tidak ada sudut membulat yang bisa dipakai tanpa sengaja, dan hanya tiga breakpoint dari spec yang tersedia. Skala spasi bawaan Tailwind sudah berbasis 4px, jadi `p-1` sampai `p-32` persis cocok dengan skala di Global Constraints dan tidak perlu ditimpa.

`--container-page` dipakai untuk lebar maksimum halaman, dan menghasilkan utility `max-w-page`. Ini perlu ditulis sendiri karena di Tailwind v4 utility `max-w-*` mengambil nilai dari skala container, bukan dari breakpoint, sehingga `max-w-lg` justru berarti 32rem dan bukan 1240px.

Setiap tingkat display diberi `--text-*--font-weight: 700` karena Chakra Petch hanya diunduh pada bobot 600 dan 700. Tanpa itu, judul akan memakai bobot 400 yang tidak tersedia dan browser memalsukan ketebalannya.

- [ ] **Step 9: Jalankan seluruh test untuk memastikan lolos**

```powershell
npm test
```

Harapan: LOLOS, termasuk 17 pemeriksaan kontras. Bila salah satu gagal, perbaiki nilai warnanya di `globals.css`, jangan turunkan ambang di test.

- [ ] **Step 10: Commit**

```powershell
cd ..
git add web/app/globals.css web/lib
git commit -m "feat: tambah token desain dan test kontras otomatis"
cd web
```

---

### Task 3: Tipografi dan root layout

**Files:**
- Create: `web/app/fonts.ts`
- Create: `web/app/layout.test.tsx`
- Modify: `web/app/layout.tsx`
- Modify: `web/app/page.tsx`

**Interfaces:**
- Consumes: token `--font-display` dan `--font-text` dari Task 2
- Produces:
  - `chakraPetch` dan `barlow` dari `@/app/fonts`, keduanya objek next/font dengan properti `variable` berisi `--font-chakra-petch` dan `--font-barlow`
  - `fontVariables: string` dari `@/app/fonts`, gabungan kedua class variabel font untuk dipasang di elemen `html`
  - Root layout dengan `lang="id"`, latar `surface-base` dan huruf `font-text`

- [ ] **Step 1: Tulis test layout yang masih gagal**

Buat `web/app/layout.test.tsx`:

```tsx
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { fontVariables } from '@/app/fonts'

const layout = readFileSync(path.join(process.cwd(), 'app', 'layout.tsx'), 'utf8')

describe('fontVariables', () => {
  it('menggabungkan variabel kedua keluarga huruf', () => {
    expect(fontVariables).toContain('--font-chakra-petch')
    expect(fontVariables).toContain('--font-barlow')
  })
})

describe('root layout', () => {
  it('menyetel bahasa halaman ke Bahasa Indonesia', () => {
    expect(layout).toContain('lang="id"')
  })

  it('memasang variabel font di elemen html', () => {
    expect(layout).toContain('fontVariables')
  })

  it('memakai token latar dan teks, bukan warna mentah', () => {
    expect(layout).toContain('bg-surface-base')
    expect(layout).toContain('text-content-primary')
    expect(layout).not.toMatch(/#[0-9A-Fa-f]{6}/)
  })
})
```

Layout diuji sebagai teks berkas, bukan lewat render, karena elemen `html` dan `body` tidak bisa dirender bersih di jsdom.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- app/layout.test.tsx
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/app/fonts`.

- [ ] **Step 3: Deklarasikan huruf**

Buat `web/app/fonts.ts`:

```ts
import { Barlow, Chakra_Petch } from 'next/font/google'

export const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-chakra-petch',
  display: 'swap',
})

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const fontVariables = `${chakraPetch.variable} ${barlow.variable}`
```

- [ ] **Step 4: Tulis root layout**

Ganti seluruh isi `web/app/layout.tsx` dengan:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Astrum Deus',
  description: 'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Tulis halaman sementara**

Ganti seluruh isi `web/app/page.tsx` dengan:

```tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-page px-5 py-24 md:px-8">
      <h1 className="font-display text-page uppercase">Astrum Deus</h1>
      <p className="mt-6 text-content-secondary">
        Halaman ini masih sementara. Home yang sebenarnya dibangun di plan berikutnya.
      </p>
    </main>
  )
}
```

`max-w-page` berasal dari token `--container-page` di Task 2, dan nilainya 1240px sesuai spec.

- [ ] **Step 6: Jalankan test untuk memastikan lolos**

```powershell
npm test -- app/layout.test.tsx
```

Harapan: LOLOS, empat test.

- [ ] **Step 7: Verifikasi huruf benar-benar terunduh saat build**

```powershell
npm run build
```

Harapan: build sukses. Kegagalan di sini biasanya berarti nama font di next/font salah tulis atau koneksi internet terputus.

- [ ] **Step 8: Commit**

```powershell
cd ..
git add web/app
git commit -m "feat: pasang tipografi Chakra Petch dan Barlow di root layout"
cd web
```

---

### Task 4: Komponen tombol

**Files:**
- Create: `web/components/ui/button.tsx`
- Test: `web/components/ui/button.test.tsx`

**Interfaces:**
- Consumes: token warna dan `--text-label` dari Task 2, huruf `font-display` dari Task 3
- Produces: `Button` dari `@/components/ui/button` dengan prop `variant` bernilai `'primary' | 'secondary' | 'destructive'` beserta seluruh atribut `<button>` bawaan, dan tipe `ButtonProps` yang diekspor

- [ ] **Step 1: Tulis test tombol yang masih gagal**

Buat `web/components/ui/button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('merender label sebagai nama yang terbaca', () => {
    render(<Button>Lihat roster</Button>)

    expect(screen.getByRole('button', { name: 'Lihat roster' })).toBeInTheDocument()
  })

  it('memakai varian primary secara default', () => {
    render(<Button>Kirim</Button>)

    expect(screen.getByRole('button')).toHaveClass('bg-accent')
  })

  it('memakai latar danger-solid pada varian destruktif', () => {
    render(<Button variant="destructive">Hapus</Button>)

    expect(screen.getByRole('button')).toHaveClass('bg-danger-solid')
  })

  it('memakai bingkai border-strong pada varian sekunder', () => {
    render(<Button variant="secondary">Jadwal</Button>)

    expect(screen.getByRole('button')).toHaveClass('border-border-strong')
  })

  it('menjaga area sentuh minimal 44 piksel', () => {
    render(<Button>Menu</Button>)

    const tombol = screen.getByRole('button')

    expect(tombol).toHaveClass('min-h-11')
    expect(tombol).toHaveClass('min-w-11')
  })

  it('menampilkan focus state yang terlihat', () => {
    render(<Button>Kirim</Button>)

    expect(screen.getByRole('button').className).toContain('focus-visible:outline-2')
  })

  it('memakai type button secara default supaya tidak submit form tanpa sengaja', () => {
    render(<Button>Kirim</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('meneruskan klik ke handler', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Kirim</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('tidak meneruskan klik saat dinonaktifkan', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Kirim
      </Button>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<Button>Lihat roster</Button>)

    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- components/ui/button.test.tsx
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/components/ui/button`.

- [ ] **Step 3: Tulis komponen tombol**

Buat `web/components/ui/button.tsx`:

```tsx
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

const KELAS_DASAR = [
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2',
  'px-6 py-3 font-display text-label uppercase tracking-[0.12em]',
  'transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')

const KELAS_VARIAN: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-surface-raised hover:bg-accent-strong',
  secondary: 'border-2 border-border-strong text-content-primary hover:border-content-primary',
  destructive: 'bg-danger-solid text-content-primary hover:bg-danger',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${KELAS_DASAR} ${KELAS_VARIAN[variant]} ${className}`.trim()}
      {...props}
    />
  )
})
```

Varian destruktif memakai `bg-danger` saat hover, bukan `brightness`, supaya warnanya tetap berasal dari token dan bisa diuji.

- [ ] **Step 4: Jalankan test untuk memastikan lolos**

```powershell
npm test -- components/ui/button.test.tsx
```

Harapan: LOLOS, sepuluh test.

- [ ] **Step 5: Commit**

```powershell
cd ..
git add web/components/ui
git commit -m "feat: tambah komponen tombol tiga varian"
cd web
```

---

### Task 5: Model navigasi dan penyaringan toggle

**Files:**
- Create: `web/lib/nav.ts`
- Test: `web/lib/nav.test.ts`

**Interfaces:**
- Consumes: tidak ada dari task lain
- Produces:
  - Tipe `NavKey`, bernilai `'home' | 'roster' | 'matches' | 'news' | 'media-kit' | 'partners' | 'contact'`
  - Antarmuka `NavItem` dengan field `key: NavKey`, `label: string`, `href: string`, `mandatory: boolean`
  - Tipe `MenuFlags`, yaitu `Partial<Record<NavKey, boolean>>`
  - Konstanta `NAV_ITEMS: readonly NavItem[]`
  - `getVisibleNavItems(flags?: MenuFlags): NavItem[]`
  - `isMenuEnabled(key: NavKey, flags?: MenuFlags): boolean`

- [ ] **Step 1: Tulis test navigasi yang masih gagal**

Buat `web/lib/nav.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getVisibleNavItems, isMenuEnabled, NAV_ITEMS } from '@/lib/nav'

describe('NAV_ITEMS', () => {
  it('memuat tujuh menu sesuai spec', () => {
    expect(NAV_ITEMS).toHaveLength(7)
  })

  it('menandai hanya Home, News dan Contact sebagai wajib', () => {
    const wajib = NAV_ITEMS.filter((item) => item.mandatory).map((item) => item.key)

    expect(wajib).toEqual(['home', 'news', 'contact'])
  })

  it('menyusun menu dalam urutan tampil dari spec', () => {
    expect(NAV_ITEMS.map((item) => item.key)).toEqual([
      'home',
      'roster',
      'matches',
      'news',
      'media-kit',
      'partners',
      'contact',
    ])
  })

  it('memberi label Bahasa Indonesia atau nama halaman, tanpa string kosong', () => {
    for (const item of NAV_ITEMS) {
      expect(item.label.trim().length).toBeGreaterThan(0)
      expect(item.href.startsWith('/')).toBe(true)
    }
  })
})

describe('getVisibleNavItems', () => {
  it('hanya menampilkan menu wajib saat tidak ada flag', () => {
    expect(getVisibleNavItems().map((item) => item.key)).toEqual(['home', 'news', 'contact'])
  })

  it('menampilkan menu opsional yang flag-nya menyala', () => {
    const terlihat = getVisibleNavItems({ roster: true, matches: true }).map((item) => item.key)

    expect(terlihat).toEqual(['home', 'roster', 'matches', 'news', 'contact'])
  })

  it('menyembunyikan menu opsional yang flag-nya mati', () => {
    expect(getVisibleNavItems({ partners: false }).map((item) => item.key)).not.toContain('partners')
  })

  it('mengabaikan usaha mematikan menu wajib', () => {
    expect(getVisibleNavItems({ home: false, news: false }).map((item) => item.key)).toEqual([
      'home',
      'news',
      'contact',
    ])
  })

  it('mempertahankan urutan spec meski flag diberikan tidak berurutan', () => {
    const terlihat = getVisibleNavItems({ partners: true, roster: true }).map((item) => item.key)

    expect(terlihat).toEqual(['home', 'roster', 'news', 'partners', 'contact'])
  })
})

describe('isMenuEnabled', () => {
  it('selalu true untuk menu wajib', () => {
    expect(isMenuEnabled('home')).toBe(true)
    expect(isMenuEnabled('contact', { contact: false })).toBe(true)
  })

  it('mengikuti flag untuk menu opsional', () => {
    expect(isMenuEnabled('roster')).toBe(false)
    expect(isMenuEnabled('roster', { roster: true })).toBe(true)
  })
})
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- lib/nav.test.ts
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/lib/nav`.

- [ ] **Step 3: Tulis model navigasi**

Buat `web/lib/nav.ts`:

```ts
export type NavKey = 'home' | 'roster' | 'matches' | 'news' | 'media-kit' | 'partners' | 'contact'

export interface NavItem {
  key: NavKey
  label: string
  href: string
  mandatory: boolean
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', label: 'Home', href: '/', mandatory: true },
  { key: 'roster', label: 'Roster', href: '/roster', mandatory: false },
  { key: 'matches', label: 'Matches', href: '/matches', mandatory: false },
  { key: 'news', label: 'News', href: '/news', mandatory: true },
  { key: 'media-kit', label: 'Media Kit', href: '/media-kit', mandatory: false },
  { key: 'partners', label: 'Partners', href: '/partners', mandatory: false },
  { key: 'contact', label: 'Contact', href: '/contact', mandatory: true },
]

export type MenuFlags = Partial<Record<NavKey, boolean>>

export function getVisibleNavItems(flags: MenuFlags = {}): NavItem[] {
  return NAV_ITEMS.filter((item) => item.mandatory || flags[item.key] === true)
}

export function isMenuEnabled(key: NavKey, flags: MenuFlags = {}): boolean {
  const item = NAV_ITEMS.find((kandidat) => kandidat.key === key)

  if (!item) {
    return false
  }

  return item.mandatory || flags[key] === true
}
```

Menu opsional sengaja mati kalau flag-nya tidak disebut. Sikap gagal-tertutup ini mencegah halaman yang belum ada isinya bocor ke publik saat pemasangan baru.

- [ ] **Step 4: Jalankan test untuk memastikan lolos**

```powershell
npm test -- lib/nav.test.ts
```

Harapan: LOLOS, sebelas test.

- [ ] **Step 5: Commit**

```powershell
cd ..
git add web/lib/nav.ts web/lib/nav.test.ts
git commit -m "feat: tambah model navigasi dengan penyaringan toggle"
cd web
```

---

### Task 6: Header dan footer

**Files:**
- Create: `web/components/layout/site-header.tsx`
- Create: `web/components/layout/site-footer.tsx`
- Create: `web/public/logo-astrum-deus.png`
- Modify: `web/app/layout.tsx`
- Test: `web/components/layout/site-header.test.tsx`
- Test: `web/components/layout/site-footer.test.tsx`

**Interfaces:**
- Consumes: `getVisibleNavItems`, `MenuFlags` dan `NavItem` dari Task 5, token dari Task 2, `MobileMenu` dari Task 7
- Produces:
  - `SiteHeader` dari `@/components/layout/site-header`, komponen klien dengan prop opsional `flags?: MenuFlags`, membaca rute aktif lewat `usePathname`
  - `SiteFooter` dari `@/components/layout/site-footer`, komponen server dengan prop opsional `flags?: MenuFlags`

Task ini dan Task 7 saling bergantung, karena header memuat `MobileMenu`. Kerjakan Task 7 lebih dulu bila ingin setiap task lolos test sendiri tanpa stub.

- [ ] **Step 1: Salin logo ke folder publik**

Jalankan dari root repo:

```powershell
Copy-Item docs/superpowers/specs/mockups/assets/logo-light.png web/public/logo-astrum-deus.png
```

- [ ] **Step 2: Tulis test header yang masih gagal**

Buat `web/components/layout/site-header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { SiteHeader } from '@/components/layout/site-header'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

beforeEach(() => {
  usePathname.mockReturnValue('/')
})

describe('SiteHeader', () => {
  it('memberi nama pada navigasi utama', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('navigation', { name: 'Navigasi utama' })).toBeInTheDocument()
  })

  it('hanya menampilkan menu wajib saat tidak ada flag', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Roster' })).not.toBeInTheDocument()
  })

  it('menampilkan menu opsional yang flag-nya menyala', () => {
    render(<SiteHeader flags={{ roster: true, matches: true }} />)

    expect(screen.getByRole('link', { name: 'Roster' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Matches' })).toBeInTheDocument()
  })

  it('menandai halaman aktif dengan aria-current, bukan hanya warna', () => {
    usePathname.mockReturnValue('/news')
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current')
  })

  it('menyediakan tautan ke Home lewat logo dengan teks alternatif', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Astrum Deus' })).toHaveAttribute('href', '/')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<SiteHeader flags={{ roster: true }} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 3: Jalankan test untuk memastikan gagal**

```powershell
npm test -- components/layout/site-header.test.tsx
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/components/layout/site-header`.

- [ ] **Step 4: Tulis header**

Buat `web/components/layout/site-header.tsx`:

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { getVisibleNavItems, type MenuFlags } from '@/lib/nav'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function SiteHeader({ flags }: { flags?: MenuFlags }) {
  const pathname = usePathname()
  const items = getVisibleNavItems(flags)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-base/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-page items-center gap-8 px-5 md:px-8">
        <Link href="/" className={`flex items-center ${KELAS_FOKUS}`}>
          <Image src="/logo-astrum-deus.png" alt="Astrum Deus" width={40} height={40} priority />
        </Link>

        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <ul className="flex gap-7">
            {items.map((item) => {
              const aktif = item.href === pathname

              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={aktif ? 'page' : undefined}
                    className={`border-b-2 pb-1 font-display text-label uppercase ${KELAS_FOKUS} ${
                      aktif
                        ? 'border-accent text-content-primary'
                        : 'border-transparent text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto md:hidden">
          <MobileMenu items={items} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
```

Navigasi desktop muncul mulai breakpoint `md`, yang di Task 2 sudah disetel 960px sesuai spec.

- [ ] **Step 5: Jalankan test header untuk memastikan lolos**

```powershell
npm test -- components/layout/site-header.test.tsx
```

Harapan: LOLOS, enam test.

- [ ] **Step 6: Tulis test footer yang masih gagal**

Buat `web/components/layout/site-footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { SiteFooter } from '@/components/layout/site-footer'

describe('SiteFooter', () => {
  it('memberi nama pada navigasi footer supaya beda dari navigasi utama', () => {
    render(<SiteFooter />)

    expect(screen.getByRole('navigation', { name: 'Navigasi footer' })).toBeInTheDocument()
  })

  it('hanya menampilkan menu yang aktif', () => {
    render(<SiteFooter flags={{ partners: true }} />)

    expect(screen.getByRole('link', { name: 'Partners' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Media Kit' })).not.toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<SiteFooter flags={{ roster: true }} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 7: Jalankan test untuk memastikan gagal**

```powershell
npm test -- components/layout/site-footer.test.tsx
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/components/layout/site-footer`.

- [ ] **Step 8: Tulis footer**

Buat `web/components/layout/site-footer.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { getVisibleNavItems, type MenuFlags } from '@/lib/nav'

export function SiteFooter({ flags }: { flags?: MenuFlags }) {
  const items = getVisibleNavItems(flags)

  return (
    <footer className="mt-24 border-t border-border bg-surface-raised">
      <div className="mx-auto max-w-page px-5 py-16 md:px-8">
        <div className="flex flex-wrap items-start gap-12">
          <Image src="/logo-astrum-deus.png" alt="Astrum Deus" width={52} height={52} />

          <nav aria-label="Navigasi footer" className="ml-auto">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="font-display text-label uppercase text-content-secondary hover:text-content-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-14 border-t border-border pt-6 text-small text-content-muted">
          Astrum Deus. Tim esports PUBG Mobile.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 9: Pasang header dan footer di root layout**

Ganti isi elemen `body` di `web/app/layout.tsx` sehingga berkas itu menjadi:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { fontVariables } from './fonts'
import './globals.css'

const MENU_AKTIF = { roster: true, matches: true } as const

export const metadata: Metadata = {
  title: 'Astrum Deus',
  description: 'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        <SiteHeader flags={MENU_AKTIF} />
        {children}
        <SiteFooter flags={MENU_AKTIF} />
      </body>
    </html>
  )
}
```

`MENU_AKTIF` masih ditulis di kode karena sumber flag-nya baru ada setelah CMS dipilih. Di plan berikutnya nilai ini pindah ke satu tempat yang bisa dibaca CMS.

- [ ] **Step 10: Jalankan seluruh test dan build**

```powershell
npm test
npm run build
```

Harapan: seluruh test LOLOS dan build sukses.

- [ ] **Step 11: Verifikasi tampilan di browser**

```powershell
npm run dev
```

Buka `http://localhost:3000`, lalu periksa empat hal: header menempel saat digulir, tujuh menu tampil di lebar desktop, menu berubah jadi tombol Menu di bawah 960px, dan tombol Tab memunculkan garis fokus emas di setiap tautan.

- [ ] **Step 12: Commit**

```powershell
cd ..
git add web/components/layout web/public/logo-astrum-deus.png web/app/layout.tsx
git commit -m "feat: tambah header sticky dan footer dengan navigasi terfilter"
cd web
```

---

### Task 7: Menu ponsel

**Files:**
- Create: `web/components/layout/mobile-menu.tsx`
- Test: `web/components/layout/mobile-menu.test.tsx`

**Interfaces:**
- Consumes: tipe `NavItem` dari Task 5
- Produces: `MobileMenu` dari `@/components/layout/mobile-menu`, komponen klien dengan prop `items: NavItem[]` dan `pathname: string`

- [ ] **Step 1: Tulis test menu ponsel yang masih gagal**

Buat `web/components/layout/mobile-menu.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { NAV_ITEMS } from '@/lib/nav'

const items = [...NAV_ITEMS]

describe('MobileMenu', () => {
  it('memakai tombol berlabel teks, bukan ikon tanpa nama', () => {
    render(<MobileMenu items={items} pathname="/" />)

    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  it('menyembunyikan panel sebelum tombol ditekan', () => {
    render(<MobileMenu items={items} pathname="/" />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('membuka panel berisi seluruh menu saat tombol ditekan', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('dialog', { name: 'Menu utama' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Roster' })).toBeInTheDocument()
  })

  it('mengumumkan status buka lewat aria-expanded', async () => {
    render(<MobileMenu items={items} pathname="/" />)
    const tombol = screen.getByRole('button', { name: 'Menu' })

    expect(tombol).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(tombol)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('menutup panel dengan tombol Escape', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mengembalikan fokus ke tombol pemicu setelah ditutup', async () => {
    render(<MobileMenu items={items} pathname="/" />)
    const tombol = screen.getByRole('button', { name: 'Menu' })

    await userEvent.click(tombol)
    await userEvent.keyboard('{Escape}')

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
  })

  it('memindahkan fokus ke dalam panel saat dibuka', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true)
  })

  it('menandai halaman aktif dengan aria-current', async () => {
    render(<MobileMenu items={items} pathname="/roster" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('link', { name: 'Roster' })).toHaveAttribute('aria-current', 'page')
  })

  it('menutup panel lewat tombol Tutup', async () => {
    render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tutup menu' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('tidak punya pelanggaran aksesibilitas saat panel terbuka', async () => {
    const { container } = render(<MobileMenu items={items} pathname="/" />)

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(await axe(container)).toHaveNoViolations()
  })
})
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- components/layout/mobile-menu.test.tsx
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/components/layout/mobile-menu`.

- [ ] **Step 3: Tulis menu ponsel**

Buat `web/components/layout/mobile-menu.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { NavItem } from '@/lib/nav'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function MobileMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const [terbuka, setTerbuka] = useState(false)
  const tombolRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pernahTerbuka = useRef(false)

  useEffect(() => {
    if (!terbuka) {
      return
    }

    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('a[href], button')?.focus()

    function saatTekanTombol(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setTerbuka(false)
        return
      }

      if (event.key !== 'Tab' || !panel) {
        return
      }

      const bisaFokus = panel.querySelectorAll<HTMLElement>('a[href], button')

      if (bisaFokus.length === 0) {
        return
      }

      const pertama = bisaFokus[0]
      const terakhir = bisaFokus[bisaFokus.length - 1]

      if (event.shiftKey && document.activeElement === pertama) {
        event.preventDefault()
        terakhir.focus()
      } else if (!event.shiftKey && document.activeElement === terakhir) {
        event.preventDefault()
        pertama.focus()
      }
    }

    document.addEventListener('keydown', saatTekanTombol)

    return () => document.removeEventListener('keydown', saatTekanTombol)
  }, [terbuka])

  useEffect(() => {
    if (pernahTerbuka.current && !terbuka) {
      tombolRef.current?.focus()
    }

    pernahTerbuka.current = terbuka
  }, [terbuka])

  return (
    <>
      <button
        ref={tombolRef}
        type="button"
        onClick={() => setTerbuka(true)}
        aria-expanded={terbuka}
        aria-controls="menu-utama"
        className={`inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-border-strong px-4 font-display text-label uppercase ${KELAS_FOKUS}`}
      >
        Menu
      </button>

      {terbuka ? (
        <div
          id="menu-utama"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu utama"
          className="fixed inset-0 z-50 flex flex-col gap-10 bg-surface-base px-5 py-6"
        >
          <button
            type="button"
            onClick={() => setTerbuka(false)}
            className={`ml-auto inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-border-strong px-4 font-display text-label uppercase ${KELAS_FOKUS}`}
          >
            Tutup
            <span className="sr-only"> menu</span>
          </button>

          <nav aria-label="Navigasi utama">
            <ul className="flex flex-col gap-6">
              {items.map((item) => {
                const aktif = item.href === pathname

                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={aktif ? 'page' : undefined}
                      onClick={() => setTerbuka(false)}
                      className={`font-display text-section uppercase ${KELAS_FOKUS} ${
                        aktif ? 'text-accent' : 'text-content-primary'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  )
}
```

Nama tombol tutup terbaca "Tutup menu" oleh screen reader karena kata "menu" disembunyikan secara visual, sementara di layar cukup tertulis "Tutup".

- [ ] **Step 4: Jalankan test untuk memastikan lolos**

```powershell
npm test -- components/layout/mobile-menu.test.tsx
```

Harapan: LOLOS, sepuluh test.

- [ ] **Step 5: Commit**

```powershell
cd ..
git add web/components/layout/mobile-menu.tsx web/components/layout/mobile-menu.test.tsx
git commit -m "feat: tambah menu ponsel dengan focus trap dan tutup lewat Escape"
cd web
```

---

### Task 8: Komponen keadaan kosong, gagal dan memuat

**Files:**
- Create: `web/components/ui/states.tsx`
- Test: `web/components/ui/states.test.tsx`

**Interfaces:**
- Consumes: `Button` dari Task 4, token dari Task 2
- Produces, semuanya dari `@/components/ui/states`:
  - `EmptyState` dengan prop `title: string`, `description: string`, `action?: { label: string; href: string }`
  - `ErrorState` dengan prop `title: string`, `description: string`, `onRetry: () => void`
  - `Skeleton` dengan prop `className?: string`, `label?: string`

- [ ] **Step 1: Tulis test komponen keadaan yang masih gagal**

Buat `web/components/ui/states.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/states'

describe('EmptyState', () => {
  it('menjelaskan apa yang akan tampil di tempat itu', () => {
    render(
      <EmptyState
        title="Belum ada pertandingan"
        description="Jadwal akan tampil di sini setelah Editor menambahkannya dari CMS."
      />,
    )

    expect(screen.getByRole('heading', { name: 'Belum ada pertandingan' })).toBeInTheDocument()
    expect(screen.getByText(/setelah Editor menambahkannya/)).toBeInTheDocument()
  })

  it('menampilkan tautan aksi bila diberikan', () => {
    render(
      <EmptyState
        title="Belum ada berita"
        description="Artikel yang terbit akan tampil di sini."
        action={{ label: 'Lihat arsip', href: '/news' }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Lihat arsip' })).toHaveAttribute('href', '/news')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(<EmptyState title="Kosong" description="Belum ada isinya." />)

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ErrorState', () => {
  it('menyebutkan apa yang gagal dan menyediakan tombol coba lagi', async () => {
    const onRetry = vi.fn()
    render(
      <ErrorState
        title="Gagal memuat hasil pertandingan"
        description="Koneksi ke server terputus."
        onRetry={onRetry}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('mengumumkan pesan gagal ke screen reader', () => {
    render(<ErrorState title="Gagal memuat" description="Coba beberapa saat lagi." onRetry={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Gagal memuat')
  })

  it('tidak punya pelanggaran aksesibilitas', async () => {
    const { container } = render(
      <ErrorState title="Gagal memuat" description="Coba lagi nanti." onRetry={vi.fn()} />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Skeleton', () => {
  it('tidak diumumkan ke screen reader bila tanpa label', () => {
    const { container } = render(<Skeleton className="h-24" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('mengumumkan status memuat bila diberi label', () => {
    render(<Skeleton className="h-24" label="Memuat hasil pertandingan" />)

    expect(screen.getByRole('status', { name: 'Memuat hasil pertandingan' })).toBeInTheDocument()
  })

  it('meneruskan kelas ukuran supaya bentuknya bisa menyerupai isi sebenarnya', () => {
    const { container } = render(<Skeleton className="h-24 w-full" />)

    expect(container.firstElementChild).toHaveClass('h-24')
    expect(container.firstElementChild).toHaveClass('w-full')
  })
})
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

```powershell
npm test -- components/ui/states.test.tsx
```

Harapan: GAGAL dengan pesan tidak bisa me-resolve modul `@/components/ui/states`.

- [ ] **Step 3: Tulis komponen keadaan**

Buat `web/components/ui/states.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="border border-border bg-surface-raised px-6 py-12 text-center">
      <h3 className="font-display text-card uppercase">{title}</h3>
      <p className="mx-auto mt-3 max-w-prose text-content-secondary">{description}</p>

      {action ? (
        <Link
          href={action.href}
          className={`mt-6 inline-flex min-h-11 items-center border-2 border-border-strong px-6 font-display text-label uppercase ${KELAS_FOKUS}`}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string
  description: string
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="border-l-4 border-danger bg-surface-raised px-6 py-8"
    >
      <h3 className="font-display text-card uppercase text-danger">{title}</h3>
      <p className="mt-3 max-w-prose text-content-secondary">{description}</p>

      <Button variant="secondary" onClick={onRetry} className="mt-6">
        Coba lagi
      </Button>
    </div>
  )
}

export function Skeleton({ className = '', label }: { className?: string; label?: string }) {
  const kelas = `animate-pulse bg-surface-overlay ${className}`.trim()

  if (label) {
    return <div role="status" aria-label={label} className={kelas} />
  }

  return <div aria-hidden="true" className={kelas} />
}
```

`animate-pulse` sudah otomatis berhenti saat pengguna meminta gerak dikurangi, karena aturan `prefers-reduced-motion` di `globals.css` dari Task 2 berlaku global.

- [ ] **Step 4: Jalankan test untuk memastikan lolos**

```powershell
npm test -- components/ui/states.test.tsx
```

Harapan: LOLOS, sembilan test.

- [ ] **Step 5: Jalankan seluruh test dan build sebagai pemeriksaan akhir**

```powershell
npm test
npm run build
```

Harapan: seluruh test LOLOS dan build sukses.

- [ ] **Step 6: Commit**

```powershell
cd ..
git add web/components/ui/states.tsx web/components/ui/states.test.tsx
git commit -m "feat: tambah komponen keadaan kosong, gagal dan memuat"
```

---

## Catatan hasil self-review

Enam hal yang muncul saat memeriksa plan ini terhadap spec, dan sudah ditangani di atas:

1. Task 6 dan Task 7 saling bergantung karena header memuat menu ponsel. Urutan pengerjaan yang disarankan sudah dicatat di Task 6.
2. Spec menyebut breakpoint 960px, sementara Tailwind tidak punya nilai itu secara bawaan. Task 2 menimpa palet breakpoint sehingga `md` berarti 960px, dan seluruh task setelahnya memakai `md` untuk peralihan navigasi.
3. Nilai flag menu masih ditulis di kode pada Task 6, karena sumber datanya baru ada setelah CMS dipilih, dan pemilihan CMS berada di luar scope spec ini.
4. Container 1240px semula ditulis `max-w-lg`, yang salah. Di Tailwind v4 utility `max-w-*` mengambil nilai dari skala container dan bukan dari breakpoint, sehingga `max-w-lg` berarti 32rem alias 512px. Diganti token `--container-page` beserta utility `max-w-page`, dan ditambah pemeriksaan di test token.
5. Judul semula tidak menyebut bobot huruf, padahal Chakra Petch hanya diunduh pada bobot 600 dan 700. Tanpa bobot eksplisit, browser memalsukan ketebalan dari bobot 400 yang tidak tersedia. Bobot dipasang lewat `--text-*--font-weight` supaya ikut menempel di setiap utility ukuran.
6. Perintah scaffold semula bisa membuat `web/.git` di dalam repo yang sudah punya git, sehingga `web/` berisiko masuk riwayat sebagai gitlink. Flag `--disable-git` ditambahkan.
7. Daftar pasangan kontras semula melewatkan `border-strong` di atas `surface-overlay`, padahal `surface-overlay` adalah latar input. Pasangan itu ternyata hanya 2,7:1 pada nilai `#6B6B6B`, jadi test-nya lolos sementara bingkai input yang sebenarnya gagal memenuhi syarat 3:1. Ini ditemukan review Task 2, bukan saat plan ditulis. Pasangan tersebut kini diuji dan `border-strong` dinaikkan ke `#7C7C7C`.

Yang belum tercakup plan ini dan memang milik plan berikutnya: seluruh halaman publik, komponen `MatchRow`, `PlayerCard`, `ArticleCard`, `AssetCard`, `PartnerPlate`, `ContactForm`, `Hero`, `LiveBar`, `StatTrio`, serta seluruh area internal.
