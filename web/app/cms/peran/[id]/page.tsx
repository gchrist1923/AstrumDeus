import { notFound } from 'next/navigation'
import { deleteRole, saveGrants } from '@/app/cms/peran/actions'
import { KELAS_FOKUS } from '@/components/admin/form-field'
import { PeranJudul } from '@/components/admin/peran-judul'
import { Button } from '@/components/ui/button'
import { can, type AccessAction, type AccessModule, type GrantMatrix } from '@/lib/auth/grants'
import { ACCESS_MODULES } from '@/lib/auth/modules'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

const GRANT_ACTIONS: { id: AccessAction; label: string }[] = [
  { id: 'view', label: 'Lihat' },
  { id: 'create', label: 'Tambah' },
  { id: 'update', label: 'Ubah' },
  { id: 'delete', label: 'Hapus' },
]

const ID_INTERNAL = new Set<AccessModule>(['jadwal', 'kas-operasional', 'kas-tim', 'laporan'])
const MODUL_CMS = ACCESS_MODULES.filter((modul) => !ID_INTERNAL.has(modul.id))
const MODUL_INTERNAL = ACCESS_MODULES.filter((modul) => ID_INTERNAL.has(modul.id))

function TabelHak({
  judul,
  modules,
  matrix,
  terkunci,
}: {
  judul: string
  modules: typeof ACCESS_MODULES
  matrix: GrantMatrix
  terkunci: boolean
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-display text-card uppercase">{judul}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-border-strong text-left">
          <thead>
            <tr className="border-b-2 border-border-strong">
              <th className="px-4 py-3 font-display text-label uppercase">Modul</th>
              {GRANT_ACTIONS.map((action) => (
                <th key={action.id} className="px-4 py-3 font-display text-label uppercase">
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((modul) => (
              <tr key={modul.id} className="border-b border-border-strong">
                <th scope="row" className="px-4 py-3 font-display text-body font-semibold">
                  {modul.label}
                </th>
                {GRANT_ACTIONS.map((action) => (
                  <td key={action.id} className="px-4 py-3">
                    <label className="inline-flex min-h-11 min-w-11 items-center justify-center">
                      <input
                        type="checkbox"
                        name={`${modul.id}-${action.id}`}
                        defaultChecked={matrix[modul.id][action.id]}
                        disabled={terkunci}
                        className={`min-h-11 min-w-11 accent-accent ${KELAS_FOKUS}`}
                      />
                      <span className="sr-only">
                        {action.label} {modul.label}
                      </span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default async function CmsPeranDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ kesalahan?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'peran', 'view')
  const { id } = await params
  const query = await searchParams
  const bisaUbah = can(user.matrix, 'peran', 'update')
  const bisaHapus = can(user.matrix, 'peran', 'delete')

  const role = await prisma.accessRole.findUnique({ where: { id } })
  if (!role) {
    notFound()
  }

  const matrix = JSON.parse(role.grants) as GrantMatrix
  const terkunci = role.isAdmin

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <PeranJudul>{role.name}</PeranJudul>
        <p className="max-w-2xl text-body text-content-secondary">
          {terkunci
            ? 'Peran Admin tidak bisa dikurangi.'
            : 'Centang Lihat supaya menu muncul saat login. Tambah, Ubah, dan Hapus adalah aksi di dalam menu itu. Tulis tanpa lihat diabaikan.'}
        </p>
      </div>

      {query.kesalahan === 'kurangi' ? (
        <p role="alert" className="text-body text-danger">
          Hak Admin tidak bisa dikurangi.
        </p>
      ) : null}
      {query.kesalahan === 'hapus' ? (
        <p role="alert" className="text-body text-danger">
          Peran Admin tidak bisa dihapus.
        </p>
      ) : null}

      <form action={saveGrants} className="flex flex-col gap-10">
        <input type="hidden" name="id" value={role.id} />
        <TabelHak judul="CMS" modules={MODUL_CMS} matrix={matrix} terkunci={terkunci} />
        <TabelHak judul="Internal" modules={MODUL_INTERNAL} matrix={matrix} terkunci={terkunci} />
        {bisaUbah && !role.isAdmin ? <Button type="submit">Simpan hak</Button> : null}
      </form>

      {!role.isAdmin && bisaHapus ? (
        <form action={deleteRole}>
          <input type="hidden" name="id" value={role.id} />
          <Button type="submit" variant="destructive">
            Hapus
          </Button>
        </form>
      ) : null}
    </div>
  )
}
