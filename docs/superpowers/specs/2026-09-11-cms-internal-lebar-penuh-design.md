# Desain lebar penuh CMS dan Internal

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

## Keputusan

`AdminShell` (semua `/cms/*` dan `/internal/*`) memakai lebar viewport, bukan kolom `max-w-page` di tengah. Sidebar nav nempel kiri. Header full: judul kiri, nama + Keluar kanan. Konten mengisi sisa layar.

Situs publik dan `/login` tidak diubah. Token `--container-page` / `max-w-page` tetap untuk publik.

## Shell

Buang `mx-auto max-w-page` dari baris header dan baris nav+konten. Padding tepi tetap `px-5` / `md:px-8` (kontrol tidak nempel tepi viewport). Nav `md:w-52 md:shrink-0`. Kolom utama `min-w-0 flex-1`. Mobile: nav di atas, konten di bawah (sudah ada).

## Isi halaman

Tabel, kanvas (palet | tampilan | inspector), kalender jadwal: selebar kolom utama. Panel kanan di dalam halaman (inspector, form event) nempel kanan area kerja.

Form pendek yang sudah `max-w-xl` atau `max-w-2xl` tetap sempit, ditambah `mx-auto` supaya di tengah kolom. Form pengguna baru (belum punya max-w) juga `max-w-xl mx-auto` supaya field tidak meregang selebar layar. Teks intro `max-w-2xl` di samping judul tabel tetap rata kiri (bukan form). Pencarian inbox di atas tabel tetap rata kiri.

Halaman kanvas kustom: form status + hapus di tengah; kisi kanvas full kolom.

## Tes

- `admin-shell.tsx` tidak memakai `max-w-page` pada header atau badan
- Header dan badan memakai lebar penuh (`w-full` / tanpa `mx-auto max-w-page`)
- Form pendek CMS yang diubah punya `mx-auto` bersama `max-w-xl` atau `max-w-2xl`
- Tes halaman publik yang mengunci `max-w-page` tetap lulus

## Di luar lingkup

Ubah resep kolom kanvas, token publik, login, hapus padding tepi.
