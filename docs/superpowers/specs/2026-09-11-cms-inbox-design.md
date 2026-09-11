# Desain CMS kotak masuk: detail, ringkas, hapus

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Disetujui dari rangkuman Grace: klik baris membuka detail, cuplikan ~10 kata, isi penuh dengan baris baru, tanpa tombol Dibaca/Selesai, klik = dibaca, aksi hanya Hapus.

## Keputusan

Daftar tetap tabel + cari + pager. Cuplikan pesan memakai helper `ringkasPesan`. Detail di `/cms/inbox/[id]`. Status `baru` menjadi `dibaca` saat halaman detail dibuka. Kolom aksi list hanya Hapus (konfirmasi yang sudah ada).

## Daftar

Kolom Pesan menampilkan `ringkasPesan(message, 10)`: pecah di whitespace, 10 kata pertama, jika lebih tambah `...`. Baris baru di list flatten (cuplikan satu baris).

Klik baris (selain Hapus) membuka detail. Implementasi: `tr` `relative`, tautan subjek dengan overlay `after:absolute after:inset-0`, sel Hapus `relative z-10`. Nama tautan = subjek.

Tidak ada tombol Dibaca atau Selesai. `updateInboxStatus` dihapus dari UI; status `selesai` di database biarkan jika ada, tidak ditampilkan sebagai aksi.

## Detail

`/cms/inbox/[id]`: subjek sebagai judul, status, pengirim (nama · email), tanggal, isi `whitespace-pre-wrap` (enter tetap). Grant `view`. Jika status `baru`, update ke `dibaca` + `handledById` (side effect baca). Pesan yang sudah `dibaca`/`selesai` tidak diubah.

Hapus di detail jika grant `delete`, konfirmasi sama, redirect ke daftar (pertahankan `q`/`hal` jika dikirim).

404 jika id tidak ada.

## Tes

- `ringkasPesan`: 10 kata tanpa `...`; 11 kata dipotong + `...`; string kosong; newline dihitung sebagai pemisah
- Daftar: `ringkasPesan`, tautan `/cms/inbox/`, Hapus, tidak `Dibaca`/`Selesai`/`updateInboxStatus`
- Detail: `whitespace-pre-wrap`, update status `baru` → `dibaca`

## Di luar lingkup

Media kit, menu, pengguna, kategori, peran, jadwal, kas, cabang lain.
