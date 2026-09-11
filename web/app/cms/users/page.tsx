import { saveUser, toggleUserActive } from '@/app/cms/users/actions'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { parseRoles } from '@/lib/auth/roles'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

function PeranCheckboxes({ roles }: { roles: { id: string; name: string }[] }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-display text-label uppercase text-content-muted">Peran</legend>
      {roles.map((role) => {
        const id = `baru-role-${role.id}`
        return (
          <label key={role.id} htmlFor={id} className="flex min-h-11 items-center gap-3">
            <input
              id={id}
              type="checkbox"
              name={`role-${role.id}`}
              className={`min-h-11 min-w-11 accent-accent ${KELAS_FOKUS}`}
            />
            <span>{role.name}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

export default async function UsersPage() {
  const actor = await requireCmsUser()
  requireGrant(actor, 'users', 'view')
  const bisaUbah = can(actor.matrix, 'users', 'update')

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: { email: 'asc' },
      include: { accessRoles: { include: { role: true } } },
    }),
    prisma.accessRole.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="flex flex-col gap-16">
      {bisaUbah ? (
        <form action={saveUser} className="flex max-w-2xl flex-col gap-4">
          <h2 className="font-display text-section uppercase">Pengguna baru</h2>
          <Field id="name" label="Nama">
            <input id="name" name="name" required className={KELAS_KONTROL} />
          </Field>
          <Field id="email" label="Email">
            <input id="email" name="email" type="email" required className={KELAS_KONTROL} />
          </Field>
          <Field id="password" label="Kata sandi">
            <input id="password" name="password" type="password" required className={KELAS_KONTROL} />
          </Field>
          <PeranCheckboxes roles={roles} />
          <Button type="submit">Tambah pengguna</Button>
        </form>
      ) : (
        <h2 className="font-display text-section uppercase">Pengguna</h2>
      )}

      <section className="flex flex-col gap-6">
        <h3 className="font-display text-card uppercase">Daftar pengguna</h3>
        <ul className="flex flex-col gap-3">
          {users.map((user) => {
            const namaPeran =
              user.accessRoles.length > 0
                ? user.accessRoles.map((row) => row.role.name).join(', ')
                : parseRoles(user.roles).join(', ')

            return (
              <li
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3"
              >
                <div>
                  <p className="font-display text-body font-semibold">{user.name}</p>
                  <p className="text-small text-content-muted">
                    {user.email} · {namaPeran || 'tanpa peran'} · {user.isActive ? 'aktif' : 'nonaktif'}
                  </p>
                </div>
                {bisaUbah && user.email !== actor.email ? (
                  <form action={toggleUserActive}>
                    <input type="hidden" name="id" value={user.id} />
                    <Button type="submit" variant="secondary">
                      {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </form>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
