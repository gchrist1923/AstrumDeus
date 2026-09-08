'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { hashPassword } from '@/lib/auth/password'
import { canManageSettings, parseRoles, ROLES } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'

export async function saveUser(formData: FormData): Promise<void> {
  const actor = await requireCmsUser()
  if (!canManageSettings(actor.roles)) {
    redirect('/cms')
  }

  const email = teks(formData, 'email').toLowerCase()
  const name = teks(formData, 'name')
  const password = typeof formData.get('password') === 'string' ? String(formData.get('password')) : ''
  const roles = ROLES.filter((role) => formData.get(`role-${role}`) === 'on')

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      roles: JSON.stringify(roles.length > 0 ? roles : parseRoles('["editor"]')),
    },
  })

  revalidatePath('/cms/users')
}

export async function toggleUserActive(formData: FormData): Promise<void> {
  const actor = await requireCmsUser()
  if (!canManageSettings(actor.roles)) {
    redirect('/cms')
  }

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
}
