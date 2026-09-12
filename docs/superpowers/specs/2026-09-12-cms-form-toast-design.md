# Desain toast simpan/ubah dan validasi form CMS

12 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Disetujui Grace: toast setelah simpan/ubah/hapus di seluruh form CMS + Internal; validasi browser + server; form kontak publik dan login tidak diubah.

## Toast

Satu komponen client di `AdminShell` (CMS dan Internal). Action sukses/gagal redirect dengan query. Toast baca query, tampilkan, lalu `router.replace` menghapus kunci flash tanpa scroll.

Query:

| Kunci | Nilai | Hasil |
| --- | --- | --- |
| `ok` | `simpan` / `ubah` / `hapus` | Sukses |
| `kesalahan` | kode di bawah | Error |
| `peringatan` | `tumpang` | Peringatan (jadwal) |
| `n` + `pakai` | angka + `turnamen`/`kas`/`berita` | Teks pakai |

Copy sukses: **Tersimpan.** / **Perubahan tersimpan.** / **Dihapus.**

Jika `peringatan=tumpang` ada, pakai **Event tersimpan, tetapi menimpa jadwal lain.** (bukan toast sukses generik).

Error:

| Kode | Copy |
| --- | --- |
| `isi` | Isi kolom yang wajib. |
| `email` | Email tidak valid. |
| `angka` | Angka tidak boleh minus. |
| `wajib` | Menu wajib tidak bisa dimatikan. |
| `slug` | Slug tidak tersedia. |
| `nama` | Nama sudah dipakai. |
| `layout` | Tata letak tidak valid. |
| `kurangi` | Hak Admin tidak bisa dikurangi. |
| `hapus` | Peran Admin tidak bisa dihapus. |
| `pakai` | Tidak bisa dihapus. Masih dipakai {n} … (bergantung `pakai`) |

`kesalahan=isi` terpisah dari `kesalahan=wajib` (menu bawaan).

Perilaku:

- Sukses dan peringatan: `role="status"`, hilang ~4 detik, bisa ditutup.
- Error: `role="alert"`, tetap sampai ditutup.
- Escape menutup. Tombol Tutup 44px, `aria-label="Tutup"`.
- Posisi `fixed` atas-kanan (mobile: inset kiri-kanan). `surface-raised`, radius 0, garis kiri aksen atau danger.
- `prefers-reduced-motion`: tanpa geser, hanya opacity.

## Validasi

Browser: `required` / `type="email"` / `min={0}` pada field wajib.

Server: menolak field wajib kosong (`kesalahan=isi`) dan email tidak valid. Mirror field yang sudah `required` di form.

Situs wajib: nama situs, judul meta, email kontak. Angka gelar/turnamen/WWCD `min={0}`; minus → `kesalahan=angka`. Hero, alamat, telepon, deskripsi meta boleh kosong.

## Di luar lingkup

Form kontak publik, login, toast di situs publik.
