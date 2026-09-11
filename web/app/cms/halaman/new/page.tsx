import { createPage } from '@/app/cms/halaman/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'

export default async function NewHalamanPage({
  searchParams,
}: {
  searchParams: Promise<{ kesalahan?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'create')
  const params = await searchParams

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header>
        <h2 className="font-display text-section uppercase">Halaman baru</h2>
        <p className="mt-3 text-body text-content-secondary">
          Halaman kustom tampil di /slug setelah terbit dan dinyalakan.
        </p>
      </header>

      {params.kesalahan === 'slug' ? (
        <p role="alert" className="text-body text-danger">
          Slug tidak tersedia.
        </p>
      ) : null}

      <form action={createPage} className="flex flex-col gap-6">
        <Field id="title" label="Judul">
          <input id="title" name="title" required className={KELAS_KONTROL} />
        </Field>
        <Field id="slug" label="Slug" hint="Huruf kecil dan tanda hubung. Kosongkan untuk isi dari judul.">
          <input id="slug" name="slug" className={KELAS_KONTROL} />
        </Field>
        <Field id="status" label="Status">
          <select id="status" name="status" defaultValue="draft" className={KELAS_KONTROL}>
            <option value="draft">Draf</option>
            <option value="published">Terbit</option>
          </select>
        </Field>
        <label className="flex min-h-11 items-center gap-3">
          <input
            id="showInNav"
            name="showInNav"
            type="checkbox"
            defaultChecked
            className="size-5 accent-accent"
          />
          <span className="font-display text-label uppercase">Tampil di navigasi</span>
        </label>
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  )
}
