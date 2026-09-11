# Desain CMS kategori: hub kiri, ikon kembali

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Dari rangkuman Grace: hub `/cms/kategori` jangan di tengah; tombol kembali pakai ikon di samping judul (`← TURNAMEN`), bukan teks “Kembali ke kategori”.

## Keputusan

Hub tiga tautan (Turnamen, Kategori kas, Kategori berita) rata kiri di kolom utama. Tidak `mx-auto`. `max-w-xl` boleh supaya kartu tidak meregang selebar viewport.

Halaman detail (`/cms/kategori/turnamen`, `/kas`, `/berita`) memakai satu heading: tautan ikon panah kiri + `h2` judul. Ikon `currentColor`, stroke 2px (judul display), hit 44px, `aria-label="Kembali ke kategori"`, SVG `aria-hidden`. Flip `rtl:-scale-x-100`. Tidak ada teks “Kembali ke kategori” yang terlihat.

Komponen bersama `KategoriJudul` di `web/components/admin/kategori-judul.tsx`.

## Tes

- Hub: tiga tautan, tidak `mx-auto`
- Tiga halaman detail: `KategoriJudul`, `aria-label="Kembali ke kategori"`, `<svg`, tidak teks tautan `Kembali ke kategori`

## Di luar lingkup

Hapus/nonaktif, lebar-penuh shell, paket peran (#11).
