import {
  createCashCategory,
  createNewsCategory,
  createTournament,
  deactivateCashCategory,
  deactivateNewsCategory,
  deactivateTournament,
} from '@/app/cms/kategori/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function CmsKategoriPage({
  searchParams,
}: {
  searchParams: Promise<{ kesalahan?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'kategori', 'view')
  const params = await searchParams
  const bisaTulis = can(user.matrix, 'kategori', 'create') || can(user.matrix, 'kategori', 'update')

  const [tournaments, cashCategories, newsCategories] = await Promise.all([
    prisma.tournament.findMany({ orderBy: { name: 'asc' } }),
    prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.newsCategory.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="flex flex-col gap-16">
      <header>
        <h2 className="font-display text-section uppercase">Kategori</h2>
        <p className="mt-3 max-w-2xl text-body text-content-secondary">
          Kategori nonaktif hilang dari form baru. Data lama tetap memakai nama ini.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Turnamen</h3>
        {tournaments.length === 0 ? (
          <p className="text-content-secondary">Belum ada turnamen.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {tournaments.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3"
              >
                <div>
                  <p className="font-display text-body font-semibold">{item.name}</p>
                  <p className="text-small text-content-muted">
                    {item.organizer} · {item.season} · {item.year} · {item.isActive ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
                {bisaTulis && item.isActive ? (
                  <form action={deactivateTournament}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="secondary">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {bisaTulis ? (
          <form action={createTournament} className="flex max-w-xl flex-col gap-4">
            <h4 className="font-display text-label uppercase text-accent">Tambah turnamen</h4>
            <Field id="turnamen-name" label="Nama">
              <input id="turnamen-name" name="name" required className={KELAS_KONTROL} />
            </Field>
            <Field id="turnamen-organizer" label="Penyelenggara">
              <input id="turnamen-organizer" name="organizer" required className={KELAS_KONTROL} />
            </Field>
            <Field id="turnamen-season" label="Musim">
              <input id="turnamen-season" name="season" required className={KELAS_KONTROL} />
            </Field>
            <Field id="turnamen-year" label="Tahun">
              <input id="turnamen-year" name="year" type="number" required className={KELAS_KONTROL} />
            </Field>
            <Button type="submit">Tambah turnamen</Button>
          </form>
        ) : null}
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Kategori kas</h3>
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
                {bisaTulis && item.isActive ? (
                  <form action={deactivateCashCategory}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="secondary">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {bisaTulis ? (
          <form action={createCashCategory} className="flex max-w-xl flex-col gap-4">
            <h4 className="font-display text-label uppercase text-accent">Tambah kategori kas</h4>
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
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Kategori berita</h3>
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
                {bisaTulis && item.isActive ? (
                  <form action={deactivateNewsCategory}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="secondary">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {bisaTulis ? (
          <form action={createNewsCategory} className="flex max-w-xl flex-col gap-4">
            <h4 className="font-display text-label uppercase text-accent">Tambah kategori berita</h4>
            {params.kesalahan === 'nama' ? (
              <p role="alert" className="text-body text-danger">
                Nama kategori sudah dipakai.
              </p>
            ) : null}
            <Field id="berita-name" label="Nama">
              <input id="berita-name" name="name" required className={KELAS_KONTROL} />
            </Field>
            <Button type="submit">Tambah kategori berita</Button>
          </form>
        ) : null}
      </section>
    </div>
  )
}
