import { Button } from '@/components/ui/button'
import { canToggleMenu } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { saveMenuFlags } from '@/app/cms/menu/actions'

export default async function MenuPage() {
  const user = await requireCmsUser()

  if (!canToggleMenu(user.roles)) {
    return <p className="text-content-secondary">Hanya Admin yang mengubah tampilan menu.</p>
  }

  const items = await prisma.menuItem.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <form action={saveMenuFlags} className="flex max-w-xl flex-col gap-6">
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
              disabled={item.isMandatory}
              className="size-5 accent-accent"
            />
            <label htmlFor={`menu-${item.key}`} className="font-display text-label uppercase">
              {item.label}
              {item.isMandatory ? ' · wajib' : ''}
            </label>
          </li>
        ))}
      </ul>
      <Button type="submit">Simpan menu</Button>
    </form>
  )
}
