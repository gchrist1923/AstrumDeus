# Desain nav HP CMS/Internal

12 September 2026. Disetujui Grace: tombol Menu (bukan ikon tanpa label), judul form yang kosong.

## Nav HP

Sama seperti situs publik (`MobileMenu`): di bawah `md` sidebar disembunyikan. Header punya tombol **Menu** 44px, panel penuh layar, Escape/Tutup, fokus terkunci, `aria-current` di rute aktif.

Ringkasan `/cms` dan `/internal` hanya aktif jika path persis. Menu lain aktif jika path sama atau diawali `href/`.

Desktop tidak berubah: sidebar `md:w-52`.

## Judul form

`h2` section uppercase: Berita baru/Ubah berita, Pemain baru/Ubah pemain, Pertandingan baru/Ubah pertandingan, Aset baru/Ubah aset, Ubah partner. Menu mendapat judul **Menu**.
