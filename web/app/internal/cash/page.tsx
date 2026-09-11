import { redirect } from 'next/navigation'
import { canReadCashBook } from '@/lib/auth/permissions'
import { requireCashView, requireInternalUser } from '@/lib/auth/require'
import { prisma } from '@/lib/db'
import { cashBookPath } from '@/lib/finance/cash-path'

export default async function CashIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ buku?: string }>
}) {
  const user = await requireInternalUser()
  requireCashView(user)
  const params = await searchParams
  if (params.buku) {
    const book = await prisma.cashBook.findUnique({ where: { id: params.buku } })
    if (book && canReadCashBook(user.matrix, book.type as 'operasional' | 'tim')) {
      redirect(cashBookPath(book.type))
    }
  }
  if (canReadCashBook(user.matrix, 'operasional')) {
    redirect(cashBookPath('operasional'))
  }
  redirect(cashBookPath('tim'))
}
