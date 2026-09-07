# PRD Web Profile Company Astrum Deus + CMS

## Status dokumen

Draft awal. Struktur section sudah final, tapi sebagian isi masih menunggu tambahan dari Grace.

Penanda yang dipakai di dokumen ini:

- `TBD (Grace)` berarti belum diputuskan dan sengaja tidak diisi.
- `Asumsi` berarti usulan default dari agent yang boleh langsung ditimpa.

Desain UI/UX-nya diputuskan di dokumen terpisah, `docs/superpowers/specs/2026-09-07-ui-ux-astrum-deus-design.md`. Dokumen itu yang berlaku untuk hal visual, sedangkan dokumen ini mengatur kebutuhan produk.

Yang sudah diputuskan setelah draft awal:

- Bidang dan audience: tim esports PUBG Mobile, audiensnya pemain dan penonton esports
- Fondasi front-end: Next.js App Router, TypeScript dan Tailwind
- Arah visual: gelap monokrom dengan aksen emas
- Menu bertambah dua, Roster dan Matches, keduanya Use Y/N
- Urutan section Home

Yang masih `TBD (Grace)`:

- Pilihan CMS, database dan penyedia autentikasi
- Kategori News, isi Media Kit, kriteria Partners, kanal Contact
- Kategori pemasukan dan pengeluaran, serta daftar anggota tim
- Daftar pemain beserta role-nya, dan riwayat turnamen yang mau ditampilkan

## Ringkasan

Astrum Deus adalah tim esports PUBG Mobile. Tim ini butuh satu situs profil yang isinya bisa dikelola sendiri lewat CMS, tanpa minta developer setiap kali ada perubahan konten. Di sisi lain, tim juga butuh area internal untuk mengatur jadwal dan mencatat keuangan operasional, sehingga satu aplikasi melayani dua audience: publik dan tim internal.

Audiensnya pemain PUBG Mobile dan orang yang mengikuti esports, bukan pembeli produk atau klien korporat. Karena itu yang paling dicari pengunjung adalah roster dan hasil pertandingan, sementara sponsor menilai tim dari prestasinya lebih dulu sebelum melihat media kit.

## Tujuan

1. Semua konten di menu audience bisa dibuat, diubah dan dihapus dari CMS oleh non-developer.
2. Menu opsional bisa dinyalakan dan dimatikan tanpa deploy ulang.
3. Jadwal tim tercatat di satu kalender yang jadi rujukan bersama.
4. Setiap transaksi kas operasional dan kas tim tercatat, dan laporan harian serta bulanan dihasilkan dari data yang sama.

## Non-goals

Di luar scope rilis pertama:

- E-commerce, keranjang belanja dan pembayaran online
- Multi-tenant atau multi-perusahaan dalam satu instance
- Payroll, pajak dan akuntansi jurnal umum berpasangan
- Aplikasi mobile native
- Portal login untuk pelanggan atau partner

## Peran dan akses

Lima peran yang dipakai:

- **Visitor**: publik, tanpa login. Hanya melihat halaman audience yang aktif.
- **Editor**: login CMS. CRUD konten audience, tapi tidak bisa mengubah toggle menu dan tidak bisa masuk area internal.
- **Admin**: login CMS. Semua akses Editor, ditambah pengaturan menu Y/N, pengaturan situs dan manajemen user.
- **Team Member**: login area internal. Melihat kalender tim, membuat dan mengubah event miliknya, serta mencatat entri kas tim.
- **Finance**: login area internal. CRUD entri kas operasional dan kas tim, plus akses penuh ke laporan keuangan.

Matriks akses per modul:

- Home, Roster, Matches, News, Media Kit, Partners: baca untuk Visitor bila aktif, CRUD untuk Editor dan Admin
- Toggle menu dan pengaturan situs: Admin saja
- Contact: kirim pesan untuk Visitor, baca dan kelola pesan untuk Editor dan Admin
- Schedule Team: baca untuk semua peran internal, tulis untuk Team Member pada event miliknya, tulis penuh untuk Admin
- Cash book operasional: tulis untuk Finance, baca untuk Admin
- Cash book tim: tulis untuk Team Member pada entri miliknya, tulis penuh untuk Finance
- Financial Reporting: baca untuk Finance dan Admin

