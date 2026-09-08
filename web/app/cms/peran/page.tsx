import Link from 'next/link'
import { copyTemplate, createRole, deleteRole } from '@/app/cms/peran/actions'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function CmsPeranPage({
  searchParams,
}: {
  searchParams: Promise<{ kesalahan?: string }>
}) {
  const user = await requireCmsUser()
  requireGrant(user, 'peran', 'view')
  const params = await searchParams
  const bisaTambah = can(user.matrix, 'peran', 'create')
  const bisaHapus = can(user.matrix, 'peran', 'delete')

  const roles = await prisma.accessRole.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="flex flex-col gap-16">
      <header>
        <h2 className="font-display text-section uppercase">Peran</h2>
        <p className="mt-3 max-w-2xl text-body text-content-secondary">
          Hak pengguna adalah gabungan semua peran yang ditugaskan. Peran Admin tidak bisa dihapus
          atau dikurangi.
        </p>
      </header>

      {params.kesalahan === 'nama' ? (
        <p role="alert" className="text-body text-danger">
          Nama peran sudah dipakai.
        </p>
      ) : null}
      {params.kesalahan === 'hapus' ? (
        <p role="alert" className="text-body text-danger">
          Peran Admin tidak bisa dihapus.
        </p>
      ) : null}

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Daftar peran</h3>
        {roles.length === 0 ? (
          <p className="text-content-secondary">Belum ada peran.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {roles.map((role) => (
              <li
                key={role.id}
                className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <Link
                    href={`/cms/peran/${role.id}`}
                    className={`font-display text-body font-semibold text-accent underline ${KELAS_FOKUS}`}
                  >
                    {role.name}
                  </Link>
                  <span className="text-small text-content-muted">{role.slug}</span>
                  {role.isAdmin ? <span className="text-small text-content-muted">Admin</span> : null}
                </div>
                {!role.isAdmin && bisaHapus ? (
                  <form action={deleteRole}>
                    <input type="hidden" name="id" value={role.id} />
                    <Button type="submit" variant="destructive">
                      Hapus
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {bisaTambah ? (
        <section className="flex flex-col gap-6">
          <h3 className="font-display text-card uppercase">Tambah peran</h3>
          <form action={createRole} className="flex max-w-xl flex-col gap-4">
            <Field id="peran-name" label="Nama">
              <input id="peran-name" name="name" required className={KELAS_KONTROL} />
            </Field>
            <Button type="submit">Tambah peran</Button>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" formAction={copyTemplate} name="template" value="editor" variant="secondary">
                Salin Editor
              </Button>
              <Button type="submit" formAction={copyTemplate} name="template" value="team" variant="secondary">
                Salin Team
              </Button>
              <Button type="submit" formAction={copyTemplate} name="template" value="finance" variant="secondary">
                Salin Finance
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
