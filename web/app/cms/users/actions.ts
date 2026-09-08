'use server'

import { revalidatePath } from 'next/cache'
import { hashPassword } from '@/lib/auth/password'
import { ROLES, type Role } from '@/lib/auth/roles'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { teks } from '@/lib/form'
import { prisma } from '@/lib/db'

function isLegacySlug(slug: string): slug is Role {
  return (ROLES as readonly string[]).includes(slug)
}

function legacyRolesJson(slugs: string[]): string {
  return JSON.stringify(slugs.filter(isLegacySlug))
}

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

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      roles: legacyRolesJson(selected.map((role) => role.slug)),
    },
  })

  if (selected.length > 0) {
    await prisma.userAccessRole.createMany({
      data: selected.map((role) => ({ userId: user.id, roleId: role.id })),
    })
  }

  revalidatePath('/cms/users')
}

export async function saveUserRoles(formData: FormData): Promise<void> {
  const actor = await requireCmsUser()
  requireGrant(actor, 'users', 'update')

  const id = teks(formData, 'id')
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return
  }

  const selected = await selectedAccessRoles(formData)

  await prisma.$transaction(async (tx) => {
    await tx.userAccessRole.deleteMany({ where: { userId: id } })
    if (selected.length > 0) {
      await tx.userAccessRole.createMany({
        data: selected.map((role) => ({ userId: id, roleId: role.id })),
      })
    }
    await tx.user.update({
      where: { id },
      data: { roles: legacyRolesJson(selected.map((role) => role.slug)) },
    })
  })

  revalidatePath('/cms/users')
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
}
