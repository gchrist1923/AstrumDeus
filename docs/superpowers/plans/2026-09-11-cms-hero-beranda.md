# Hero beranda CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eyebrow, judul, paragraf, gambar, dan alt hero beranda diisi dari CMS Situs, bukan hardcoded.

**Architecture:** Kolom baru di `SiteSetting`. `getPublicSiteSettings()` menambah field hero. `HomeSections` menerima props hero (default = copy lama). Form `/cms/settings` grup Beranda. Pecah judul di spasi pertama.

**Tech Stack:** Prisma SQLite, Next.js App Router, Vitest. Windows: `$env:Path` Node lalu `npx.cmd` dari `web/`. Kerja di `feat/cms-situs-publik`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-11-cms-hero-beranda-design.md`
- Deskripsi Meta tetap SEO, bukan paragraf hero
- Layout hero (clip, grayscale, CTA, StatTrio) tidak diubah
- Jangan commit kecuali Grace minta; jangan commit `dev.db`, `package-lock.json`, uploads

## Berkas

| Berkas | Tanggung jawab |
| --- | --- |
| `web/prisma/schema.prisma` + migrasi | Kolom hero |
| `web/lib/content/public-site.ts` | Field + `pecahJudulHero` |
| `web/components/public/home-sections.tsx` | Render dari props |
| `web/app/page.tsx` | Teruskan settings |
| `web/app/cms/settings/page.tsx` + `actions.ts` | Form + simpan |
| `web/lib/media/store.ts` | Hitung pakai `heroImage` |

Fallback: eyebrow `PUBG Mobile · Indonesia`; judul `Astrum Deus`; paragraf `Tim PUBG Mobile yang berlatih terjadwal dan membuka hasilnya, dari klasemen sampai catatan scrim.`; gambar `/hero.jpg`; alt = judul hero.

---

### Task 1: Skema + helper

- [ ] Tes `pecahJudulHero`: `"Astrum Deus"` → `{ pertama: "Astrum", kedua: "Deus" }`; `"Solo"` → `{ pertama: "Solo", kedua: null }`; `"AD Esports Team"` → `{ pertama: "AD", kedua: "Esports Team" }`
- [ ] Tes helper: fallback hero lengkap; CMS terisi; alt kosong → judul hero
- [ ] Kolom `heroEyebrow`, `heroTitle`, `heroTagline`, `heroImage`, `heroImageAlt` (default string sesuai fallback; alt default `""`)
- [ ] Migrasi SQL `ALTER TABLE "SiteSetting" ADD COLUMN ...`
- [ ] `npx.cmd prisma migrate deploy` (atau `migrate dev` bila perlu nama)
- [ ] Tes PASS

### Task 2: HomeSections + home

- [ ] Tes: props hero kustom merender eyebrow, dua baris judul, paragraf, `img` src+alt
- [ ] Default props = copy lama supaya `page.test.tsx` tetap lulus
- [ ] `page.tsx` memanggil `getPublicSiteSettings` dan mengoper hero
- [ ] Tes PASS

### Task 3: CMS Situs + simpan + media

- [ ] Tes sumber: `settings/page.tsx` berisi `heroTitle`, `heroTagline`, `heroImage`, `heroEyebrow`, `heroImageAlt`, heading Beranda
- [ ] `saveSettings` menulis field; `releaseMediaPath` untuk `heroImage`; `countMediaPathUses` OR `heroImage`
- [ ] Tes store: query siteSetting termasuk `heroImage`
- [ ] Tes PASS; `npx.cmd vitest run`; browser: ubah hero di `/cms/settings`, cek `/`
