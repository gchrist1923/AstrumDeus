import { requireGrant, requireInternalUser } from '@/lib/auth/require'
import { formatRupiah } from '@/lib/content/format'
import { cashEntriesToCsv } from '@/lib/finance/csv'
import { computeBalance, reportForPeriod } from '@/lib/finance/report'
import { prisma } from '@/lib/db'

function monthBounds(value: string): { start: Date; end: Date } {
  const [year, month] = value.split('-').map(Number)
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  }
}

function dayBounds(value: string): { start: Date; end: Date } {
  const start = new Date(`${value}T00:00:00+07:00`)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return { start, end }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ buku?: string; hari?: string; bulan?: string }>
}) {
  const user = await requireInternalUser()
  requireGrant(user, 'laporan', 'view')

  const params = await searchParams
  const books = await prisma.cashBook.findMany({ orderBy: { name: 'asc' } })
  const selected = books.find((book) => book.id === params.buku) ?? books[0]
  const today = new Date()
  const hari = params.hari ?? today.toISOString().slice(0, 10)
  const bulan = params.bulan ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  if (!selected) {
    return <p className="text-content-secondary">Belum ada buku kas.</p>
  }

  const entries = await prisma.cashEntry.findMany({
    where: { cashBookId: selected.id },
    include: { category: true },
    orderBy: { date: 'asc' },
  })

  const mapped = entries.map((entry) => ({
    date: entry.date.toISOString(),
    direction: entry.direction,
    amount: entry.amount,
  }))

  const harian = dayBounds(hari)
  const bulanan = monthBounds(bulan)
  const laporanHarian = reportForPeriod(mapped, harian.start.toISOString(), harian.end.toISOString())
  const laporanBulanan = reportForPeriod(mapped, bulanan.start.toISOString(), bulanan.end.toISOString())
  const saldo = computeBalance(
    selected.openingBalance,
    entries.map((entry) => ({ direction: entry.direction, amount: entry.amount })),
  )
  const csv = cashEntriesToCsv(
    entries.map((entry) => ({
      date: entry.date.toISOString().slice(0, 10),
      direction: entry.direction,
      amount: entry.amount,
      category: entry.category.name,
      description: entry.description,
    })),
  )

  return (
    <div>
      <h2 className="mb-6 font-display text-section uppercase">Laporan</h2>
      <form className="mb-8 flex flex-wrap gap-3">
        <label className="flex min-h-11 items-center gap-2">
          <span className="font-display text-label uppercase text-content-muted">Buku</span>
          <select name="buku" defaultValue={selected.id} className="min-h-11 border-2 border-border-strong bg-surface-raised px-3">
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <span className="font-display text-label uppercase text-content-muted">Hari</span>
          <input name="hari" type="date" defaultValue={hari} className="min-h-11 border-2 border-border-strong bg-surface-raised px-3" />
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <span className="font-display text-label uppercase text-content-muted">Bulan</span>
          <input name="bulan" type="month" defaultValue={bulan} className="min-h-11 border-2 border-border-strong bg-surface-raised px-3" />
        </label>
        <button type="submit" className="min-h-11 bg-accent px-6 font-display text-label uppercase text-surface-raised">
          Terapkan
        </button>
      </form>

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="border-2 border-border-strong p-4">
          <dt className="font-display text-label uppercase text-content-muted">Saldo buku</dt>
          <dd className="mt-2 font-display text-card tabular-nums">{formatRupiah(saldo)}</dd>
        </div>
        <div className="border-2 border-border-strong p-4">
          <dt className="font-display text-label uppercase text-content-muted">Harian neto</dt>
          <dd className="mt-2 font-display text-card tabular-nums">{formatRupiah(laporanHarian.net)}</dd>
          <dd className="mt-1 text-small text-content-muted">
            Masuk {formatRupiah(laporanHarian.masuk)} · Keluar {formatRupiah(laporanHarian.keluar)}
          </dd>
        </div>
        <div className="border-2 border-border-strong p-4">
          <dt className="font-display text-label uppercase text-content-muted">Bulanan neto</dt>
          <dd className="mt-2 font-display text-card tabular-nums">{formatRupiah(laporanBulanan.net)}</dd>
          <dd className="mt-1 text-small text-content-muted">
            Masuk {formatRupiah(laporanBulanan.masuk)} · Keluar {formatRupiah(laporanBulanan.keluar)}
          </dd>
        </div>
      </dl>

      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
        download={`${selected.type}-kas.csv`}
        className="mt-8 inline-flex min-h-11 items-center border-2 border-border-strong px-6 font-display text-label uppercase"
      >
        Unduh CSV
      </a>
    </div>
  )
}
