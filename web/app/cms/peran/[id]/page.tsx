import { notFound } from 'next/navigation'
import { deleteRole, saveGrants } from '@/app/cms/peran/actions'
import { KELAS_FOKUS } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can, type AccessAction, type GrantMatrix } from '@/lib/auth/grants'
import { ACCESS_MODULES } from '@/lib/auth/modules'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

const GRANT_ACTIONS: { id: AccessAction; label: string }[] = [
  { id: 'view', label: 'Lihat' },
  { id: 'create', label: 'Tambah' },
  { id: 'update', label: 'Ubah' },
  { id: 'delete', label: 'Hapus' },
]

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
      <header>
        <h2 className="font-display text-section uppercase">{role.name}</h2>
        <p className="mt-3 max-w-2xl text-body text-content-secondary">
          {terkunci
            ? 'Peran Admin tidak bisa dikurangi.'
            : 'Centang hak per modul. Aksi tulis tanpa lihat diabaikan.'}
        </p>
      </header>

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

      <form action={saveGrants} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={role.id} />
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
              {ACCESS_MODULES.map((modul) => (
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
