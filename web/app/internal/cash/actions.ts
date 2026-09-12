'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteCashBook } from '@/lib/auth/permissions'
import { requireInternalUser } from '@/lib/auth/require'
import { fromDateInput } from '@/lib/datetime'
import { pathDenganFlash } from '@/lib/flash'
import { adaKosong, angka, teks } from '@/lib/form'
import { buildReversal } from '@/lib/finance/report'
import { cashBookPath } from '@/lib/finance/cash-path'
import { prisma } from '@/lib/db'

export async function saveCashEntry(formData: FormData): Promise<void> {
  const user = await requireInternalUser()
  const cashBookId = teks(formData, 'cashBookId')
  const book = await prisma.cashBook.findUnique({ where: { id: cashBookId } })

  if (!book || !canWriteCashBook(user.matrix, book.type as 'operasional' | 'tim', user.id, user.id)) {
    return
  }

  const path = cashBookPath(book.type)
  if (adaKosong(formData, ['date', 'amount', 'categoryId', 'description'])) {
    redirect(pathDenganFlash(path, { kesalahan: 'isi' }))
  }

  const amount = angka(formData, 'amount')
  if (amount === null || amount < 1) {
    redirect(pathDenganFlash(path, { kesalahan: 'angka' }))
  }

  await prisma.cashEntry.create({
    data: {
      cashBookId: book.id,
      date: fromDateInput(teks(formData, 'date')),
      direction: teks(formData, 'direction') === 'keluar' ? 'keluar' : 'masuk',
      amount: Math.abs(amount),
      categoryId: teks(formData, 'categoryId'),
      description: teks(formData, 'description'),
      recordedById: user.id,
    },
  })

  revalidatePath(path)
  revalidatePath('/internal/cash')
  revalidatePath('/internal/reports')
  redirect(pathDenganFlash(path, { ok: 'simpan' }))
}

export async function reverseCashEntry(formData: FormData): Promise<void> {
  const user = await requireInternalUser()
  const id = teks(formData, 'id')
  const entry = await prisma.cashEntry.findUnique({
    where: { id },
    include: { cashBook: true },
  })

  if (!entry || entry.isCorrected) {
    return
  }

  if (!canWriteCashBook(user.matrix, entry.cashBook.type as 'operasional' | 'tim', entry.recordedById, user.id)) {
    return
  }

  const reversal = buildReversal(entry)
  const path = cashBookPath(entry.cashBook.type)

  await prisma.$transaction([
    prisma.cashEntry.create({
      data: {
        cashBookId: entry.cashBookId,
        date: new Date(),
        direction: reversal.direction,
        amount: reversal.amount,
        categoryId: entry.categoryId,
        description: `Koreksi: ${entry.description}`,
        recordedById: user.id,
        correctsEntryId: entry.id,
      },
    }),
    prisma.cashEntry.update({
      where: { id: entry.id },
      data: { isCorrected: true },
    }),
  ])

  revalidatePath(path)
  revalidatePath('/internal/cash')
  revalidatePath('/internal/reports')
  redirect(pathDenganFlash(path, { ok: 'ubah' }))
}
