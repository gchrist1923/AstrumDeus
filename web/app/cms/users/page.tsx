import { saveUser, toggleUserActive } from '@/app/cms/users/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { parseRoles, ROLES } from '@/lib/auth/roles'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function UsersPage() {
  const actor = await requireCmsUser()
  requireGrant(actor, 'users', 'view')
  const bisaUbah = can(actor.matrix, 'users', 'update')

  const users = await prisma.user.findMany({ orderBy: { email: 'asc' } })

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="mb-6 font-display text-section uppercase">Pengguna</h2>
        <ul className="flex flex-col gap-3">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3">
              <div>
                <p className="font-display text-body font-semibold">{user.name}</p>
                <p className="text-small text-content-muted">
                  {user.email} · {parseRoles(user.roles).join(', ')} · {user.isActive ? 'aktif' : 'nonaktif'}
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
          ))}
        </ul>
      </div>
      {bisaUbah ? (
      <form action={saveUser} className="flex flex-col gap-4">
        <h3 className="font-display text-label uppercase text-accent">Pengguna baru</h3>
        <Field id="name" label="Nama">
          <input id="name" name="name" required className={KELAS_KONTROL} />
        </Field>
        <Field id="email" label="Email">
          <input id="email" name="email" type="email" required className={KELAS_KONTROL} />
        </Field>
        <Field id="password" label="Kata sandi">
          <input id="password" name="password" type="password" required className={KELAS_KONTROL} />
        </Field>
        <fieldset className="flex flex-col gap-2">
          <legend className="font-display text-label uppercase text-content-muted">Peran</legend>
          {ROLES.map((role) => (
            <label key={role} className="flex min-h-11 items-center gap-3">
              <input type="checkbox" name={`role-${role}`} className="size-5 accent-accent" />
              <span className="uppercase">{role}</span>
            </label>
          ))}
        </fieldset>
        <Button type="submit">Tambah pengguna</Button>
      </form>
      ) : null}
    </div>
  )
}
