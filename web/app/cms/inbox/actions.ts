'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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

export async function deleteInboxMessage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'inbox', 'delete')

  const id = teks(formData, 'id')
  const q = teks(formData, 'q')
  const hal = teks(formData, 'hal')
  if (id) {
    await prisma.contactMessage.delete({ where: { id } })
  }

  revalidatePath('/cms/inbox')
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (hal) params.set('hal', hal)
  const qs = params.toString()
  redirect(qs ? `/cms/inbox?${qs}` : '/cms/inbox')
}
