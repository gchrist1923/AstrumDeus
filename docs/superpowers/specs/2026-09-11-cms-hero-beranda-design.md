# Desain hero beranda dari CMS Situs

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Lanjutan wiring Situs: teks dan foto hero halaman depan tidak lagi hardcoded. Deskripsi Meta tetap SEO, bukan paragraf hero.

## Keputusan

Field hero tinggal di `SiteSetting` dan form `/cms/settings`, grup **Beranda**, di bawah branding (nama/logo/favicon/meta) dan sebelum kontak. Tombol Lihat roster / Jadwal pertandingan dan StatTrio tidak diubah.

## Field

| Label CMS | Kolom | Fallback jika kosong |
| --- | --- | --- |
| Eyebrow | `heroEyebrow` | `PUBG Mobile · Indonesia` |
| Judul hero | `heroTitle` | `Astrum Deus` |
| Paragraf hero | `heroTagline` | `Tim PUBG Mobile yang berlatih terjadwal dan membuka hasilnya, dari klasemen sampai catatan scrim.` |
| Gambar hero | `heroImage` | `/hero.jpg` |
| Alt foto | `heroImageAlt` | `heroTitle` (sudah di-fallback) |

`getPublicSiteSettings()` mengembalikan field ini. Unggah gambar memakai `ImageUpload` yang sama dengan logo. Ganti gambar melepaskan file lama lewat `releaseMediaPath`.

## Tampilan publik

Layout hero (tinggi, clip, grayscale, overlay, CTA, angka) tidak diubah.

Judul: pecah di **spasi pertama** jadi dua baris `h1` uppercase; tanpa spasi = satu baris. Eyebrow, paragraf, `src`/`alt` gambar dari helper.

## Tes

- Helper: row null / string kosong memakai fallback; nilai CMS dipakai bila ada; alt kosong jatuh ke judul hero
- `HomeSections` merender eyebrow, judul pecah, paragraf, `src` dan `alt` dari props (bukan literal `/hero.jpg` atau paragraf lama bila props diisi)
- Form CMS Situs berisi kelima field
- Migrasi menambah kolom tanpa merusak row `default` yang sudah ada

## Di luar lingkup

Deskripsi Meta sebagai teks hero, kanvas Halaman, section Hasil/Roster/Berita/Partner di bawah hero, ubah posisi crop per unggahan, CTA hero dari CMS.
