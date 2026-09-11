import { saveMenuFlags } from '@/app/cms/menu/actions'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { customPagesForMenu } from '@/lib/pages/menu-kustom'

export default async function MenuPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'menu', 'view')
  const bisaUbah = can(user.matrix, 'menu', 'update')

  const items = await prisma.menuItem.findMany({ orderBy: { sortOrder: 'asc' } })
  const kustom = customPagesForMenu(
    await prisma.sitePage.findMany({
      where: { kind: 'custom' },
      select: { id: true, title: true, kind: true, status: true, isEnabled: true },
    }),
  )

  return (
    <form action={saveMenuFlags} className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <p className="text-content-secondary">
        Menu wajib tetap tampil. Item opsional bisa dimatikan tanpa deploy ulang.
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.key} className="flex min-h-11 items-center gap-3 border-2 border-border-strong px-4">
            <input
              id={`menu-${item.key}`}
              name={item.key}
              type="checkbox"
              defaultChecked={item.isEnabled}
              disabled={item.isMandatory || !bisaUbah}
              className="size-5 accent-accent"
            />
            <label htmlFor={`menu-${item.key}`} className="font-display text-label uppercase">
              {item.label}
              {item.isMandatory ? ' · wajib' : ''}
            </label>
          </li>
        ))}
      </ul>
      {kustom.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-label uppercase text-accent">Halaman terbit</h3>
          <ul className="flex flex-col gap-3">
            {kustom.map((item) => (
              <li key={item.id} className="flex min-h-11 items-center gap-3 border-2 border-border-strong px-4">
                <input
                  id={`menu-${item.fieldName}`}
                  name={item.fieldName}
                  type="checkbox"
                  defaultChecked={item.isEnabled}
                  disabled={!bisaUbah}
                  className="size-5 accent-accent"
                />
                <label htmlFor={`menu-${item.fieldName}`} className="font-display text-label uppercase">
                  {item.title}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {bisaUbah ? <Button type="submit">Simpan menu</Button> : null}
    </form>
  )
}
