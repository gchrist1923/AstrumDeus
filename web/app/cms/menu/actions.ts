'use server'

import { revalidatePath } from 'next/cache'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { applyMenuToggle } from '@/lib/content/menu'
import { checked } from '@/lib/form'
import { prisma } from '@/lib/db'
import { syncBuiltinEnabled } from '@/lib/pages/sync-builtin-enabled'

export async function saveMenuFlags(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'menu', 'update')

  const items = await prisma.menuItem.findMany()

  for (const item of items) {
    if (item.isMandatory) {
      continue
    }

    const result = applyMenuToggle(item, checked(formData, item.key))
    if (result.ok) {
      await syncBuiltinEnabled(prisma, item.key, result.isEnabled)
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/cms/menu')
  revalidatePath('/cms/halaman')
}
