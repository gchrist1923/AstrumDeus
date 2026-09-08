'use server'

import { revalidatePath } from 'next/cache'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function updateInboxStatus(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    return
  }

  const id = teks(formData, 'id')
  const status = teks(formData, 'status')
  if (!id || !['baru', 'dibaca', 'selesai'].includes(status)) {
    return
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { status, handledById: user.id },
  })

  revalidatePath('/cms/inbox')
}
