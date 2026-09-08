'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { slugify } from '@/lib/content/slug'
import { prisma } from '@/lib/db'
import { angka, teks } from '@/lib/form'

async function requireKategori(action: 'create' | 'update'): Promise<void> {
  const user = await requireCmsUser()
  requireGrant(user, 'kategori', action)
}

function revalidateKategori(): void {
  revalidatePath('/cms/kategori')
  revalidatePath('/cms/matches')
  revalidatePath('/cms/news')
  revalidatePath('/internal/cash')
}

export async function createTournament(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const organizer = teks(formData, 'organizer')
  const season = teks(formData, 'season')
  const year = angka(formData, 'year')
  if (!name || !organizer || !season || year === null) {
    redirect('/cms/kategori')
  }

  await prisma.tournament.create({
    data: { name, organizer, season, year, isActive: true },
  })

  revalidateKategori()
  redirect('/cms/kategori')
}

export async function deactivateTournament(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.tournament.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect('/cms/kategori')
}

export async function createCashCategory(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const direction = teks(formData, 'direction') === 'keluar' ? 'keluar' : 'masuk'
  if (!name) {
    redirect('/cms/kategori')
  }

  await prisma.expenseCategory.create({
    data: { name, direction, isActive: true },
  })

  revalidateKategori()
  redirect('/cms/kategori')
}

export async function deactivateCashCategory(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.expenseCategory.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect('/cms/kategori')
}

export async function createNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const slug = slugify(name)
  if (!name || !slug) {
    redirect('/cms/kategori')
  }

  const existing = await prisma.newsCategory.findUnique({ where: { slug } })
  if (existing) {
    redirect('/cms/kategori?kesalahan=nama')
  }

  await prisma.newsCategory.create({
    data: { name, slug, description: name, isActive: true },
  })

  revalidateKategori()
  redirect('/cms/kategori')
}

export async function deactivateNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.newsCategory.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect('/cms/kategori')
}
