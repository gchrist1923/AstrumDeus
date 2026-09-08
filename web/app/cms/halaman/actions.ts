'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { teks } from '@/lib/form'
import { applyBuiltinToggle, BUILTIN_PAGES } from '@/lib/pages/builtins'
import type { NavKey } from '@/lib/nav'

export async function toggleBuiltinEnabled(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'menu', 'update')

  const menuKey = teks(formData, 'menuKey') as NavKey
  const builtin = BUILTIN_PAGES.find((page) => page.menuKey === menuKey)
  if (!builtin) {
    redirect('/cms/halaman')
  }

  const enabled = teks(formData, 'enabled') === '1'

  try {
    applyBuiltinToggle(builtin.mandatory, enabled)
  } catch {
    redirect('/cms/halaman?kesalahan=wajib')
  }

  await prisma.menuItem.update({
    where: { key: menuKey },
    data: { isEnabled: enabled },
  })
  await prisma.sitePage.update({
    where: { menuKey },
    data: { isEnabled: enabled },
  })

  revalidatePath('/', 'layout')
  revalidatePath('/cms/halaman')
  revalidatePath('/cms/menu')
  redirect('/cms/halaman')
}
