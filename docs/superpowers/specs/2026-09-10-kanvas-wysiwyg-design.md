# Desain kanvas WYSIWYG

Revisi kanvas halaman CMS yang disetujui Grace pada 10 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07. Tiga kolom palet / tampilan / alat tetap.

## Konteks

Tampilan tengah sekarang tombol berlabel. Isi diketik di panel kanan, jadi tata letak tidak kelihatan seperti halaman. Palet belum punya garis atau video.

## Kanvas

Satu permukaan visual. Blok dalam baris kisi 12 kolom (lebar 4/6/8/12, `max-md:col-span-12`). Isi diedit **di dalam blok**:

| Jenis | Di kanvas |
| --- | --- |
| Teks (`heading`) | Input bergaya judul (level 2/3 dari panel) |
| Long text (`text`) | Textarea paragraf |
| Tombol | Label tombol kelihatan seperti tombol publik |
| Gambar | Pratinjau `src` jika ada; jika kosong, unggah di dalam blok |
| Video | Cover YouTube jika URL dikenali; jika tidak, plaseholder + field tautan |
| Garis | Garis horizontal sesuai warna dan ketebalan |
| Daftar (data lama) | Masih dirender; **tidak** ada di palet baru |

Klik blok = pilih (outline aksen). Seret palet ke baris / Baris baru. Naik/Turun di chrome baris.

## Palet

Teks, Long text, Tombol, Gambar, Video, Garis. Tidak menambah library drag.

## Panel kanan (blok dipilih)

Selalu: 4/6/8/12 (`aria-pressed`), Pindah kiri/kanan (disabled di ujung), Hapus (`Hapus blok ini?`).

Kondisional:

- Level: hanya Teks (`heading`) — 2 atau 3
- Warna: Teks, Long text, Tombol, Garis — token `default` | `accent` | `muted` (bukan hex)
- Ketebalan: hanya Garis — 1, 2, atau 4 px

Gambar/video: tidak ada warna/ketebalan di panel. Field tautan video boleh di kanvas (dekat cover). Teks alternatif gambar tetap di blok gambar.

Tanpa pilihan: `Pilih blok di tampilan.`

## Video

Payload `{ url }`. CMS dan publik menampilkan **cover** (thumbnail YouTube dari id). Bukan iframe di editor.

Publik: klik cover memuat pemutar YouTube di tempat yang sama (klik-untuk-putar). Bukan tautan keluar, bukan embed otomatis saat load.

URL non-YouTube: plaseholder + tautan teks, tanpa pemutar.

Tidak unggah file video. Tidak Vimeo di paket ini.

## Data

`BlockType` tambah `'video' | 'divider'`. `heading` | `text` | `image` | `button` | `list` tetap valid. Layout JSON lama tidak di-migrasi. `list` hanya tampil jika sudah tersimpan.

Warna di payload `color`; default jika kosong = `default`. Ketebalan garis `thickness`; default 2.

## Tes

- Kanvas: ketik judul di blok, nilai masuk `layout` JSON
- Gambar: `src` tampil sebagai `img` di tampilan
- Video YouTube: cover `img`; setelah klik di renderer publik, iframe muncul
- Hapus blok mengurangi JSON setelah konfirmasi
- Palet tidak berisi Daftar
- `assertValidLayout` menerima `video` dan `divider`

## Di luar lingkup

Hex bebas, unggah berkas video, Vimeo, hapus tipe `list` dari data lama, ubah halaman Matches.
