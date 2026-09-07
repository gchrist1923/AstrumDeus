# Desain UI/UX Astrum Deus

Spesifikasi desain untuk situs publik dan area internal Astrum Deus. Dokumen ini hasil brainstorming yang sudah disetujui Grace pada 7 September 2026, dan menjadi rujukan tunggal saat implementasi UI.

## Konteks

Astrum Deus adalah tim esports PUBG Mobile. Audiensnya pemain PUBG Mobile dan orang yang mengikuti dunia esports, bukan pembeli produk atau klien korporat. Konsekuensinya, yang paling dicari pengunjung adalah roster dan hasil pertandingan, sementara sponsor menilai tim dari prestasi lebih dulu sebelum melihat media kit.

Repo masih greenfield. Belum ada kode aplikasi, sehingga spesifikasi ini menentukan fondasi visual dari nol.

## Keputusan yang sudah diambil

| Topik | Keputusan |
| --- | --- |
| Fondasi front-end | Next.js App Router, TypeScript, Tailwind |
| Arah visual | Gelap monokrom dengan aksen emas, dipakai di seluruh situs |
| Cakupan | Situs publik dan area internal, satu bahasa visual, implementasi bertahap |
| Prioritas perangkat | Mobile-first |
| Bahasa antarmuka | Bahasa Indonesia |

## Identitas

Logo tersedia dalam dua versi PNG transparan beresolusi 6001x6000: versi gelap `#212121` dan versi terang `#FFFFFF`. Bentuknya monogram AD dengan potongan diagonal tajam pada huruf A, dilengkapi wordmark sans geometris tebal.

Brand aslinya murni monokrom tanpa warna aksen. Aksen emas yang dipakai di spesifikasi ini adalah tambahan fungsional, bukan bagian dari logo, sehingga logo tidak pernah diwarnai emas.

## Rujukan mockup

Mockup halaman Home dari arah visual yang dipilih tersimpan di `docs/superpowers/specs/mockups/home-arah-c.html`, dan dipakai sebagai acuan saat menyetel spasi serta ukuran huruf.

Berkas itu tidak bisa dibuka langsung lewat `file://` di browser Cursor, jadi jalankan dulu static server dari dalam foldernya:

```powershell
cd docs/superpowers/specs/mockups
python -m http.server 8932 --bind 127.0.0.1
```

Setelah itu buka `http://127.0.0.1:8932/home-arah-c.html`.

Warna di mockup masih memakai nilai sebelum koreksi kontras, sehingga token di dokumen ini yang berlaku bila keduanya berbeda.

Mockup itu bukan kode produksi. Ia memakai CSS biasa, sementara implementasi memakai Tailwind. Foto di dalamnya placeholder hasil generate dan sudah dikompres, sehingga bukan aset final.

## Fondasi visual

### Token warna

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `surface-base` | `#171717` | Latar halaman |
| `surface-raised` | `#212121` | Kartu, baris hasil, panel |
| `surface-overlay` | `#2A2A2A` | Dropdown, panel samping, input |
| `border` | `#383838` | Garis pemisah dekoratif |
| `border-strong` | `#7C7C7C` | Bingkai input dan kontrol |
| `content-primary` | `#FFFFFF` | Judul dan teks utama |
| `content-secondary` | `#BCBCBC` | Paragraf pendukung |
| `content-muted` | `#9B9B9B` | Label dan keterangan |
| `accent` | `#F0B429` | Live, CTA utama, penanda juara, role, angka kunci |
| `accent-strong` | `#C68A15` | Hover dan garis aksen |
| `accent-soft` | `#FFD166` | Teks emas ukuran kecil |
| `danger` | `#FF6369` | Teks dan ikon peringatan, saldo minus, pengeluaran |
| `danger-solid` | `#C62828` | Latar tombol aksi merusak, dipasangkan teks putih |
| `danger-strong` | `#9E1F1F` | Latar tombol aksi merusak saat hover, dipasangkan teks putih |