`Asumsi`: satu orang boleh punya lebih dari satu peran, misalnya Admin yang sekaligus Finance.

## Aturan menu audience

Menu audience terdiri dari tujuh item, dengan dua status berbeda:

| Menu | Status | Bisa dimatikan |
| --- | --- | --- |
| Home | Mandatory | Tidak |
| Roster | Use Y/N | Ya |
| Matches | Use Y/N | Ya |
| News | Mandatory | Tidak |
| Media Kit | Use Y/N | Ya |
| Partners | Use Y/N | Ya |
| Contact | Mandatory | Tidak |

Urutan di tabel ini sekaligus urutan tampil di navigasi.

Menu mandatory selalu tampil di navigasi. Yang bisa diubah hanya kontennya lewat CMS, bukan keberadaannya, sehingga toggle-nya tidak ditampilkan atau ditampilkan dalam keadaan terkunci.

Menu Use Y/N punya flag `is_enabled` yang dikontrol Admin. Perilaku saat flag mati:

- Item hilang dari navigasi utama dan dari footer
- Route halamannya membalas 404, bukan halaman kosong atau redirect
- Halamannya keluar dari sitemap
- Section terkait di Home ikut hilang: cuplikan roster saat Roster mati, section hasil saat Matches mati, strip partner saat Partners mati
- Tautan dari artikel News ke halaman yang mati berubah jadi teks biasa, bukan tautan mati
- Kontennya tetap tersimpan, jadi menyalakan ulang tidak perlu input ulang

Perubahan flag berlaku tanpa deploy ulang. Kalau pakai static generation, halaman navigasi direvalidasi saat flag berubah.

## Modul audience

### Home

Halaman utama tersusun dari section yang bisa diatur urutannya lewat CMS. Editor bisa menambah, mengubah urutan, menyembunyikan dan menghapus section.

Urutan section sudah diputuskan di design doc: bar live, hero, hasil terakhir, cuplikan roster, berita terbaru dan strip partner. Bar live hanya muncul bila ada pertandingan sedang berlangsung atau jadwal terdekat, dan hilang sepenuhnya bila tidak ada.

Acceptance criteria:

- Editor mengubah urutan section, dan urutan di halaman publik ikut berubah tanpa deploy
- Section berstatus draft tidak tampil ke Visitor
- Home tetap tampil utuh saat Roster, Matches, Media Kit dan Partners dimatikan, tanpa menyisakan section kosong

### Roster

Daftar pemain aktif dengan halaman detail per pemain, aktif hanya bila flag `is_enabled` menyala.

Kebutuhan:

- CRUD pemain dengan IGN, nama asli yang opsional, role, foto, tanggal gabung, tautan media sosial dan urutan tampil
- Role mengikuti istilah PUBG Mobile: IGL, Assaulter, Sniper, Support dan Filter
- Pemain nonaktif tidak dihapus, tapi pindah ke bagian mantan pemain beserta tanggal keluarnya
- Statistik per turnamen tampil di halaman detail pemain

Daftar pemain dan role-nya: `TBD (Grace)`.

Acceptance criteria:

- Saat flag mati, `/roster` membalas 404, menu tidak muncul dan cuplikan roster di Home ikut hilang
- Menonaktifkan pemain memindahkannya ke bagian mantan pemain tanpa menghapus halaman detailnya
- Urutan pemain mengikuti field urutan, bukan urutan input

### Matches

Jadwal dan riwayat hasil pertandingan, aktif hanya bila flag `is_enabled` menyala.

Kebutuhan:

