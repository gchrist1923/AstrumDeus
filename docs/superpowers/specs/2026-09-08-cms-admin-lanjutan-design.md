# Desain CMS admin lanjutan

Spesifikasi empat paket yang disetujui Grace pada 8 September 2026. Implementasi berurutan: unggah gambar, kategori dropdown, peran kustom + matriks hak, lalu daftar halaman dan kanvas kisi. Dokumen ini rujukan tunggal saat menulis plan dan kode.

Bahasa antarmuka tetap Indonesia. Token, tipografi, radius 0, dan hit 44px mengikuti `docs/superpowers/specs/2026-09-07-ui-ux-astrum-deus-design.md`.

## Konteks

CMS v1 sudah live di `master`: form memakai path teks (`/portrait.jpg`), dropdown turnamen/kas dari tabel tanpa UI kelola, empat peran hardcoded, tujuh halaman publik hanya bisa di-toggle bukan dibuat baru.

Empat paket ini menutup celah itu tanpa mengubah identitas visual atau memindahkan stack (tetap Next.js App Router, Prisma, SQLite).

## Urutan rilis

Setiap paket harus bisa di-merge sendiri dan dipakai tanpa menunggu paket berikutnya.

1. Unggah gambar
2. Kelola kategori (turnamen, kas, berita)
3. Peran kustom dan matriks lihat / tambah / ubah / hapus
4. Daftar halaman + kanvas kisi 12 kolom untuk halaman baru

## Paket 1 — Unggah gambar

### Keputusan

| Topik | Keputusan |
| --- | --- |
| Penyimpanan | Disk server di `web/uploads/`, tidak di-git |
| URL publik | `/media/<nama-file>` lewat Route Handler, bukan file di `web/public/` |
| Jenis | JPEG, PNG, WebP saja |
| Ukuran | Maksimal 15 MB per file |
| Siapa unggah | User yang punya hak ubah modul terkait (sebelum paket 3: Editor dan Admin) |
| Form yang memakai | Foto pemain, cover berita, aset Media Kit (gambar), logo partner, logo dan favicon situs |

Lampiran kas (PDF, struk) di luar paket ini.

### Perilaku

Komponen `ImageUpload` mengganti input path teks. Pratinjau gambar, tombol `Pilih gambar`, teks bantuan `JPG, PNG, atau WebP. Maksimal 15 MB.` Path seed (`/hero.jpg`, `/portrait.jpg`, logo di `public/`) tetap valid sampai diganti.

Nama file di disk acak (bukan nama asli), plus ekstensi dari jenis yang terdeteksi. Database menyimpan path `/media/...`. Ganti gambar: unggah baru, hapus file lama hanya jika tidak ada record lain yang memakai path yang sama.

### Error (ID)

- Jenis salah: `Pilih file JPG, PNG, atau WebP.`
- Terlalu besar: `Ukuran file maksimal 15 MB.`
- Gagal server: `Unggahan gagal. Coba lagi.`

Fokus kembali ke input file. Saat unggah, tombol disabled dan label `Mengunggah…`.

### Batas hosting

Di VPS dan laptop, file persisten. Di host tanpa disk (contoh Vercel) unggahan hilang saat instance berganti. Paket ini tidak memasang S3. Abstraksi path `/media/...` sengaja memudahkan ganti penyimpanan nanti.

### Tes

- Tolak PDF dan file > 15 MB
- Terima JPEG di bawah 15 MB, record path `/media/...`, GET path itu mengembalikan bytes gambar
- Ganti foto pemain menghapus file lama jika tidak terpakai
- Visitor tidak bisa POST unggah

## Paket 2 — Kelola kategori

### Keputusan

| Topik | Keputusan |
| --- | --- |
| Lokasi | Satu halaman `/cms/kategori` dengan tiga bagian: turnamen, kategori kas, kategori berita |
| Siapa | Sebelum paket 3: Editor dan Admin |
| Hapus keras | Tidak. Nonaktifkan supaya hilang dari dropdown form baru |
| Data lama | Record yang merujuk kategori nonaktif tetap menampilkan nama itu |

### Isi form kelola

- Turnamen: nama, organizer, season, tahun
- Kategori kas: nama, arah `masuk` atau `keluar`
- Kategori berita: nama; slug dibuat dari nama, unik

Dropdown pertandingan, kas, dan berita hanya menampilkan yang aktif. Form berita tidak lagi teks bebas untuk kategori.

### Tes