Rasio kontras di atas `surface-raised` sudah dihitung, bukan diperkirakan: `accent` 8,6:1, `accent-soft` 11,2:1, `accent-strong` 5,4:1, `content-secondary` 8,5:1, `content-muted` 5,8:1, `danger` 5,6:1. Teks putih di atas `danger-solid` memberi 5,6:1. Semuanya lolos WCAG AA untuk teks ukuran normal.

Warna teks pendukung ditulis sebagai hex solid, bukan putih dengan opacity. Nilai `rgba` menghasilkan kontras yang berubah mengikuti latar di belakangnya, sehingga tidak bisa dijamin lolos AA dan tidak bisa diuji otomatis. `#BCBCBC` dan `#9B9B9B` adalah hasil komposit dari opacity 70 dan 55 persen di atas `surface-raised`, jadi tampilannya sama tetapi nilainya pasti.

`border` sengaja dipisah dari `border-strong`. `border` hanya 1,4:1 terhadap `surface-raised`, cukup untuk garis pemisah dekoratif tetapi tidak memenuhi syarat 3:1 untuk batas kontrol. Setiap input, checkbox dan tombol bergaris memakai `border-strong`, yang mencapai 3,4:1 di atas `surface-overlay`, 3,9:1 di atas `surface-raised` dan 4,3:1 di atas `surface-base`.

Empat nilai di sini hasil koreksi saat review. `content-muted` semula opacity 45 persen yang hanya mencapai 4,4:1, `danger` semula `#E5484D` yang hanya mencapai 4,1:1, dan batas kontrol semula memakai `border`. Ketiganya gagal memenuhi WCAG AA padahal dipakai di label 12px, angka pengeluaran dan bingkai input, jadi nilainya diperbaiki.

Koreksi keempat muncul saat implementasi. `border-strong` semula `#6B6B6B`, yang lolos 3:1 di atas `surface-base` dan `surface-raised` tetapi hanya mencapai 2,7:1 di atas `surface-overlay`. Karena `surface-overlay` justru latar tempat input berada, bingkai input di kondisi nyatanya gagal memenuhi syarat, sementara test saat itu tidak memeriksa pasangan tersebut sehingga kegagalannya tidak terlihat. Nilainya dinaikkan ke `#7C7C7C` supaya ketiga latar punya kelonggaran, bukan sekadar lolos tipis, dan pasangan `border-strong` di atas `surface-overlay` kini ikut diuji.

### Tipografi

Display memakai Chakra Petch bobot 700, dipilih karena sudut potongnya mengikuti diagonal huruf A pada logo. Teks memakai Barlow bobot 400 sampai 600. Kombinasi ini menghindari Inter dan Roboto yang sudah menjadi tampilan default dan tidak membawa karakter apa pun.

| Peran | Ukuran | Catatan |
| --- | --- | --- |
| Display hero | `clamp(54px,9.5vw,132px)` | Uppercase, `line-height` 0.9 |
| Judul halaman | `clamp(40px,6vw,72px)` | Uppercase |
| Judul section | `clamp(30px,4.2vw,52px)` | Uppercase |
| Judul kartu | 24px | Sentence case |
| Teks isi | 17px, `line-height` 1.55 | 19px pada halaman artikel |
| Teks kecil | 14px | Keterangan dan metadata |
| Label | 12px, `letter-spacing` .16em | Uppercase |

Semua angka memakai `font-variant-numeric: tabular-nums` supaya kolom poin, WWCD dan rupiah tetap lurus antar baris. Lebar baris teks artikel dibatasi 68 karakter.

### Geometri dan spasi

Radius sudut 0 di seluruh antarmuka, mengikuti logo yang sepenuhnya bersudut tajam. Motif diagonal hanya muncul di dua tempat supaya terasa disengaja: potongan 14px pada tombol utama, dan potongan 6% pada tepi bawah foto.

Skala spasi: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Container maksimum 1240px dengan gutter 32px di desktop dan 20px di ponsel. Breakpoint 640px, 960px dan 1240px.

