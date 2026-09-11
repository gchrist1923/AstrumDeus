# Desain CMS media kit: pratinjau, meta berkas, dan tambah aset

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Disetujui Grace: halaman baru `/cms/media-kit/new`, jenis/ukuran otomatis readonly, pratinjau rasio asli, kanvas tanpa pratinjau kedua.

## Keputusan

`ImageUpload` tetap satu komponen untuk semua form CMS. Media kit memakai opsi meta berkas. Kanvas memakai opsi tanpa pratinjau. Form tambah pindah ke rute baru, pola sama dengan Berita.

## Daftar dan tambah

`/cms/media-kit` hanya daftar + tautan Ubah. Jika user punya hak `create`, tombol **Tambah aset** (link ke `/cms/media-kit/new`, gaya sama **Tulis berita**) di kanan judul. Tidak ada form di bawah list.

`/cms/media-kit/new` dan `/cms/media-kit/[id]` memakai form yang sama. Create butuh grant `create`; edit `view` + tombol Simpan jika `update`.

## Jenis dan ukuran

Kolom `fileType` dan `fileSize` tetap di `MediaKitAsset`. Di form:

- Terlihat, `readOnly` (bukan `disabled`, supaya ikut submit)
- Label **Jenis** dan **Ukuran**
- Hint: `Diisi otomatis dari berkas.`
- Setelah unggah berhasil, nilai diisi dari file klien: jenis `PNG` / `JPEG` / `WebP`, ukuran `24 B` / `24 KB` / `1,2 MB` (1024, koma desimal Indonesia, satu angka di belakang koma jika &lt; 10 satuan)
- Aset lama tidak dihitung ulang sampai berkas diunggah ulang
- Server, jika `href` adalah path `/media/...` terkelola, membaca file di disk dan menimpa jenis/ukuran agar tidak bisa dipalsukan

## Pratinjau

`ImageUpload` memakai `max-h-48 w-auto max-w-full h-auto object-contain` plus outline 1px yang sudah ada. Tidak `w-full` + tinggi tetap tanpa `object-contain`.

Kanvas blok gambar: `ImageUpload` `hidePreview`. Gambar di blok tetap; tidak ada `<img>` pratinjau kedua.

## Tes

- Helper format: 24 B, 24 KB, 1,2 MB, label jenis
- ImageUpload: class contain; `hidePreview` tidak merender pratinjau; meta terisi setelah unggah PNG
- Daftar media kit: tautan Tambah aset, tidak merender form `saveAsset` / heading Tambah aset
- `saveAsset`: path `/media/...` menimpa fileType/fileSize dari byte file

## Di luar lingkup

Inbox, menu, pengguna, kategori, peran, jadwal, kas, cabang lebar-penuh, situs publik, kartu unduhan publik (tetap teks jenis/ukuran tanpa thumbnail).
