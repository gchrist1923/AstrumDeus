# Desain CMS pengguna: form buat, tanpa Simpan peran

11 September 2026. Bahasa UI Indonesia. Token, radius 0, hit 44px mengikuti spec UI 2026-09-07.

Disetujui dari rangkuman Grace: halaman Pengguna untuk buat akun baru; peran dipilih multiple di form itu; tombol Simpan peran per baris dihapus.

## Keputusan

`/cms/users` menaruh form **Pengguna baru** di atas: Nama, Email, Kata sandi, fieldset Peran (checkbox, lebih dari satu), **Tambah pengguna**. `saveUser` sudah menulis banyak `UserAccessRole`.

Daftar di bawah: nama, email, nama peran (teks), status aktif, **Nonaktifkan** / **Aktifkan** (bukan diri sendiri). Tanpa checkbox peran, tanpa `saveUserRoles`.

`saveUserRoles` dihapus. Ubah hak peran tetap di `/cms/peran/[id]`.

## Tes

- `page.tsx`: `saveUser`, `role-`, `Tambah pengguna`, tidak `Simpan peran`, tidak `saveUserRoles`
- `actions.ts`: tidak `saveUserRoles`
- `peran.test.ts` penugasan: checkbox dari AccessRole + `saveUser`, bukan `saveUserRoles`

## Di luar lingkup

Reset kata sandi, edit nama/email, paket peran (#11), menu, inbox.
