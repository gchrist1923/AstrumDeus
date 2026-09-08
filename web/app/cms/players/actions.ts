'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteContent } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { fromDateInput } from '@/lib/datetime'
import { angka, checked, teks } from '@/lib/form'
import { prisma } from '@/lib/db'

function parseSocialLines(raw: string): { label: string; href: string }[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split('|').map((bagian) => bagian.trim())
      return { label: label || 'Tautan', href: href || label }
    })
}

export async function savePlayer(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  const left = teks(formData, 'leftAt')
  const data = {
    slug: teks(formData, 'slug'),
    ign: teks(formData, 'ign'),
    realName: teks(formData, 'realName'),
    role: teks(formData, 'role'),
    photo: teks(formData, 'photo') || '/portrait.jpg',
    joinedAt: fromDateInput(teks(formData, 'joinedAt')),
    leftAt: left ? fromDateInput(left) : null,
    isActive: checked(formData, 'isActive'),
    socials: JSON.stringify(parseSocialLines(teks(formData, 'socials'))),
    sortOrder: angka(formData, 'sortOrder') ?? 0,
  }

  if (id) {
    await prisma.player.update({ where: { id }, data })
  } else {
    await prisma.player.create({ data })
  }

  revalidatePath('/roster')
  revalidatePath('/')
  revalidatePath('/cms/players')
  redirect('/cms/players')
}

export async function deletePlayer(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  if (!canWriteContent(user.roles)) {
    redirect('/cms')
  }

  const id = teks(formData, 'id')
  if (id) {
    await prisma.player.delete({ where: { id } })
  }

  revalidatePath('/roster')
  revalidatePath('/cms/players')
  redirect('/cms/players')
}
