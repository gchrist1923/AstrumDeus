'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { checked, teks } from '@/lib/form'
import { applyBuiltinToggle, BUILTIN_PAGES } from '@/lib/pages/builtins'
import { customSlugError } from '@/lib/pages/public-visibility'
import { normalizeSlug } from '@/lib/pages/reserved'
import { syncBuiltinEnabled } from '@/lib/pages/sync-builtin-enabled'
import type { NavKey } from '@/lib/nav'

export async function toggleBuiltinEnabled(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'menu', 'update')

  const menuKey = teks(formData, 'menuKey') as NavKey
  const builtin = BUILTIN_PAGES.find((page) => page.menuKey === menuKey)
  if (!builtin) {
    redirect('/cms/halaman')
  }

  const enabled = teks(formData, 'enabled') === '1'

  try {
    applyBuiltinToggle(builtin.mandatory, enabled)
  } catch {
    redirect('/cms/halaman?kesalahan=wajib')
  }

  await syncBuiltinEnabled(prisma, menuKey, enabled)

  revalidatePath('/', 'layout')
  revalidatePath('/cms/halaman')
  revalidatePath('/cms/menu')
  redirect('/cms/halaman')
}

function revalidateHalamanPublik(slug?: string): void {
  revalidatePath('/', 'layout')
  revalidatePath('/cms/halaman')
  if (slug) {
    revalidatePath(`/${slug}`)
  }
}

export async function createPage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'create')

  const title = teks(formData, 'title')
  const slug = normalizeSlug(teks(formData, 'slug') || title)
  const status = teks(formData, 'status') === 'draft' ? 'draft' : 'published'
  const showInNav = checked(formData, 'showInNav')

  if (!title || !slug) {
    redirect('/cms/halaman/new')
  }

  if (customSlugError(slug) === 'Slug tidak tersedia.') {
    redirect('/cms/halaman/new?kesalahan=slug')
  }

  const existing = await prisma.sitePage.findUnique({ where: { slug } })
  if (existing) {
    redirect('/cms/halaman/new?kesalahan=slug')
  }

  await prisma.sitePage.create({
    data: {
      title,
      slug,
      kind: 'custom',
      status,
      showInNav,
      isEnabled: true,
      layout: '[]',
    },
  })

  revalidateHalamanPublik(slug)
  redirect('/cms/halaman')
}

export async function updateCustomPage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'update')

  const id = teks(formData, 'id')
  const page = id ? await prisma.sitePage.findUnique({ where: { id } }) : null
  if (!page || page.kind !== 'custom') {
    redirect('/cms/halaman')
  }

  const title = teks(formData, 'title') || page.title
  const status = teks(formData, 'status') === 'draft' ? 'draft' : 'published'
  const showInNav = checked(formData, 'showInNav')
  const isEnabled = teks(formData, 'isEnabled') === '1' || checked(formData, 'isEnabled')

  await prisma.sitePage.update({
    where: { id: page.id },
    data: { title, status, showInNav, isEnabled },
  })

  revalidateHalamanPublik(page.slug)
  redirect('/cms/halaman')
}