- CRUD turnamen dengan nama, penyelenggara, musim dan tahun
- CRUD pertandingan dengan turnamen, tahap, jadwal, status, posisi akhir, poin, jumlah WWCD dan lokasi
- Pertandingan berstatus jadwal tampil di bagian jadwal, yang sudah selesai pindah ke bagian hasil
- Pertandingan bisa ditautkan ke satu artikel News sebagai recap
- Filter per tahun dan per turnamen
- Posisi akhir, poin dan WWCD hanya wajib diisi untuk pertandingan yang sudah selesai

Riwayat turnamen yang mau ditampilkan: `TBD (Grace)`.

Acceptance criteria:

- Saat flag mati, `/matches` membalas 404, menu tidak muncul dan section hasil di Home ikut hilang
- Pertandingan yang jadwalnya sudah lewat tapi hasilnya belum diisi tetap tampil di bagian jadwal, tidak hilang dari kedua bagian
- Mengisi posisi akhir memindahkan pertandingan ke bagian hasil
- Waktu pertandingan tampil dalam WIB

### News

Daftar artikel dengan halaman detail per artikel.

Kebutuhan:

- CRUD artikel dengan judul, slug, ringkasan, isi rich text, cover, kategori, penulis dan tanggal publish
- Status draft dan published, plus jadwal publish di masa depan
- Daftar artikel dengan pagination, urut terbaru dulu
- Filter per kategori
- Slug unik dan stabil setelah artikel terbit

Daftar kategori awal: `TBD (Grace)`.

Acceptance criteria:

- Artikel draft tidak bisa diakses Visitor lewat URL langsung
- Artikel dengan jadwal publish besok belum tampil hari ini, dan tampil otomatis saat waktunya tiba
- Mengubah judul artikel yang sudah terbit tidak mengubah slug-nya kecuali Editor mengubah slug secara sadar

### Media Kit

Kumpulan aset brand yang bisa diunduh publik, aktif hanya bila flag `is_enabled` menyala.

Kebutuhan:

- CRUD aset dengan nama, deskripsi singkat, jenis file, ukuran dan file unduhan
- Pengelompokan aset, misalnya logo, warna dan foto
- Unduh satu file, dan `Asumsi` unduh seluruh grup sebagai zip

Isi media kit yang sebenarnya: `TBD (Grace)`.

Acceptance criteria:

- Saat flag mati, `/media-kit` membalas 404 dan menu tidak muncul
- Ukuran dan jenis file tampil sebelum Visitor mengunduh
- File yang dihapus dari CMS tidak lagi bisa diunduh lewat URL lama

### Partners

Daftar partner atau klien, aktif hanya bila flag `is_enabled` menyala.

Kebutuhan:

- CRUD partner dengan nama, logo, deskripsi singkat, tautan situs dan urutan tampil
- Pengelompokan partner, `Asumsi` berdasarkan jenis kerja sama
- Logo tampil rapi walau rasio aslinya berbeda

Kriteria dan pengelompokan partner: `TBD (Grace)`.

Acceptance criteria:

- Saat flag mati, `/partners` membalas 404 dan menu tidak muncul
- Urutan partner mengikuti field urutan, bukan urutan input
- Partner tanpa tautan situs tampil sebagai elemen non-klik, bukan tautan mati

### Contact

Halaman kontak dengan form dan informasi perusahaan.

Kebutuhan:

- Form dengan nama, email, tujuan dan pesan, plus validasi di server
- Pilihan tujuan: kerja sama sponsor, media dan pers, tryout pemain, atau lainnya, supaya pesan calon pemain tidak tercampur dengan tawaran sponsor
- Proteksi spam, `Asumsi` honeypot ditambah rate limit per IP
- Pesan tersimpan di database dan bisa dibaca Editor serta Admin, dengan status baru, dibaca dan selesai
- Notifikasi email ke alamat tujuan saat ada pesan masuk
- Informasi statis yang bisa diedit dari CMS: alamat, email, telepon dan tautan media sosial

Kanal kontak dan alamat tujuan notifikasi: `TBD (Grace)`.

