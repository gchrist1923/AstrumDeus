# Desain CMS menu: halaman kustom terbit

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Disetujui dari rangkuman Grace: halaman yang sudah terbit muncul di `/cms/menu` dan bisa dimatikan di situ, tidak hanya dari Halaman.

## Keputusan

`/cms/menu` tetap daftar checkbox. Tujuh item `MenuItem` tidak berubah (wajib terkunci). Di bawahnya, kelompok **Halaman terbit**: setiap `SitePage` `kind=custom` dan `status=published`.

Toggle memakai `isEnabled` (sama seperti menu bawaan opsional): mati = hilang dari nav dan rute 404. `showInNav` tetap diatur di form kanvas, bukan di halaman Menu.

Tidak membuat baris `MenuItem` baru. Nama field checkbox kustom: `custom:{id}`.

Draf tidak tampil di Menu. Jika halaman dikembalikan ke draf, hilang dari daftar Menu; `isEnabled` tidak diubah otomatis.

Grant: `menu` `update` (sudah dipakai `saveMenuFlags`).

## Simpan

`saveMenuFlags` tetap menulis tujuh MenuItem lewat `syncBuiltinEnabled`. Lalu untuk tiap halaman kustom terbit, `sitePage.update` `isEnabled` dari checkbox. Revalidate layout, `/cms/menu`, `/cms/halaman`, dan `/{slug}`.

## Tes

- Helper: hanya custom+published; draf dan builtin keluar; `fieldName` `custom:{id}`
- Halaman menu merender helper / `custom:`
- Actions menulis `sitePage.update` untuk field `custom:`

## Di luar lingkup

Inbox, media kit, pengguna, kategori, peran, jadwal, kas, mengubah arti `showInNav`.
