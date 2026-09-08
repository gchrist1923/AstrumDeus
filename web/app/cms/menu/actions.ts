'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canToggleMenu } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { applyMenuToggle } from '@/lib/content/menu'
import { checked } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function saveMenuFlags(formData: FormData): Promise<void> {
  const user = await requireCmsUser()

  if (!canToggleMenu(user.roles)) {
    redirect('/cms')
  }

  const items = await prisma.menuItem.findMany()

  for (const item of items) {
    if (item.isMandatory) {
      continue
    }

    const result = applyMenuToggle(item, checked(formData, item.key))
    if (result.ok) {
      await prisma.menuItem.update({
        where: { key: item.key },
        data: { isEnabled: result.isEnabled },
      })
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/cms/menu')
}
