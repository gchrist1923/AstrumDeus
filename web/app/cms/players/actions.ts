'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { fromDateInput } from '@/lib/datetime'
import { pathDenganFlash } from '@/lib/flash'
import { adaKosong, angka, checked, teks } from '@/lib/form'
import { prisma } from '@/lib/db'
import { releaseMediaPath } from '@/lib/media/store'

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
  const id = teks(formData, 'id')
  requireGrant(user, 'roster', id ? 'update' : 'create')
  if (adaKosong(formData, ['ign', 'slug', 'joinedAt'])) {
    redirect(pathDenganFlash(id ? `/cms/players/${id}` : '/cms/players/new', { kesalahan: 'isi' }))
  }
  const nextPhoto = teks(formData, 'photo') || '/portrait.jpg'
  let prevPhoto: string | null = null
  if (id) {
    const existing = await prisma.player.findUnique({ where: { id } })
    prevPhoto = existing?.photo ?? null
  }
  const left = teks(formData, 'leftAt')
  const data = {
    slug: teks(formData, 'slug'),
    ign: teks(formData, 'ign'),
    realName: teks(formData, 'realName'),
    role: teks(formData, 'role'),
    photo: nextPhoto,
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

  await releaseMediaPath(prevPhoto, nextPhoto)

  revalidatePath('/roster')
  revalidatePath('/')
  revalidatePath('/cms/players')
  redirect(pathDenganFlash('/cms/players', { ok: id ? 'ubah' : 'simpan' }))
}

export async function deletePlayer(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'roster', 'delete')

  const id = teks(formData, 'id')
  if (id) {
    const existing = await prisma.player.findUnique({ where: { id } })
    await prisma.player.delete({ where: { id } })
    await releaseMediaPath(existing?.photo, '')
  }

  revalidatePath('/roster')
  revalidatePath('/cms/players')
  redirect(pathDenganFlash('/cms/players', { ok: 'hapus' }))
}