Acceptance criteria:

- Pengiriman gagal menampilkan pesan error per field, dan isi form tidak hilang
- Pengiriman berhasil menyimpan satu record dan mengirim satu notifikasi
- Pesan yang sama terkirim dua kali dalam waktu singkat tertahan rate limit

## Modul internal

Area internal berada di belakang login dan tidak terindeks mesin pencari.

### Schedule Team

Kalender bersama untuk jadwal tim.

Kebutuhan:

- Tampilan bulanan dan mingguan, `Asumsi` bulanan sebagai default
- CRUD event dengan judul, tanggal, jam mulai, jam selesai, lokasi, catatan dan penanggung jawab
- Event bisa punya lebih dari satu anggota tim
- Event sepanjang hari tanpa jam mulai dan jam selesai
- Filter per anggota tim, plus tampilan "jadwal saya"
- Peringatan saat jadwal seorang anggota bertumpuk, sifatnya memberi tahu dan tidak memblokir simpan
- `Asumsi` event berulang ditunda ke iterasi berikutnya

Daftar anggota tim dan pola jadwal yang biasa dipakai: `TBD (Grace)`.

Acceptance criteria:

- Membuat event dua jam menampilkannya di slot yang benar pada tampilan mingguan
- Jam selesai lebih awal dari jam mulai ditolak dengan pesan yang jelas
- Menambahkan anggota ke event yang jamnya bertumpuk menampilkan peringatan, dan event tetap bisa disimpan
- Team Member tidak bisa mengubah event yang bukan miliknya

### Financial Record-keeping

Pencatatan kas dengan dua buku terpisah: kas operasional dan kas tim.

Kebutuhan:

- Dua cash book berdiri sendiri, masing-masing punya saldo awal dan saldo berjalan
- Entri kas dengan tanggal, jenis masuk atau keluar, nominal, kategori, keterangan, lampiran bukti dan pencatat
- Saldo berjalan dihitung dari entri, bukan disimpan sebagai angka yang bisa diedit langsung
- Kategori pengeluaran dan penerimaan bisa dikelola sendiri
- Koreksi dilakukan lewat entri pembalik, dan entri lama ditandai dikoreksi, bukan dihapus dari riwayat
- Lampiran bukti berupa gambar atau PDF
- Audit trail: siapa membuat, siapa terakhir mengubah dan kapan

Daftar kategori dan saldo awal tiap buku: `TBD (Grace)`.

Acceptance criteria:

- Entri masuk 500.000 pada buku operasional menaikkan saldo buku itu sebesar 500.000, dan saldo kas tim tidak berubah
- Nominal nol atau negatif ditolak
- Entri yang dikoreksi tetap terlihat di riwayat bersama entri pembaliknya
- Team Member tidak bisa membuat entri di kas operasional

### Financial Reporting

Laporan yang dihitung dari entri cash book, sehingga tidak ada input angka terpisah.

Kebutuhan:

- Laporan harian: saldo awal hari, total masuk, total keluar, saldo akhir dan rincian entri
- Laporan bulanan: rekap per kategori, total masuk, total keluar, saldo awal bulan dan saldo akhir bulan
- Pilihan lingkup laporan: kas operasional, kas tim atau gabungan keduanya
- Ekspor ke CSV, `Asumsi` PDF menyusul setelah CSV jalan
- Angka laporan selalu cocok dengan jumlah entri di periode yang sama

Format laporan yang biasa dipakai dan kebutuhan approval: `TBD (Grace)`.

Acceptance criteria:

- Saldo akhir laporan harian sama dengan saldo awal laporan hari berikutnya
- Total masuk dikurangi total keluar pada laporan bulanan sama dengan selisih saldo awal dan saldo akhir bulan
- Laporan gabungan sama dengan jumlah laporan kas operasional dan kas tim
- Entri yang dikoreksi tidak dihitung dua kali

## Content model

