import {
  createTournament,
  deactivateTournament,
  deleteTournament,
} from '@/app/cms/kategori/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { KategoriJudul } from '@/components/admin/kategori-judul'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function CmsKategoriTurnamenPage({
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
  const tournaments = await prisma.tournament.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="flex flex-col gap-8">
      <KategoriJudul>Turnamen</KategoriJudul>

      {params.kesalahan === 'pakai' ? (
        <p role="alert" className="text-body text-danger">
          Tidak bisa dihapus. Masih dipakai {n} pertandingan atau statistik.
        </p>
      ) : null}

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
              <div className="flex flex-wrap gap-3">
                {bisaTulis && item.isActive ? (
                  <form action={deactivateTournament}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="secondary">
                      Nonaktifkan
                    </Button>
                  </form>
                ) : null}
                {bisaHapus ? (
                  <form action={deleteTournament}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit message="Hapus turnamen ini?" variant="destructive">
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
        <form action={createTournament} className="flex max-w-xl flex-col gap-4">
          <h3 className="font-display text-label uppercase text-accent">Tambah turnamen</h3>
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
    </div>
  )
}
