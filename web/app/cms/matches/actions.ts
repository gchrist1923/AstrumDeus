'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { fromDatetimeLocal } from '@/lib/datetime'
import { angka, teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function saveMatch(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  const recapSlug = teks(formData, 'recapSlug')
  const recap = recapSlug ? await prisma.newsPost.findUnique({ where: { slug: recapSlug } }) : null

  const data = {
    tournamentId: teks(formData, 'tournamentId'),
    stage: teks(formData, 'stage'),
    scheduledAt: fromDatetimeLocal(teks(formData, 'scheduledAt')),
    status: teks(formData, 'status'),
    placement: angka(formData, 'placement'),
    points: angka(formData, 'points'),
    wwcdCount: angka(formData, 'wwcdCount'),
    location: teks(formData, 'location'),
    recapId: recap?.id ?? null,
    map: teks(formData, 'map') || null,
    streamUrl: teks(formData, 'streamUrl') || null,
  }

  if (id) {
    await prisma.match.update({ where: { id }, data })
  } else {
    await prisma.match.create({ data })
  }

  revalidatePath('/matches')
  revalidatePath('/')
  revalidatePath('/cms/matches')
  redirect('/cms/matches')
}

export async function deleteMatch(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  if (id) {
    await prisma.match.delete({ where: { id } })
  }

  revalidatePath('/matches')
  revalidatePath('/cms/matches')
  redirect('/cms/matches')
}
