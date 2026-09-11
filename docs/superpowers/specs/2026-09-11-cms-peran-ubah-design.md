# Desain CMS peran: aksi Ubah dan menu

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Dari rangkuman Grace: setelah buat peran (contoh Manager Finance) ada aksi **Ubah** untuk memilih menu CMS dan internal yang boleh dibuka saat login.

## Keputusan

Matriks hak yang sudah ada tetap sumber kebenaran. Centang **Lihat** = menu muncul di nav dan rute bisa dibuka. Tambah/Ubah/Hapus tetap aksi di dalam menu itu. Tidak ada model hak baru.

`/cms/peran` daftar: nama peran teks biasa (plus slug). Tombol **Ubah** (seperti Partners) ke `/cms/peran/[id]`. Hapus tetap. Admin tidak punya Hapus, tetap punya Ubah supaya matriks terkunci bisa dilihat.

Tambah peran / salin templat: setelah simpan, redirect ke halaman Ubah peran baru (`/cms/peran/{id}`), bukan kembali ke daftar. Nama bentrok tetap `?kesalahan=nama` di daftar.

Halaman Ubah: ikon kembali ke `/cms/peran` di samping judul (pola kategori). Satu form, dua tabel: **CMS** lalu **Internal** (Jadwal, Kas operasional, Kas tim, Laporan). Copy: Lihat menyalakan menu; tulis tanpa lihat diabaikan. Admin terkunci. **Simpan hak** jika `peran` update.

## Tes

- Daftar: teks `Ubah`, `href={`/cms/peran/${role.id}`}`
- Nama peran bukan satu-satunya tautan (boleh tanpa `<Link` pada nama)
- `actions.ts`: setelah `accessRole.create`, `redirect(\`/cms/peran/${role.id}\`)`
- Detail: heading CMS dan Internal; matriks checkbox tetap

## Di luar lingkup

Paket 15 pecah menu Kas, paket pengguna, ganti model matriks.
