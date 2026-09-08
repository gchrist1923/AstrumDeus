'use server'

import { revalidatePath } from 'next/cache'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function updateInboxStatus(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'inbox', 'update')

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
