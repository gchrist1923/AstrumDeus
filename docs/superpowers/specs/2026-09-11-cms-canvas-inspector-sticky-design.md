# Desain CMS: inspector kanvas sticky

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Dari rangkuman Grace: inspector blok terpilih harus mengikuti gulir seperti palet. Palet sudah `lg:sticky lg:top-4`; kolom **Blok dipilih** tidak, jadi field lebar/pindah/hapus hilang saat tampilan panjang.

## Keputusan

Aside inspector (heading `Blok dipilih`) memakai kelas yang sama dengan aside palet: `lg:sticky lg:top-4`. Tidak `max-h` / overflow sendiri — perilaku native sticky, sama seperti palet. Hanya aktif di breakpoint `lg` (tiga kolom). Mobile tetap menumpuk.

Tidak mengubah field inspector, palet, atau drop tampilan.

## Tes

- Palet dan inspector: `lg:sticky` dan `lg:top-4` pada `aside` masing-masing.

## Di luar lingkup

Lebar-penuh shell (#lebar), sticky inspector di halaman lain, paket 13–15.