- Tambah turnamen → muncul di dropdown pertandingan
- Nonaktifkan kategori kas yang masih punya entri → form kas tidak menawarkan, laporan/arsip tetap menampilkan nama
- Percobaan hapus keras tidak tersedia di UI

## Paket 3 — Peran kustom dan matriks hak

### Keputusan

| Topik | Keputusan |
| --- | --- |
| Model | Admin membuat peran bernama bebas. Setiap peran punya matriks modul × aksi |
| Aksi | Lihat, tambah, ubah, hapus |
| UI | Tabel matriks di `/cms/peran`. Tombol salin dari templat Editor, Team, Finance |
| Peran Admin | Tidak bisa dihapus, haknya tidak bisa dikurangi, selalu full akses |
| Beberapa peran | Satu user boleh banyak peran; hak digabung (union). Cukup satu peran mengizinkan, user boleh |

### Modul di matriks

Berita, Roster, Pertandingan, Media Kit, Partners, Kotak masuk, Menu, Situs, Pengguna, Kategori, Peran, Halaman (daftar + builder), Jadwal, Kas operasional, Kas tim, Laporan.

Tanpa centang **lihat**: item nav hilang dan akses URL ditolak (redirect atau 404 sesuai area). Tambah/ubah/hapus tanpa lihat tidak berarti.

Templat salinan:

- Editor: lihat+tulis modul konten publik, kategori, halaman builder; tanpa menu, situs, pengguna, peran, internal
- Team: lihat jadwal (tulis milik sendiri dipetakan ke ubah pada event owner), kas tim milik sendiri; tanpa CMS
- Finance: lihat+tulis kedua buku kas, lihat laporan; tanpa CMS

Setelah paket 3, cek hardcoded `canAccessCms` / `canWriteContent` diganti baca matriks. Seed tetap punya Admin plus tiga templat agar tidak kosong.

### Tes

- Peran kustom hanya “Laporan lihat” tidak bisa buka `/cms/news` atau catat kas
- User dengan Editor+Finance mendapat gabungan hak
- Percobaan hapus atau kurangi peran Admin ditolak

## Paket 4 — Daftar halaman dan kanvas kisi

### Halaman bawaan (tujuh yang sudah ada)

Tercatat di daftar `/cms/halaman`: Home, Roster, Matches, News, Media Kit, Partners, Contact. Mandatory tidak bisa dihapus. Use Y/N tetap toggle `is_enabled`. Isi diedit lewat form CMS yang sudah ada, **bukan** kanvas.

Home (hero, live bar, section) tetap komposisi kode + toggle menu. Bukan page builder.

### Halaman baru

Buat slug, judul, status draft/terbit, toggle tampil di nav. Route publik `/{slug}` kecuali slug bentrok dengan rute bawaan (`roster`, `news`, `login`, `cms`, `internal`, `media`, dll.) — ditolak saat simpan.

Nav: hanya halaman terbit dan toggle nyala. Toggle mati atau draft → 404, data tetap.

### Kanvas

Hanya halaman baru. Baris vertikal, tiap baris 12 kolom. Blok: judul, teks, gambar (unggah paket 1), tombol (label + URL), daftar. Palet → tarik ke baris. Geser antar slot. Lebar hanya 4, 6, 8, atau 12. Tidak overlap. Di viewport di bawah `md` (960px), setiap blok full lebar berurutan.

Bukan geser bebas per piksel.

### Tes

- Halaman baru `/academy` terbit + toggle nyala muncul di nav dan merender blok
- Toggle mati → 404, nav hilang
- Slug `news` ditolak
- Tujuh halaman bawaan tidak membuka kanvas

## Di luar cakupan

- S3, Cloudinary, atau CDN
- Unggah PDF/ZIP Media Kit dan lampiran kas
- Kanvas untuk Home atau tujuh halaman bawaan
- Geser bebas per piksel
- Hak lebih halus dari empat aksi (misalnya “hanya event milik sendiri” sebagai baris matriks terpisah — ownership jadwal/kas tim tetap aturan kode, bukan centang tambahan)
- Page builder kolaboratif realtime

## Testing silang paket

Setelah keempat paket: Editor tanpa hak Halaman tidak membuka kanvas. Unggah gambar di blok kanvas memakai paket 1. Kategori berita di form berita memakai paket 2. Matriks paket 3 mengontrol semua menu baru (`/cms/kategori`, `/cms/peran`, `/cms/halaman`).
