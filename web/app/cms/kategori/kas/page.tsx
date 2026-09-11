import Link from 'next/link'
import {
  createCashCategory,
  deactivateCashCategory,
  deleteCashCategory,
} from '@/app/cms/kategori/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function CmsKategoriKasPage({
  searchParams,
}: {
  searchParams: Promise<{ kesalahan?: string; n?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'kategori', 'view')
  const params = await searchParams
  const n = Number.parseInt(params.n ?? '0', 10)
  const bisaTulis = can(user.matrix, 'kategori', 'create') || can(user.matrix, 'kategori', 'update')
  const bisaHapus = can(user.matrix, 'kategori', 'delete')
  const cashCategories = await prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Link href="/cms/kategori" className="text-small text-content-secondary underline">
          Kembali ke kategori
        </Link>
        <h2 className="mt-3 font-display text-section uppercase">Kategori kas</h2>
      </header>

      {params.kesalahan === 'pakai' ? (
        <p role="alert" className="text-body text-danger">
          Tidak bisa dihapus. Masih dipakai {n} entri kas.
        </p>
      ) : null}

      {cashCategories.length === 0 ? (
        <p className="text-content-secondary">Belum ada kategori kas.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {cashCategories.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3"
            >
              <div>
                <p className="font-display text-body font-semibold">{item.name}</p>
                <p className="text-small text-content-muted">
                  {item.direction} · {item.isActive ? 'Aktif' : 'Nonaktif'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {bisaTulis && item.isActive ? (
                  <form action={deactivateCashCategory}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="secondary">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
                {bisaHapus ? (
                  <form action={deleteCashCategory}>
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
        <form action={createCashCategory} className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <h3 className="font-display text-label uppercase text-accent">Tambah kategori kas</h3>
          <Field id="kas-name" label="Nama">
            <input id="kas-name" name="name" required className={KELAS_KONTROL} />
          </Field>
          <Field id="kas-direction" label="Arah">
            <select id="kas-direction" name="direction" className={KELAS_KONTROL}>
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </select>
          </Field>
          <Button type="submit">Tambah kategori kas</Button>
        </form>
      ) : null}
    </div>
  )
}
