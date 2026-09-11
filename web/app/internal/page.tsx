import { RingkasanInternal } from '@/components/admin/ringkasan-internal'
import { can } from '@/lib/auth/grants'
import { canReadCashBook } from '@/lib/auth/permissions'
import { requireInternalUser } from '@/lib/auth/require'
import { toDatetimeLocal } from '@/lib/datetime'
import { prisma } from '@/lib/db'
import { computeBalance } from '@/lib/finance/report'
import { hariIniWib } from '@/lib/schedule/hari-ini'

export default async function InternalHomePage() {
  const user = await requireInternalUser()
  const { iso, awal, akhir } = hariIniWib()
  const bisaJadwal = can(user.matrix, 'jadwal', 'view')
  const jenisBuku = (['operasional', 'tim'] as const).filter((jenis) => canReadCashBook(user.matrix, jenis))

  const [events, books] = await Promise.all([
    bisaJadwal
      ? prisma.scheduleEvent.findMany({
          where: { startAt: { gte: awal, lt: akhir } },
          orderBy: { startAt: 'asc' },
          select: { title: true, startAt: true, isAllDay: true },
        })
      : Promise.resolve([]),
    jenisBuku.length > 0
      ? prisma.cashBook.findMany({
          where: { type: { in: [...jenisBuku] } },
          include: { entries: { select: { direction: true, amount: true } } },
          orderBy: { name: 'asc' },
        })
      : Promise.resolve([]),
  ])

  return (
    <RingkasanInternal
      hariIso={iso}
      jadwal={
        bisaJadwal
          ? events.map((event) => ({
              title: event.title,
              waktu: event.isAllDay ? null : toDatetimeLocal(event.startAt).slice(11, 16),
            }))
          : null
      }
      kas={
        jenisBuku.length > 0
          ? books.map((book) => ({
              nama: book.name,
              saldo: computeBalance(book.openingBalance, book.entries),
            }))
          : null
      }
    />
  )
}
