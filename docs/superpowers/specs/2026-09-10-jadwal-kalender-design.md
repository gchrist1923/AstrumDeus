# Desain jadwal kalender internal

Kalender bulan untuk `/internal/schedule`, disetujui Grace pada 10 September 2026. Bukan salinan Google Calendar. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Pekerjaan terpisah dari kanvas WYSIWYG.

## Konteks

Sekarang jadwal adalah daftar kartu + form “Event baru”. Spec UI 7 September sudah menyebut kisi bulan, chip jam + pemilik, form panel samping. Ownership `canWriteSchedule` tidak berubah.

## Tampilan

Kisi bulan, Senin–Minggu. Query `?bulan=YYYY-MM` seperti sekarang. Tautan bulan lalu / depan. Hari di luar bulan: sel redup, tetap bisa diklik (pindah `bulan` jika perlu). Hari ini ditandai tanpa mengandalkan warna saja (outline + teks).

Event di sel: chip jam mulai + judul (dipotong). Beberapa event: tampilkan yang muat, sisa `+N`.

Klik **sel kosong** (atau sisa hari): panel kanan mode buat. `startAt` / `endAt` terisi tanggal itu (jam default 09:00–10:00, atau 1 jam dari sekarang jika hari ini). Fokus ke field Judul.

Klik **chip**: panel mode ubah (judul, jam, lokasi, catatan) jika `canWriteSchedule`. Jika tidak, panel baca saja. Hapus tetap destructive + hak tulis.

Form tidak lagi “Event baru” kosong tanpa konteks tanggal. Query `?hari=YYYY-MM-DD` dan opsional `?id=` supaya refresh/share menjaga panel.

Peringatan tumpang tindih (`peringatan=tumpang`) tetap.

## Data

Model `ScheduleEvent` tidak wajib migrasi. Tambah `updateEvent` jika belum ada (sekarang hanya `saveEvent` create + `deleteEvent`).

Filter anggota dan “Jadwal saya” **tidak** di paket ini. Tampilan minggu jam-per-jam **tidak** di paket ini. Drag-buat, undangan, sync Google **tidak**.

## Tes

- Kisi 7 kolom; bulan dengan 31 hari punya sel 31
- `?hari=` mengisi default tanggal form
- `?id=` menampilkan judul event di form
- Chip tidak membuka form ubah untuk user tanpa hak tulis (tetap bisa lihat)
- Overlap warning tidak hilang

## Di luar lingkup

Google OAuth, notifikasi email, tampilan minggu/hari, filter anggota, drag & drop event, zona waktu selain lokal browser/server yang sudah dipakai.
