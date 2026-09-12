'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { pathDenganFlash } from '@/lib/flash'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function tandaiInboxDibaca(id: string, userId: string): Promise<void> {
  await prisma.contactMessage.updateMany({
    where: { id, status: 'baru' },
    data: { status: 'dibaca', handledById: userId },
  })
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

  revalidatePath('/cms')
  revalidatePath('/cms/inbox')
  redirect(pathDenganFlash('/cms/inbox', { ok: 'hapus' }, { q: q || undefined, hal: hal || undefined }))
}
