'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { slugify } from '@/lib/content/slug'
import { prisma } from '@/lib/db'
import { pathDenganFlash } from '@/lib/flash'
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
  revalidatePath('/internal/cash/operasional')
  revalidatePath('/internal/cash/tim')
}

export async function createTournament(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const organizer = teks(formData, 'organizer')
  const season = teks(formData, 'season')
  const year = angka(formData, 'year')
  if (!name || !organizer || !season || year === null) {
    redirect(pathDenganFlash('/cms/kategori/turnamen', { kesalahan: 'isi' }))
  }

  await prisma.tournament.create({
    data: { name, organizer, season, year, isActive: true },
  })

  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/turnamen', { ok: 'simpan' }))
}

export async function deactivateTournament(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.tournament.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/turnamen', { ok: 'ubah' }))
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
    redirect(pathDenganFlash('/cms/kategori/turnamen', { kesalahan: 'pakai', n, pakai: 'turnamen' }))
  }
  await prisma.tournament.delete({ where: { id } })
  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/turnamen', { ok: 'hapus' }))
}

export async function createCashCategory(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const direction = teks(formData, 'direction') === 'keluar' ? 'keluar' : 'masuk'
  if (!name) {
    redirect(pathDenganFlash('/cms/kategori/kas', { kesalahan: 'isi' }))
  }

  await prisma.expenseCategory.create({
    data: { name, direction, isActive: true },
  })

  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/kas', { ok: 'simpan' }))
}

export async function deactivateCashCategory(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.expenseCategory.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/kas', { ok: 'ubah' }))
}

export async function deleteCashCategory(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/kas')
  const n = await prisma.cashEntry.count({ where: { categoryId: id } })
  if (n > 0) {
    redirect(pathDenganFlash('/cms/kategori/kas', { kesalahan: 'pakai', n, pakai: 'kas' }))
  }
  await prisma.expenseCategory.delete({ where: { id } })
  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/kas', { ok: 'hapus' }))
}

export async function createNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('create')

  const name = teks(formData, 'name')
  const slug = slugify(name)
  if (!name || !slug) {
    redirect(pathDenganFlash('/cms/kategori/berita', { kesalahan: 'isi' }))
  }

  const existing = await prisma.newsCategory.findUnique({ where: { slug } })
  if (existing) {
    redirect(pathDenganFlash('/cms/kategori/berita', { kesalahan: 'nama' }))
  }

  await prisma.newsCategory.create({
    data: { name, slug, description: name, isActive: true },
  })

  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/berita', { ok: 'simpan' }))
}

export async function deactivateNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('update')

  const id = teks(formData, 'id')
  if (id) {
    await prisma.newsCategory.update({ where: { id }, data: { isActive: false } })
  }

  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/berita', { ok: 'ubah' }))
}

export async function deleteNewsCategory(formData: FormData): Promise<void> {
  await requireKategori('delete')
  const id = teks(formData, 'id')
  if (!id) redirect('/cms/kategori/berita')
  const n = await prisma.newsPost.count({ where: { categoryId: id } })
  if (n > 0) {
    redirect(pathDenganFlash('/cms/kategori/berita', { kesalahan: 'pakai', n, pakai: 'berita' }))
  }
  await prisma.newsCategory.delete({ where: { id } })
  revalidateKategori()
  redirect(pathDenganFlash('/cms/kategori/berita', { ok: 'hapus' }))
}
