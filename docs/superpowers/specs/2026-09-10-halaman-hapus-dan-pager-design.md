# Desain hapus halaman kustom dan pager ringkas

Tambahan 10 September 2026. Terpisah dari kanvas WYSIWYG dan kalender jadwal. Bahasa UI Indonesia. Hit 44px, radius 0.

## Hapus halaman kustom

Tujuh rute bawaan **tidak** bisa dihapus. Halaman `kind === 'custom'` punya aksi Hapus di daftar `/cms/halaman` dan di kanvas `/cms/halaman/[id]`, selain tautan Kanvas serta status Draf/Terbit (status tidak diganti; Hapus itu buang record).

Hak: `halaman` `delete`. Konfirmasi `Hapus halaman ini?`. Hard delete `SitePage`. Nav publik mengikuti data yang tersisa. Slug boleh dipakai lagi setelah hapus.

Bukan: arsip, soft-delete, hapus Home/News/dll.

## Pager (kas + kotak masuk)

Sekarang `Pager` merender semua nomor. Jika `pageCount <= 10`, tetap semua nomor seperti sekarang.

Jika `pageCount > 10`: tautan **Sebelum** dan **Berikut**, plus teks `Hal {page} dari {pageCount}` (bukan deretan 11+ tombol). Sebelum disabled/hilang di halaman 1; Berikut di halaman terakhir. `hrefFor` tidak berubah.

## Tes

- Custom: tombol Hapus; `delete({ where: { id } })` hanya jika `kind === 'custom'`
- Bawaan: tidak ada Hapus di baris builtin
- Pager 4 halaman: 4 tautan nomor, tidak ada “Berikut” sebagai pengganti nomor
- Pager 11 halaman di halaman 1: ada Berikut, tidak merender 11 tautan nomor
