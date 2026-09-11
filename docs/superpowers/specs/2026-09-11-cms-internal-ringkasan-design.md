# Desain CMS: ringkasan internal

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Dari rangkuman Grace: `/internal` jangan kartu deskripsi modul. Jadwal tampilkan agenda hari ini; kas tampilkan jumlah; laporan tidak di ringkasan (tetap di nav).

## Keputusan

Hari ini = tanggal WIB (`toDateInput` / `fromDateInput`), event yang `startAt` jatuh di hari itu, urut waktu.

Kartu **Jadwal** (jika `jadwal` view): tautan ke `/internal/schedule?hari=<iso>`. Daftar judul event; jam `HH:mm` jika bukan sepanjang hari. Kosong: `Tidak ada jadwal hari ini.`

Kartu **Kas** (jika bisa baca paling tidak satu buku): tautan ke `/internal/cash`. Tiap buku yang boleh dibaca: nama + `formatRupiah(saldo)` dari saldo penuh (`computeBalance` + semua entri), sama seperti halaman kas. Tidak pecah menu kas (paket 15).

Tidak ada kartu Laporan. Pengguna hanya-laporan melihat ringkasan kosong; nav Laporan tetap.

Komponen `RingkasanInternal`. Helper `hariIniWib`.

## Tes

- `hariIniWib` rentang 24 jam WIB
- Komponen: event hari ini, kosong, saldo kas, tanpa tautan laporan
- Halaman: pakai komponen, query event/buku, tidak `/internal/reports`

## Di luar lingkup

Popup kalender (#14), pecah menu kas (#15), lebar-penuh shell.
