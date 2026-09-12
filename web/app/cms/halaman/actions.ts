'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { pathDenganFlash } from '@/lib/flash'
import { checked, teks } from '@/lib/form'
import { applyBuiltinToggle, BUILTIN_PAGES } from '@/lib/pages/builtins'
import { assertValidLayout } from '@/lib/pages/grid'
import { customSlugError } from '@/lib/pages/public-visibility'
import { normalizeSlug } from '@/lib/pages/reserved'
import { syncBuiltinEnabled } from '@/lib/pages/sync-builtin-enabled'
import type { PageRow } from '@/lib/pages/types'
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
    redirect(pathDenganFlash('/cms/halaman', { kesalahan: 'wajib' }))
  }

  await syncBuiltinEnabled(prisma, menuKey, enabled)

  revalidatePath('/', 'layout')
  revalidatePath('/cms/halaman')
  revalidatePath('/cms/menu')
  redirect(pathDenganFlash('/cms/halaman', { ok: 'ubah' }))
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
    redirect(pathDenganFlash('/cms/halaman/new', { kesalahan: 'isi' }))
  }

  if (customSlugError(slug) === 'Slug tidak tersedia.') {
    redirect(pathDenganFlash('/cms/halaman/new', { kesalahan: 'slug' }))
  }

  const existing = await prisma.sitePage.findUnique({ where: { slug } })
  if (existing) {
    redirect(pathDenganFlash('/cms/halaman/new', { kesalahan: 'slug' }))
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
  redirect(pathDenganFlash('/cms/halaman', { ok: 'simpan' }))
}

export async function updateCustomPage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'update')

  const id = teks(formData, 'id')
  const page = id ? await prisma.sitePage.findUnique({ where: { id } }) : null
  if (!page || page.kind !== 'custom') {
    redirect('/cms/halaman')
  }

  const title = teks(formData, 'title')
  if (!title) {
    redirect(pathDenganFlash(`/cms/halaman/${page.id}`, { kesalahan: 'isi' }))
  }
  const statusRaw = teks(formData, 'status')
  const status = statusRaw === 'draft' || statusRaw === 'published' ? statusRaw : page.status
  const showInNav = checkboxAtauTetap(formData, 'showInNav', page.showInNav)
  const isEnabled = checkboxAtauTetap(formData, 'isEnabled', page.isEnabled)

  await prisma.sitePage.update({
    where: { id: page.id },
    data: { title, status, showInNav, isEnabled },
  })

  revalidateHalamanPublik(page.slug)
  redirect(pathDenganFlash('/cms/halaman', { ok: 'ubah' }))
}

function checkboxAtauTetap(formData: FormData, kunci: string, sekarang: boolean): boolean {
  const nilai = formData.getAll(kunci)
  if (nilai.length === 0) return sekarang
  return nilai.some((item) => item === 'on' || item === 'true' || item === '1')
}

export async function saveLayout(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'update')

  const id = teks(formData, 'id')
  const page = id ? await prisma.sitePage.findUnique({ where: { id } }) : null
  if (!page || page.kind !== 'custom') {
    redirect('/cms/halaman')
  }

  let rows: PageRow[]
  try {
    const parsed: unknown = JSON.parse(teks(formData, 'layout') || '[]')
    if (!Array.isArray(parsed)) {
      throw new Error('layout')
    }
    rows = parsed as PageRow[]
    assertValidLayout(rows)
  } catch {
    redirect(pathDenganFlash(`/cms/halaman/${page.id}`, { kesalahan: 'layout' }))
  }

  await prisma.sitePage.update({
    where: { id: page.id },
    data: { layout: JSON.stringify(rows) },
  })

  revalidateHalamanPublik(page.slug)
  redirect(pathDenganFlash(`/cms/halaman/${page.id}`, { ok: 'ubah' }))
}

export async function deleteCustomPage(formData: FormData): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'halaman', 'delete')

  const id = teks(formData, 'id')
  const page = id ? await prisma.sitePage.findUnique({ where: { id } }) : null
  if (!page || page.kind !== 'custom') {
    redirect('/cms/halaman')
  }

  await prisma.sitePage.delete({ where: { id: page.id } })
  revalidateHalamanPublik(page.slug)
  redirect(pathDenganFlash('/cms/halaman', { ok: 'hapus' }))
}
