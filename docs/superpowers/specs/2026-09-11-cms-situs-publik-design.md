# Desain wiring CMS Situs ke halaman publik

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Pengaturan di `/cms/settings` sudah tersimpan. Paket ini hanya menghubungkan field yang belum terbaca di situs publik. Form CMS Situs tidak diubah.

## Keputusan

Satu helper `getPublicSiteSettings()` (mengganti `getSiteBranding`) membaca row `SiteSetting` `id=default` dan dipakai layout, header/footer, tab browser, dan halaman Contact.

Gelar / turnamen / WWCD tetap lewat `getSiteStats`. Logo header sudah terhubung; tetap lewat helper yang sama.

## Field dan fallback

String kosong atau row null memakai fallback berikut. Alamat dan telepon kosong **tetap kosong** (bukan “—”).

| Field CMS | Keluaran helper | Fallback jika kosong |
| --- | --- | --- |
| Nama situs | `siteName` | `Astrum Deus` |
| Logo | `logo` | `/logo-astrum-deus.png` |
| Favicon | `favicon` | `/logo-astrum-deus.png` |
| Judul meta | `metaTitle` | `siteName` (sudah di-fallback) |
| Deskripsi meta | `metaDescription` | `Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.` |
| Email kontak | `contactEmail` | `halo@astrumdeus.id` |
| Alamat | `contactAddress` | `""` |
| Telepon | `contactPhone` | `""` |

`getSiteContact` dihapus; halaman Contact memakai helper baru.

## Header dan footer publik

`SiteChrome` menerima `siteName` selain `logoSrc`. CMS, Internal, dan login tetap tanpa chrome ini.

Header: tautan ke `/` berisi logo 40px + nama situs (`font-display`, `text-label`, uppercase, skala sama label nav). Nama selalu ada di DOM sebagai nama tautan (aksesibilitas). Mulai `md`: nama terlihat di samping logo. Mobile: nama `sr-only` (tampilan logo saja; sudah ada hamburger). Logo dekoratif (`alt=""`) supaya nama tidak dobel dibaca. Footer logo sama: `alt=""` karena nama sudah di baris kredit.

Footer baris kredit: `{siteName}. Tim esports PUBG Mobile.`

## Tab browser

`generateMetadata` di `app/layout.tsx` tidak lagi hardcoded. `title` = `metaTitle`, `description` = `metaDescription`, `icons.icon` = `favicon`.

Hapus `web/app/favicon.ico` supaya tidak mengalahkan ikon dari pengaturan. Setelah ganti favicon, hard-refresh sekali mungkin perlu karena cache browser.

## Contact

Urutan: catatan yang sudah ada, lalu email (`mailto:`), alamat jika tidak kosong (teks biasa), telepon jika tidak kosong (`tel:`). Baris kosong disembunyikan. Form kontak tetap di bawah.

## Tes

- Helper: row null dan string kosong memakai tabel fallback; nilai CMS dipakai bila ada; judul meta kosong jatuh ke nama situs
- Header: tautan Home bernama nama situs; nama terlihat mulai `md`, `sr-only` di mobile; logo `alt=""`
- Footer: baris kredit memakai nama situs
- Contact: tanpa alamat/telepon tidak merender baris itu; dengan nilai, email/alamat/telepon tampil
- Metadata: `generateMetadata` memakai judul, deskripsi, dan favicon dari helper (bukan literal Astrum Deus)

## Di luar lingkup

Form CMS Situs, `socialLinks`, gelar/turnamen/WWCD, paket rangkuman CMS lain, cabang lebar penuh CMS/Internal.
