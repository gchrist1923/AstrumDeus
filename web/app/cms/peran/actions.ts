'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  clampGrant,
  editorTemplate,
  emptyMatrix,
  financeTemplate,
  teamTemplate,
  type GrantMatrix,
} from '@/lib/auth/grants'
import { ACCESS_MODULES } from '@/lib/auth/modules'
import { assertAdminRoleMutation } from '@/lib/auth/protect-admin'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { slugify } from '@/lib/content/slug'
import { rewriteLegacyRolesForUsers } from '@/lib/auth/rewrite-legacy-roles'
import { prisma } from '@/lib/db'
import { checked, teks } from '@/lib/form'

const TEMPLATES = {
  editor: editorTemplate,
  team: teamTemplate,
  finance: financeTemplate,
} as const

type TemplateKey = keyof typeof TEMPLATES

async function requirePeran(action: 'view' | 'create' | 'update' | 'delete') {
  const user = await requireCmsUser()
  requireGrant(user, 'peran', action)
}

function matrixFromFormData(formData: FormData): GrantMatrix {
  const matrix = emptyMatrix()
  for (const { id } of ACCESS_MODULES) {
    matrix[id] = clampGrant({
      view: checked(formData, `${id}-view`),
      create: checked(formData, `${id}-create`),
      update: checked(formData, `${id}-update`),
      delete: checked(formData, `${id}-delete`),
    })
  }
  return matrix
}

function revalidatePeran(id?: string): void {
  revalidatePath('/cms/peran')
  revalidatePath('/cms/users')
  if (id) {
    revalidatePath(`/cms/peran/${id}`)
  }
}

async function createNamedRole(name: string, grants: GrantMatrix): Promise<void> {
  const slug = slugify(name)
  if (!name || !slug) {
    redirect('/cms/peran')
  }

  const existing = await prisma.accessRole.findFirst({
    where: { OR: [{ name }, { slug }] },
  })
  if (existing) {
    redirect('/cms/peran?kesalahan=nama')
  }

  await prisma.accessRole.create({
    data: {
      name,
      slug,
      isAdmin: false,
      grants: JSON.stringify(grants),
    },
  })

  revalidatePeran()
  redirect('/cms/peran')
}

export async function createRole(formData: FormData): Promise<void> {
  await requirePeran('create')
  await createNamedRole(teks(formData, 'name'), emptyMatrix())
}

export async function copyTemplate(template: TemplateKey, formData: FormData): Promise<void> {
  await requirePeran('create')
  if (template !== 'editor' && template !== 'team' && template !== 'finance') {
    redirect('/cms/peran')
  }

  await createNamedRole(teks(formData, 'name'), TEMPLATES[template]())
}

export async function saveGrants(formData: FormData): Promise<void> {
  await requirePeran('update')
  const id = teks(formData, 'id')
  if (!id) {
    redirect('/cms/peran')
  }

  const role = await prisma.accessRole.findUnique({ where: { id } })
  if (!role) {
    redirect('/cms/peran')
  }

  const next = matrixFromFormData(formData)
  const verdict = assertAdminRoleMutation(role, next)
  if (verdict !== 'ok') {
    redirect(`/cms/peran/${id}?kesalahan=${verdict}`)
  }

  await prisma.accessRole.update({
    where: { id },
    data: { grants: JSON.stringify(next) },
  })

  revalidatePeran(id)
  redirect(`/cms/peran/${id}`)
}

export async function deleteRole(formData: FormData): Promise<void> {
  await requirePeran('delete')
  const id = teks(formData, 'id')
  if (!id) {
    redirect('/cms/peran')
  }

  const role = await prisma.accessRole.findUnique({ where: { id } })
  if (!role) {
    redirect('/cms/peran')
  }

  const verdict = assertAdminRoleMutation(role)
  if (verdict !== 'ok') {
    redirect(`/cms/peran?kesalahan=${verdict}`)
  }

  const assigned = await prisma.userAccessRole.findMany({
    where: { roleId: id },
    select: { userId: true },
  })

  await prisma.accessRole.delete({ where: { id } })
  await rewriteLegacyRolesForUsers(assigned.map((row) => row.userId))
  revalidatePeran()
  redirect('/cms/peran')
}
