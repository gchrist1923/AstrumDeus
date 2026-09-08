import { reverseCashEntry, saveCashEntry } from '@/app/internal/cash/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { canReadCashBook, canWriteCashBook } from '@/lib/auth/permissions'
import { requireCashView, requireInternalUser } from '@/lib/auth/require'
import { formatRupiah } from '@/lib/content/format'
import { toDateInput } from '@/lib/datetime'
import { computeBalance } from '@/lib/finance/report'
import { prisma } from '@/lib/db'

export default async function CashPage({
  searchParams,
}: {
  searchParams: Promise<{ buku?: string }>
}) {
  const user = await requireInternalUser()
  requireCashView(user)
  const params = await searchParams
  const books = await prisma.cashBook.findMany({ orderBy: { name: 'asc' } })
  const visible = books.filter((book) => canReadCashBook(user.matrix, book.type as 'operasional' | 'tim'))
  const selected = visible.find((book) => book.id === params.buku) ?? visible[0]

  if (!selected) {
    return <p className="text-content-secondary">Tidak ada buku kas yang bisa dibaca.</p>
  }

  const [entries, categories] = await Promise.all([
    prisma.cashEntry.findMany({
      where: { cashBookId: selected.id },
      include: { category: true, recordedBy: true },
      orderBy: { date: 'desc' },
    }),
    prisma.expenseCategory.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])

  const saldo = computeBalance(
    selected.openingBalance,
    entries.map((entry) => ({ direction: entry.direction, amount: entry.amount })),
  )
  const bisaTulis = canWriteCashBook(user.matrix, selected.type as 'operasional' | 'tim', user.id, user.id)

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          {visible.map((book) => (
            <a
              key={book.id}
              href={`/internal/cash?buku=${book.id}`}
              className={`inline-flex min-h-11 items-center px-4 font-display text-label uppercase ${
                book.id === selected.id ? 'bg-accent text-surface-raised' : 'border-2 border-border-strong'
              }`}
            >
              {book.name}
            </a>
          ))}
        </div>
        <p className="mb-6 font-display text-section tabular-nums">{formatRupiah(saldo)}</p>
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="border-2 border-border-strong p-4">
              <p className="font-display text-body font-semibold">
                {entry.direction === 'masuk' ? '+' : '−'} {formatRupiah(entry.amount)}
              </p>
              <p className="text-small text-content-muted">
                {toDateInput(entry.date)} · {entry.category.name} · {entry.recordedBy.name}
                {entry.isCorrected ? ' · dikoreksi' : ''}
              </p>
              <p className="mt-2 text-body">{entry.description}</p>
              {bisaTulis && !entry.isCorrected ? (
                <form action={reverseCashEntry} className="mt-3">
                  <input type="hidden" name="id" value={entry.id} />
                  <Button type="submit" variant="secondary">
                    Koreksi pembalik
                  </Button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {bisaTulis ? (
        <form action={saveCashEntry} className="flex flex-col gap-4">
          <h3 className="font-display text-label uppercase text-accent">Entri baru</h3>
          <input type="hidden" name="cashBookId" value={selected.id} />
          <Field id="date" label="Tanggal">
            <input id="date" name="date" type="date" required defaultValue={toDateInput(new Date())} className={KELAS_KONTROL} />
          </Field>
          <Field id="direction" label="Arah">
            <select id="direction" name="direction" className={KELAS_KONTROL}>
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </select>
          </Field>
          <Field id="amount" label="Jumlah (IDR)">
            <input id="amount" name="amount" type="number" min={1} required className={KELAS_KONTROL} />
          </Field>
          <Field id="categoryId" label="Kategori">
            <select id="categoryId" name="categoryId" required className={KELAS_KONTROL}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="description" label="Uraian">
            <input id="description" name="description" required className={KELAS_KONTROL} />
          </Field>
          <Button type="submit">Catat entri</Button>
        </form>
      ) : null}
    </div>
  )
}
