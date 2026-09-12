'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hashPassword } from '@/lib/auth/password'
import { legacyRolesJsonFromSlugs } from '@/lib/auth/roles'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { pathDenganFlash } from '@/lib/flash'
import { adaKosong, emailValid, teks } from '@/lib/form'
import { prisma } from '@/lib/db'

async function selectedAccessRoles(formData: FormData) {
  const catalog = await prisma.accessRole.findMany()
  return catalog.filter((role) => formData.get(`role-${role.id}`) === 'on')
}

export async function saveUser(formData: FormData): Promise<void> {
  const actor = await requireCmsUser()
  requireGrant(actor, 'users', 'update')

  const email = teks(formData, 'email').toLowerCase()
  const name = teks(formData, 'name')
  const password = typeof formData.get('password') === 'string' ? String(formData.get('password')) : ''
  const selected = await selectedAccessRoles(formData)

  if (adaKosong(formData, ['name', 'email']) || !password) {
    redirect(pathDenganFlash('/cms/users', { kesalahan: 'isi' }))
  }
  if (!emailValid(email)) {
    redirect(pathDenganFlash('/cms/users', { kesalahan: 'email' }))
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      roles: legacyRolesJsonFromSlugs(selected.map((role) => role.slug)),
    },
  })

  if (selected.length > 0) {
    await prisma.userAccessRole.createMany({
      data: selected.map((role) => ({ userId: user.id, roleId: role.id })),
    })
  }

  revalidatePath('/cms/users')
  redirect(pathDenganFlash('/cms/users', { ok: 'simpan' }))
}

export async function toggleUserActive(formData: FormData): Promise<void> {
  const actor = await requireCmsUser()
  requireGrant(actor, 'users', 'update')

  const id = teks(formData, 'id')
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user || user.email === actor.email) {
    return
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  })

  revalidatePath('/cms/users')
  redirect(pathDenganFlash('/cms/users', { ok: 'ubah' }))
}
