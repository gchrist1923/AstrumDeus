'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { slugify } from '@/lib/content/slug'
import { prisma } from '@/lib/db'
import { angka, teks } from '@/lib/form'

async function requireKategori(action: 'create' | 'update' | 'delete'): Promise<void> {
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
    redirect('/cms/kategori/turnamen')
  }

  await prisma.tournament.create({
    data: { name, organizer, season, year, isActive: true },
  })

  revalidateKategori()
  redirect('/cms/kategori/turnamen')
}

export async function deactivateTournament(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.tournament.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect('/cms/kategori/turnamen')
}

export async function deleteTournament(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/turnamen')

  const [matches, stats] = await Promise.all([
    prisma.match.count({ where: { tournamentId: id } }),
    prisma.playerStat.count({ where: { tournamentId: id } }),
  ])
  const n = matches + stats
  if (n > 0) {
    redirect(`/cms/kategori/turnamen?kesalahan=pakai&n=${n}`)
  }
  await prisma.tournament.delete({ where: { id } })
  revalidateKategori()
  redirect('/cms/kategori/turnamen')
}

export async function createCashCategory(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const direction = teks(formData, 'direction') === 'keluar' ? 'keluar' : 'masuk'
  if (!name) {
    redirect('/cms/kategori/kas')
  }

  await prisma.expenseCategory.create({
    data: { name, direction, isActive: true },
  })

  revalidateKategori()
  redirect('/cms/kategori/kas')
}

export async function deactivateCashCategory(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.expenseCategory.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect('/cms/kategori/kas')
}

export async function deleteCashCategory(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/kas')
  const n = await prisma.cashEntry.count({ where: { categoryId: id } })
  if (n > 0) {
    redirect(`/cms/kategori/kas?kesalahan=pakai&n=${n}`)
  }
  await prisma.expenseCategory.delete({ where: { id } })
  revalidateKategori()
  redirect('/cms/kategori/kas')
}

export async function createNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const slug = slugify(name)
  if (!name || !slug) {
    redirect('/cms/kategori/berita')
  }

  const existing = await prisma.newsCategory.findUnique({ where: { slug } })
  if (existing) {
    redirect('/cms/kategori/berita?kesalahan=nama')
  }

  await prisma.newsCategory.create({
    data: { name, slug, description: name, isActive: true },
  })

  revalidateKategori()
  redirect('/cms/kategori/berita')
}

export async function deactivateNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.newsCategory.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect('/cms/kategori/berita')
}

export async function deleteNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/berita')
  const n = await prisma.newsPost.count({ where: { categoryId: id } })
  if (n > 0) {
    redirect(`/cms/kategori/berita?kesalahan=pakai&n=${n}`)
  }
  await prisma.newsCategory.delete({ where: { id } })
  revalidateKategori()
  redirect('/cms/kategori/berita')
}
