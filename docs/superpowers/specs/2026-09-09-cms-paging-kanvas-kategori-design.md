# Desain CMS: paging, kanvas, dan hub kategori

Spesifikasi empat pekerjaan yang disetujui Grace pada 9 September 2026, satu PR di `feat/cms-admin-lanjutan` (atau cabang turunan). Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti `docs/superpowers/specs/2026-09-07-ui-ux-astrum-deus-design.md`.

Stack tidak berubah: Next.js App Router, Prisma, SQLite, Vitest.

## Konteks

Kotak masuk dan kas memuat semua baris sekaligus. Kanvas halaman menumpuk form di bawah palet, jadi drag harus scroll; tombol lebar 4/6/8/12 tidak menandai nilai aktif. `/cms/kategori` menumpuk tiga jenis dalam satu gulir; hapus keras dilarang di spec 8 September (hanya Nonaktifkan).

## Urutan di PR

1. Helper paging bersama
2. Kotak masuk: tabel, search, hapus, paging
3. Kas: paging daftar entri
4. Hub kategori + hapus jika belum terpakai
5. Kanvas tiga kolom: palet, tampilan, properti

## Keputusan bersama

| Topik | Keputusan |
| --- | --- |
| Ukuran halaman | 5 baris per halaman |
| URL | Query `hal` (1-based). Nilai < 1 atau > jumlah halaman diklem ke rentang sah |
| Search | Query `q`. Ganti `q` mengembalikan `hal=1` |
| Saldo kas | Dihitung dari **semua** entri buku, bukan halaman yang sedang dilihat |
| Paging kas | Hanya daftar entri. Form entri baru dan tab buku tidak di-paging |
| Ganti buku kas | `?buku=` baru, `hal` kembali ke 1 |

Helper murni `paginate({ total, page, perPage })` mengembalikan `{ page, pageCount, skip, take, hasPrev, hasNext }`. `perPage` default 5. UI pager: tautan nomor halaman (contoh 20 item → 4 tautan), halaman aktif `aria-current="page"`.

## 1 — Kotak masuk

Tabel HTML, bukan kartu. Kolom: status, subjek, pengirim (nama · email), tanggal, pesan, aksi.

Satu field search `Cari` dengan `name="q"`, GET ke `/cms/inbox`. Cocokkan substring (tidak peka huruf) pada **subjek, email, atau nama**. Isi pesan tidak ikut dicari.

Aksi tetap Dibaca / Selesai jika `inbox` update. Tombol Hapus jika `inbox` delete. Hapus pesan apa saja, hard delete. Konfirmasi dulu (`Hapus pesan ini?`). Sukses: revalidate, tetap di query `q`/`hal` yang sah.

Kosong: `Belum ada pesan.` Jika `q` tidak cocok: `Tidak ada pesan yang cocok.`

## 2 — Kas

Daftar entri buku terpilih: 5 per halaman, `?buku=&hal=`. Koreksi per pemilik tidak berubah. Form Entri baru di samping, tidak di-paging.

## 3 — Kategori

`/cms/kategori` hanya tiga kartu: Turnamen, Kategori kas, Kategori berita. Klik membuka:

- `/cms/kategori/turnamen`
- `/cms/kategori/kas`
- `/cms/kategori/berita`

Detail: daftar + form tambah (jika create/update) seperti sekarang. **Nonaktifkan tetap ada** untuk item aktif. **Hapus** (destructive) jika `kategori` delete.

Hapus hanya jika belum dipakai:

| Jenis | Terpakai jika |
| --- | --- |
| Turnamen | ada `Match` atau `PlayerStat` |
| Kategori kas | ada `CashEntry` |
| Kategori berita | ada `NewsPost` |

Jika terpakai, tidak menghapus. Pesan:

- Turnamen: `Tidak bisa dihapus. Masih dipakai N pertandingan atau statistik.`
- Kas: `Tidak bisa dihapus. Masih dipakai N entri kas.`
- Berita: `Tidak bisa dihapus. Masih dipakai N berita.`

Konfirmasi hapus: `Hapus kategori ini?` (atau `Hapus turnamen ini?`). Nonaktif tidak menghapus relasi; dropdown form baru tetap hanya yang aktif.

## 4 — Kanvas

Tiga kolom di viewport lebar: **Palet** kiri (nempel, tidak perlu scroll untuk drag), **Tampilan** tengah (kisi 12 kolom, visual halaman), **Blok dipilih** kanan (field + lebar + pindah).

- Palet: klik menambah baris baru; seret ke tampilan (baris atau zona Baris baru).
- Tampilan: drop target. Blok kosong tampil sebagai plaseholder editor (publik tetap menyembunyikan teks kosong).
- Klik blok di tampilan = pilih. Outline aksen pada blok terpilih.
- Lebar 4/6/8/12: `aria-pressed` pada nilai aktif; visual primary (emas) vs secondary.
- Pindah kiri/kanan: bukan toggle; `:active`/pressed kelihatan; disabled di ujung.
- Naik/turun baris tetap di chrome baris pada tampilan.
- Inspector memuat field blok terpilih (teks, gambar, dst.). Jika belum ada yang dipilih: `Pilih blok di tampilan.` Simpan tata letak tetap satu submit JSON layout.

Tidak menambah library drag.

## Tes

- `paginate`: 20 item → 4 halaman; `hal=0` → 1; `hal=99` → last.
- Inbox: filter `q` pada email; hapus butuh `delete`; tanpa konfirmasi tidak diuji di Node (UI confirm).
- Kas: halaman 2 tidak mengubah rumus saldo vs semua entri.
- Kategori: hapus ditolak jika ada relasi; hub tidak merender tiga daftar penuh.
- Kanvas: `aria-pressed="true"` pada lebar aktif; palet dan zona drop ada tanpa scroll list form panjang.

## Di luar lingkup

Paging berita/roster/pertandingan. Search kas. Soft-delete pesan. Ubah renderer publik. S3. Pindah cabang ke master tanpa PR.
