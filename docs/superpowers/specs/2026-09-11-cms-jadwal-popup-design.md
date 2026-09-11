# Desain CMS: popup hari jadwal

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Dari rangkuman Grace: di kisi kalender cukup 2 event di depan; kelebihan `+N event`. Klik tanggal membuka popup daftar lengkap, tombol buat event, dan pilih event untuk ubah.

## Keputusan

Helper `chipKalender(items, 2)` → `{ tampil, sisa }`. Chip di sel hanya teks (jam + judul), bukan tautan. Seluruh angka tanggal taut ke `?bulan=&hari=` untuk semua yang boleh lihat jadwal (bukan hanya yang boleh tulis).

Popup (`JadwalDialog`) mengganti panel kanan. Pola overlay sama ConfirmSubmit: `role="dialog"` `aria-modal`, backdrop + Tutup, Escape. Query:

| Query | Isi dialog |
| --- | --- |
| `hari` saja | Daftar event hari itu. Kosong: `Tidak ada event.` Tombol `Buat event` jika boleh tulis → `hari` + `baru=1` |
| `hari` + `baru=1` | Form buat (autoFocus judul), default jam seperti sekarang |
| `id` | Form ubah atau lihat + hapus jika hak tulis |

Tutup: `?bulan=` tanpa hari/id/baru. Kalender satu kolom, tanpa aside.

Salin `+${sisa} event` (kata `event` tetap, termasuk `+1 event`).

## Tes

- `chipKalender`: 2 tampil, sisa 1 dari 3
- Dialog: daftar, Buat event, Tutup, tanpa “Pilih hari atau event”
- Halaman: `slice`/`chipKalender` 2, `+${sisa} event`, `JadwalDialog`, `baru=1`

## Di luar lingkup

Ringkasan internal (#13), pecah kas (#15), drag, filter anggota, minggu jam-per-jam.