Ditulis sebagai entitas dan field, bukan skema database atau schema CMS tertentu, karena stack belum dipilih. Setiap entitas diasumsikan punya `id`, `created_at` dan `updated_at`.

- **SiteSetting**: `site_name`, `logo`, `favicon`, `default_meta_title`, `default_meta_description`, `contact_address`, `contact_email`, `contact_phone`, `social_links`
- **MenuItem**: `key`, `label`, `path`, `is_mandatory`, `is_enabled`, `order`. Item mandatory punya `is_mandatory` true dan `is_enabled` yang tidak bisa diubah
- **HomeSection**: `type`, `title`, `body`, `media`, `cta_label`, `cta_url`, `order`, `status`
- **NewsPost**: `title`, `slug`, `excerpt`, `body`, `cover`, `status`, `published_at`, relasi ke `NewsCategory` dan `TeamMember` sebagai penulis
- **NewsCategory**: `name`, `slug`, `description`
- **Player**: `ign`, `real_name`, `role`, `photo`, `joined_at`, `left_at`, `is_active`, `social_links`, `order`
- **Tournament**: `name`, `organizer`, `season`, `year`
- **Match**: `tournament` ke `Tournament`, `stage`, `scheduled_at`, `status` bernilai jadwal atau selesai, `placement`, `points`, `wwcd_count`, `location`, `recap` ke `NewsPost`
- **PlayerStat**: `player` ke `Player`, `tournament` ke `Tournament`, `matches_played`, `kills`, `average_placement`
- **MediaKitAsset**: `name`, `description`, `group`, `file`, `file_type`, `file_size`, `order`
- **Partner**: `name`, `logo`, `description`, `website_url`, `group`, `order`
- **ContactMessage**: `name`, `email`, `subject`, `message`, `status`, `ip_address`, `handled_by`
- **TeamMember**: `name`, `email`, `roles`, `is_active`, `avatar`
- **ScheduleEvent**: `title`, `start_at`, `end_at`, `is_all_day`, `location`, `notes`, `owner` ke `TeamMember`, `attendees` many to many ke `TeamMember`
- **CashBook**: `name`, `type` bernilai operasional atau tim, `opening_balance`, `currency`
- **CashEntry**: `cash_book` ke `CashBook`, `date`, `direction` bernilai masuk atau keluar, `amount`, `category` ke `ExpenseCategory`, `description`, `attachment`, `recorded_by` ke `TeamMember`, `corrects_entry` ke `CashEntry` untuk entri pembalik, `is_corrected`
- **ExpenseCategory**: `name`, `direction`, `is_active`

Relasi yang menentukan perilaku:

```mermaid
erDiagram
  CashBook ||--o{ CashEntry : "berisi"
  ExpenseCategory ||--o{ CashEntry : "mengelompokkan"
  TeamMember ||--o{ CashEntry : "mencatat"
  TeamMember ||--o{ ScheduleEvent : "memiliki"
  TeamMember }o--o{ ScheduleEvent : "hadir"
  NewsCategory ||--o{ NewsPost : "mengelompokkan"
  TeamMember ||--o{ NewsPost : "menulis"
  Tournament ||--o{ Match : "menaungi"
  NewsPost |o--o{ Match : "merekap"
  Player ||--o{ PlayerStat : "punya"
  Tournament ||--o{ PlayerStat : "mencatat"
```

`Player` sengaja dipisah dari `TeamMember`. `TeamMember` adalah orang yang punya akses login ke area internal, sementara `Player` adalah pemain yang tampil di roster publik, dan keduanya tidak selalu orang yang sama.

Laporan keuangan tidak punya entitas sendiri. Angkanya selalu dihitung dari `CashEntry`, sehingga tidak ada dua sumber angka yang bisa berbeda.

## Kualitas non-fungsional

**SEO dan metadata.** Setiap halaman publik punya title, description dan Open Graph image yang bisa diatur per halaman, dengan fallback ke `SiteSetting`. Sitemap dan `robots.txt` dihasilkan otomatis dan hanya memuat halaman yang aktif. Artikel News punya structured data.