## Situs publik

### Struktur menu

| Halaman | Status | Membuka dengan |
| --- | --- | --- |
| Home | Wajib | Foto tim, tiga angka kunci, hasil terakhir |
| News | Wajib | Artikel terbaru |
| Contact | Wajib | Form dengan pilihan tujuan |
| Roster | Toggle Y/N | Grid pemain aktif beserta role |
| Matches | Toggle Y/N | Jadwal terdekat, lalu riwayat hasil |
| Media Kit | Toggle Y/N | Grup aset yang bisa diunduh |
| Partners | Toggle Y/N | Sponsor per tingkatan |

Halaman wajib tidak punya toggle sama sekali. Halaman toggle dikendalikan Admin dari CMS.

### Perilaku saat toggle dimatikan

Mematikan satu halaman harus menghilangkan seluruh jejaknya, bukan menyisakan tautan yang menuju halaman kosong:

- Item hilang dari navigasi utama dan footer
- Route halaman membalas 404
- Halaman keluar dari sitemap
- Section terkait di Home ikut hilang: cuplikan roster hilang saat Roster mati, section hasil hilang saat Matches mati, strip partner hilang saat Partners mati
- Tautan dari artikel News ke halaman yang mati berubah jadi teks biasa, bukan tautan mati
- Konten tetap tersimpan, sehingga menyalakan ulang tidak perlu input ulang

### Navigasi

Header publik menempel di atas saat halaman digulir, dengan latar semi transparan dan blur, sehingga menu tetap terjangkau di halaman panjang seperti arsip berita.

Di bawah 960px menu berubah menjadi tombol bertuliskan Menu yang membuka panel penuh layar, bukan ikon tiga garis tanpa label. Panel bisa ditutup dengan Escape, fokus terkurung di dalamnya selama terbuka, dan kembali ke tombol pemicunya saat ditutup.

Halaman yang sedang dibuka ditandai garis emas di bawah item menu sekaligus atribut `aria-current`, jadi penandanya tidak bergantung pada warna. Menu hanya memuat halaman yang sedang aktif menurut toggle.

### Home

Satu komposisi per layar, bukan tumpukan kartu seragam. Urutan section: bar live, hero, hasil terakhir, cuplikan roster, berita terbaru, strip partner.

Bar live hanya muncul ketika ada pertandingan berlangsung atau jadwal terdekat. Ketika tidak ada, bar dihilangkan sepenuhnya dan tidak diganti pesan kosong.

Hero memuat foto tim, wordmark sebagai headline, dua tombol aksi, dan tiga angka kunci berupa jumlah gelar, jumlah turnamen dan total WWCD.

### Roster

Grid pemain aktif dengan foto, IGN dan role. Role yang dipakai mengikuti istilah PUBG Mobile: IGL, Assaulter, Sniper, Support dan Filter.

Halaman detail pemain memuat foto, IGN, role, tanggal gabung, statistik per turnamen dan tautan media sosial. Mantan pemain tampil di section terpisah di bagian bawah, sehingga sejarah tim tersimpan tanpa mengaburkan roster aktif.

### Matches

Jadwal dan hasil dipisah. Tiap baris memuat nama turnamen, tahap, tanggal dengan zona WIB, posisi akhir, poin, jumlah WWCD, dan tautan ke artikel recap bila ada. Tersedia filter per tahun dan per turnamen.

Posisi juara ditandai emas, tetapi angka posisinya tetap tertulis, sehingga penandanya tidak bergantung pada warna.

### News

Tetap berlatar gelap seperti halaman lain. Kenyamanan membaca dicapai lewat ukuran teks 19px, lebar baris 68 karakter dan jarak antar baris yang longgar, bukan dengan berganti ke latar terang.

Artikel punya judul, ringkasan, isi rich text, cover, kategori, penulis dan tanggal publish, dengan status draft serta jadwal publish.

### Media Kit

