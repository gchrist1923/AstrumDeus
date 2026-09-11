# Desain CMS: pecah menu kas

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Dari rangkuman Grace: kas operasional dan kas tim jangan satu menu; Team hanya boleh buka kas tim lewat hak peran yang sudah ada (`kas-operasional` / `kas-tim`).

## Keputusan

Nav internal dua tautan terpisah, masing-masing jika `view`:

- Kas operasional → `/internal/cash/operasional`
- Kas tim → `/internal/cash/tim`

Tidak ada label tunggal `Kas`. Tidak ada tab ganti buku di halaman.

`/internal/cash` (dan `?buku=`) mengalihkan ke rute jenis yang sesuai. Halaman jenis memakai `requireCashBookView`; tanpa hak → `/internal`.

Ringkasan `/internal`: dua kartu terpisah (bukan satu “Kas”), taut ke rute jenis.

`internalNavLinks(matrix)` diekspor dari `admin-shell` supaya tes peran Team vs Finance. Template peran tidak diubah: Team sudah hanya `kas-tim`.

## Tes

- Team: nav ada Kas tim, tidak Kas operasional, tidak label `Kas`
- Finance: kedua tautan
- Halaman kas: path operasional/tim, tidak `?buku=` di pager, `requireCashBookView`

## Di luar lingkup

Popup jadwal (#14), ringkasan saldo (#13), pecah laporan, ubah seed template peran.