**Performa.** Target LCP di bawah 2,5 detik pada koneksi 4G untuk Home dan halaman detail News. Gambar dioptimalkan dan diberi lazy loading di bawah lipatan.

**Aksesibilitas dan UI.** Mengikuti skill `better-accessibility` dan `better-interface` di `.cursor/skills/`. Yang tidak bisa dikompromikan: navigasi lengkap lewat keyboard, focus state yang terlihat, kontras teks yang lolos WCAG AA, label form yang benar dan pengumuman error ke screen reader. Desain menghindari pola AI-default seperti gradasi ungu, tumpukan pill dan layout serba kartu. Token warna beserta rasio kontrasnya yang sudah dihitung ada di design doc, dan itu yang dipakai saat implementasi.

**Audit dan integritas keuangan.** Entri kas tidak dihapus permanen. Setiap perubahan mencatat pelaku dan waktu, dan koreksi selalu berupa entri baru.

**Timezone dan format angka.** Semua waktu disimpan dalam UTC dan ditampilkan dalam `Asia/Jakarta`. Mata uang `Asumsi` IDR, ditampilkan tanpa desimal.

**Keamanan.** Area internal dan CMS wajib login, dengan session yang kedaluwarsa. Unggahan file dibatasi jenis dan ukurannya. Form publik terlindung dari spam.

**Backup.** Database dan file unggahan dibackup harian, dengan retensi `TBD (Grace)`.

## Fase rilis

**MVP**

- Home dengan section yang bisa diatur
- Roster dengan halaman detail pemain
- Matches dengan jadwal dan hasil
- News lengkap dengan kategori dan halaman detail
- Contact dengan form, inbox dan notifikasi email
- Cash book operasional dan kas tim
- Laporan harian
- Login dan peran dasar
- Toggle Y/N untuk menu opsional, karena Roster dan Matches sudah memakainya sejak MVP

Roster dan Matches masuk MVP meski statusnya Use Y/N, karena keduanya yang paling dicari audience dan tanpa itu situsnya kehilangan alasan untuk dikunjungi.

**v1**

- Media Kit dan Partners
- Schedule Team dengan tampilan bulanan dan mingguan
- Laporan bulanan dan rekap per kategori
- Ekspor CSV
- Peringatan jadwal bertumpuk

## Open questions

1. CMS dan database: aplikasi dengan admin sendiri, headless CMS atau CMS siap pakai. Fondasi front-end sudah diputuskan Next.js, TypeScript dan Tailwind, tapi sisi CMS-nya belum
2. Hosting dan domain, termasuk lokasi penyimpanan file unggahan
3. Autentikasi area internal: email dan password, atau login lewat penyedia identitas
4. Multi-bahasa: apakah situs perlu Bahasa Indonesia dan Inggris sejak awal
5. Alur approval konten: apakah Editor bisa langsung terbit atau perlu persetujuan Admin
6. Approval laporan keuangan: apakah laporan bulanan perlu ditutup dan dikunci
7. Retensi pesan Contact dan siapa penanggung jawab balasan
8. Kebutuhan analytics dan tool yang dipakai
9. Sumber data jadwal dan hasil pertandingan: diisi manual oleh Editor, atau diambil dari sumber lain
10. Ketersediaan foto pemain dan foto tim, termasuk siapa yang mengambil dan menyeragamkan gayanya

## Ruang tambahan

Bagian di bawah ini menunggu isi dari Grace.

### Daftar pemain dan role

`TBD (Grace)`

### Turnamen dan hasil yang mau ditampilkan

`TBD (Grace)`

### Kategori News

`TBD (Grace)`

### Isi Media Kit

`TBD (Grace)`

### Kriteria dan daftar Partners

`TBD (Grace)`

### Kanal Contact

`TBD (Grace)`

### Kategori pemasukan dan pengeluaran

`TBD (Grace)`

### Anggota tim dan perannya

`TBD (Grace)`