Aset dikelompokkan menjadi logo, warna, foto dan tipografi. Setiap aset menampilkan jenis dan ukuran file sebelum diunduh. Halaman ini juga memuat aturan pemakaian logo, termasuk larangan mewarnai logo dengan emas.

### Partners

Logo sponsor ditempatkan di atas plat putih. Ini keputusan praktis: logo sponsor umumnya dibuat untuk latar terang dan akan tenggelam bila ditempel langsung pada latar gelap. Sponsor dikelompokkan per tingkatan kerja sama.

### Contact

Form memuat nama, email, tujuan dan pesan. Pilihan tujuan: kerja sama sponsor, media dan pers, tryout pemain, atau lainnya. Pilihan tryout memisahkan pesan calon pemain dari tawaran sponsor, yang tanpa itu akan tercampur dalam satu kotak masuk.

Validasi berjalan di server, pesan error tampil per field, dan isi form tidak hilang saat gagal terkirim.

## Area internal

Area internal berada di belakang login dan tidak terindeks mesin pencari. Token warnanya sama dengan situs publik, tetapi karakternya sengaja dibedakan karena ini aplikasi kerja harian, bukan halaman promosi.

Halaman login memakai satu komposisi terpusat berisi logo, form dan pesan error, tanpa foto besar. Pesan error tidak menyebutkan apakah email atau kata sandinya yang salah.

Tidak ada foto besar dan tidak ada tipografi raksasa. Kepadatan naik: teks 15px, tinggi baris tabel 44px, angka rata kanan dengan lebar digit seragam. Navigasi berupa sidebar kiri yang tetap terlihat, karena pengguna berpindah antara jadwal, kas dan laporan sepanjang hari. Chakra Petch hanya dipakai untuk angka besar di ringkasan.

### Schedule Team

Tampilan bulanan sebagai default, dengan tampilan mingguan untuk hari yang padat scrim. Event tampil sebagai chip berisi jam dan penanggung jawab. Tersedia filter per anggota dan tombol jadwal saya.

Jadwal yang bertumpuk memunculkan peringatan inline di form, tetapi tidak memblokir simpan, karena scrim dan latihan kadang memang sengaja beririsan. Navigasi kalender bisa dilakukan dengan tombol panah keyboard, tidak hanya klik.

### Pencatatan kas

Dua buku terpisah, kas operasional dan kas tim, masing-masing dengan saldo berjalan yang dihitung dari entri dan tidak bisa diedit langsung.

Form entri tampil sebagai panel samping, bukan modal, sehingga tabel di belakangnya tetap terlihat saat mengisi. Arah uang ditandai tiga lapis: tanda plus atau minus, label Masuk atau Keluar, lalu warna emas atau merah sebagai lapis terakhir.

Koreksi tidak menghapus. Entri yang salah ditandai, dan entri pembaliknya tampil bertaut ke entri asal, sehingga riwayat tetap utuh dan laporan tidak menghitung dua kali. Tombol hapus permanen tidak disediakan untuk entri kas.

### Laporan

Laporan harian dan bulanan dibuka dengan empat angka ringkasan: saldo awal, total masuk, total keluar dan saldo akhir. Di bawahnya rincian per entri untuk laporan harian, atau rekap per kategori untuk laporan bulanan.

Tersedia pemilih lingkup berupa kas operasional, kas tim atau gabungan keduanya, plus ekspor CSV.

### Perilaku di ponsel

Area internal tetap dipakai dari ponsel, terutama untuk mencatat pengeluaran saat berada di lokasi turnamen. Form entri kas dirancang mobile-first, dan tabel berubah menjadi baris bertumpuk alih-alih tabel yang harus digeser ke samping.

## Inventaris komponen

Komponen berikut dipakai ulang di banyak halaman, jadi dibuat sekali dengan varian alih-alih dibuat ulang tiap halaman.

