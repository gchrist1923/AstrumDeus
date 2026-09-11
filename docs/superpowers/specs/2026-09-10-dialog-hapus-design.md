# Desain dialog konfirmasi hapus

Mengganti `window.confirm` HTML pada semua aksi Hapus CMS/internal, 10 September 2026. Spec UI 7 September sudah menyebut `ConfirmDialog`.

## Keputusan

Satu komponen dialog merek, bukan popup browser. Dipakai di kotak masuk, kategori (turnamen/kas/berita), dan fitur baru (blok kanvas, halaman kustom, event jadwal).

Kalimat tetap yang sudah ada, misalnya `Hapus pesan ini?`, `Hapus kategori ini?`, `Hapus turnamen ini?`, `Hapus blok ini?`, `Hapus halaman ini?`.

## Perilaku

Overlay gelap, panel `radius 0`, `role="dialog"` `aria-modal="true"`, judul `Hapus`, isi kalimat konfirmasi. Tombol **Batal** (secondary) dan **Hapus** (destructive), hit 44px. Escape dan klik overlay = batal. Fokus masuk dialog saat buka; kembali ke pemicu saat tutup. Form server action hanya tersubmit jika Hapus di dialog ditekan.

`ConfirmSubmit` diubah ke dialog ini (API `message` tetap) supaya pemanggil lama tidak diubah satu-satu kecuali tes.

Tidak ada Toast wajib di paket ini.

## Tes

- Confirm false (Batal / Escape) tidak memanggil submit
- Hapus di dialog memanggil submit
- Tidak ada `window.confirm` di `confirm-submit.tsx`
