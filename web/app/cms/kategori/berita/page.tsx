import {
  createNewsCategory,
  deactivateNewsCategory,
  deleteNewsCategory,
} from '@/app/cms/kategori/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { KategoriJudul } from '@/components/admin/kategori-judul'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function CmsKategoriBeritaPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'kategori', 'view')
  const bisaTulis = can(user.matrix, 'kategori', 'create') || can(user.matrix, 'kategori', 'update')
  const bisaHapus = can(user.matrix, 'kategori', 'delete')
  const newsCategories = await prisma.newsCategory.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="flex flex-col gap-8">
      <KategoriJudul>Kategori berita</KategoriJudul>

      {newsCategories.length === 0 ? (
        <p className="text-content-secondary">Belum ada kategori berita.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {newsCategories.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3"
            >
              <div>
                <p className="font-display text-body font-semibold">{item.name}</p>
                <p className="text-small text-content-muted">{item.isActive ? 'Aktif' : 'Nonaktif'}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {bisaTulis && item.isActive ? (
                  <form action={deactivateNewsCategory}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="secondary">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
                {bisaHapus ? (
                  <form action={deleteNewsCategory}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit message="Hapus kategori ini?" variant="destructive">
                      Hapus
                    </ConfirmSubmit>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {bisaTulis ? (
        <form action={createNewsCategory} className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <h3 className="font-display text-label uppercase text-accent">Tambah kategori berita</h3>
          <Field id="berita-name" label="Nama">
            <input id="berita-name" name="name" required className={KELAS_KONTROL} />
          </Field>
          <Button type="submit">Tambah kategori berita</Button>
        </form>
      ) : null}
    </div>
  )
}