Situs publik: Header, LiveBar, Hero, StatTrio, MatchRow dengan varian jadwal dan hasil, PlayerCard, PlayerDetail, ArticleCard, ArticleBody, AssetCard, PartnerPlate, ContactForm, Footer, EmptyState, ErrorState dan Skeleton.

Area internal: Sidebar, PageHeader beserta aksinya, DataTable yang berubah jadi baris bertumpuk di ponsel, SidePanelForm, MoneyAmount yang membawa tanda dan label sekaligus warna, BalanceSummary, CalendarMonth, CalendarWeek, EventChip, ScopeSwitcher, DateRangePicker, ConfirmDialog dan Toast.

Tombol punya tiga varian: primary berlatar emas, sekunder bergaris, dan destruktif berlatar `danger-solid`. Area sentuh minimal 44x44px di ponsel, termasuk untuk ikon kecil seperti tombol tutup.

## Aturan yang tidak bisa dikompromikan

Diturunkan dari skill `better-accessibility` dan `better-interface` di `.cursor/skills/`:

- Warna tidak pernah menjadi satu-satunya pembawa makna. Status live, posisi juara dan arah uang selalu punya label atau ikon pendamping
- Setiap kontrol interaktif punya nama yang terbaca screen reader
- Setiap kontrol yang bisa dijangkau keyboard punya focus state yang terlihat
- Semua alur bisa diselesaikan dengan keyboard saja
- Kontras teks isi dan kontrol lolos WCAG AA
- Animasi dan konten bergerak menghormati `prefers-reduced-motion`, dan perubahan status tidak pernah dibawa oleh gerak saja
- Tidak ada konten atau kontrol yang terpotong pada lebar 320px atau zoom 200 persen
- Aksi merusak punya konfirmasi atau pembatalan
- Konten terpotong selalu punya cara untuk melihat nilai penuhnya
- Setiap error menyebutkan cara memperbaikinya

## Pagar anti tampilan generik

- Tanpa gradasi ungu, tanpa kombinasi krem dengan serif dan terakota, tanpa tumpukan pill
- Tanpa glow berlebihan meski temanya gelap
- Bukan layout serba kartu seragam. Hasil pertandingan memakai baris tabel, bukan kartu
- Aksen emas dibatasi peran fungsional dan tidak dipakai sebagai dekorasi latar
- Foto asli tim menjadi jangkar visual utama, bukan gradasi hias

## Keadaan kosong, memuat dan gagal

Setiap daftar dirancang untuk tiga keadaan, karena di awal banyak data yang memang masih kosong:

- Kosong menjelaskan apa yang akan tampil di situ dan siapa yang bisa mengisinya, tanpa kalimat basa-basi
- Memuat memakai skeleton dengan bentuk yang sama seperti isi sebenarnya, bukan spinner di tengah layar
- Gagal memuat menyebutkan apa yang gagal dan menyediakan tombol coba lagi

## Di luar scope spesifikasi ini

Hal berikut tidak dibahas di sini dan tidak menghambat implementasi UI, karena tahap UI memakai konten dummy:

- Pilihan CMS, database dan penyedia autentikasi
- Sumber data jadwal serta hasil pertandingan, apakah diisi manual atau diambil dari sumber lain
- Hosting, domain dan lokasi penyimpanan file
- Foto pemain dan foto tim asli. Mockup memakai foto placeholder hasil generate

## Perubahan terhadap PRD

Spesifikasi ini mengubah tiga hal dari `issue.md`:

1. Menambah dua halaman yang tidak ada di PRD, yaitu Roster dan Matches
2. Mengubah status Roster dan Matches menjadi toggle Y/N, sehingga menu wajib tinggal Home, News dan Contact
3. Mengisi identitas yang di PRD masih ditandai TBD, yaitu bidang esports PUBG Mobile, audiens dan arah visual

`issue.md` sudah disinkronkan dengan ketiga perubahan itu, termasuk entitas `Player`, `Tournament`, `Match` dan `PlayerStat` di content model, serta masuknya Roster dan Matches ke MVP.
