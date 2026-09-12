'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { pathDenganFlash } from '@/lib/flash'
import { applyMenuToggle } from '@/lib/content/menu'
import { checked } from '@/lib/form'
import { prisma } from '@/lib/db'
import { customPagesForMenu } from '@/lib/pages/menu-kustom'
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

  const kustom = await prisma.sitePage.findMany({
    where: { kind: 'custom', status: 'published' },
    select: { id: true, title: true, kind: true, status: true, isEnabled: true, slug: true },
  })

  for (const item of customPagesForMenu(kustom)) {
    const isEnabled = checked(formData, item.fieldName)
    const page = kustom.find((row) => row.id === item.id)
    await prisma.sitePage.update({
      where: { id: item.id },
      data: { isEnabled },
    })
    if (page) {
      revalidatePath(`/${page.slug}`)
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/cms/menu')
  revalidatePath('/cms/halaman')
  redirect(pathDenganFlash('/cms/menu', { ok: 'ubah' }))
}
