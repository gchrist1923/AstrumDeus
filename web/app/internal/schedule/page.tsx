import { deleteEvent, saveEvent } from '@/app/internal/schedule/actions'
import { ConfirmSubmit } from '@/components/admin/confirm-submit'
import { Field, KELAS_FOKUS, KELAS_KONTROL } from '@/components/admin/form-field'
import { JadwalDialog } from '@/components/admin/jadwal-dialog'
import { Button } from '@/components/ui/button'
import { canWriteSchedule } from '@/lib/auth/permissions'
import { requireGrant, requireInternalUser } from '@/lib/auth/require'
import { toDateInput, toDatetimeLocal } from '@/lib/datetime'
import { prisma } from '@/lib/db'
import { chipKalender } from '@/lib/schedule/chip-kalender'
import { defaultEventRange, formatHari, monthGrid, parseBulan } from '@/lib/schedule/month'

const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

function fmtBulan(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

function potong(teks: string, max = 22): string {
  return teks.length > max ? `${teks.slice(0, max - 1)}…` : teks
}

function judulHari(iso: string): string {
  const [tahun, bulan, tanggal] = iso.split('-').map(Number)
  return `${tanggal} ${NAMA_BULAN[(bulan ?? 1) - 1]} ${tahun}`
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; hari?: string; id?: string; baru?: string; peringatan?: string }>
}) {
  const user = await requireInternalUser()
  requireGrant(user, 'jadwal', 'view')
  const bisaTambah = canWriteSchedule(user.matrix, user.id, user.id)
  const params = await searchParams
  const now = new Date()
  const { year, month } = parseBulan(params.bulan, now)
  const bulan = fmtBulan(year, month)
  const cells = monthGrid(year, month)
  const pertama = cells[0]
  const terakhir = cells[cells.length - 1]
  const [fy, fm, fd] = (pertama?.iso ?? `${bulan}-01`).split('-').map(Number)
  const [ly, lm, ld] = (terakhir?.iso ?? `${bulan}-28`).split('-').map(Number)
  const awal = new Date(fy, fm - 1, fd)
  const akhir = new Date(ly, lm - 1, ld + 1)

  const events = await prisma.scheduleEvent.findMany({
    where: { startAt: { gte: awal, lt: akhir } },
    include: { owner: true },
    orderBy: { startAt: 'asc' },
  })

  const byDay = new Map<string, typeof events>()
  for (const event of events) {
    const key = toDateInput(event.startAt)
    const list = byDay.get(key) ?? []
    list.push(event)
    byDay.set(key, list)
  }

  const selected = params.id
    ? (events.find((event) => event.id === params.id) ??
      (await prisma.scheduleEvent.findUnique({
        where: { id: params.id },
        include: { owner: true },
      })))
    : null
  const bisaTulisSelected = selected ? canWriteSchedule(user.matrix, selected.ownerId, user.id) : false
  const hari = /^\d{4}-\d{2}-\d{2}$/.test(params.hari ?? '') ? params.hari : undefined
  const buatBaru = Boolean(bisaTambah && hari && !selected && params.baru === '1')
  const daftarHari = Boolean(hari && !selected && !buatBaru)
  const range = hari ? defaultEventRange(hari, now) : null
  const todayIso = formatHari(now)
  const isiHari = hari ? (byDay.get(hari) ?? []) : []
  const tutupHref = `/internal/schedule?bulan=${bulan}`
  const dialogTerbuka = Boolean(selected || buatBaru || daftarHari)
  const judulDialog = selected
    ? bisaTulisSelected
      ? 'Ubah event'
      : 'Lihat event'
    : buatBaru
      ? 'Buat event'
      : hari
        ? judulHari(hari)
        : 'Jadwal'

  const prev = new Date(year, month - 2, 1)
  const next = new Date(year, month, 1)
  const fmt = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-section uppercase">
          Jadwal · {NAMA_BULAN[month - 1]} {year}
        </h2>
        <div className="flex gap-2">
          <a
            href={`/internal/schedule?bulan=${fmt(prev)}`}
            className={`inline-flex min-h-11 items-center border-2 border-border-strong px-4 font-display text-label uppercase ${KELAS_FOKUS}`}
          >
            Bulan lalu
          </a>
          <a
            href={`/internal/schedule?bulan=${fmt(next)}`}
            className={`inline-flex min-h-11 items-center border-2 border-border-strong px-4 font-display text-label uppercase ${KELAS_FOKUS}`}
          >
            Bulan depan
          </a>
        </div>
      </div>
      {params.peringatan === 'tumpang' ? (
        <p role="status" className="mb-4 text-body text-accent">
          Event tersimpan, tetapi menimpa jadwal lain.
        </p>
      ) : null}

      <div className="grid grid-cols-7 border-2 border-border-strong">
        {HARI.map((nama) => (
          <div
            key={nama}
            className="border-b-2 border-border-strong px-2 py-3 text-center font-display text-label uppercase text-content-muted"
          >
            {nama}
          </div>
        ))}
        {cells.map((cell) => {
          const isi = byDay.get(cell.iso) ?? []
          const { tampil, sisa } = chipKalender(isi)
          const hariIni = cell.iso === todayIso
          return (
            <div
              key={cell.iso}
              className={`flex min-h-28 flex-col gap-1 border-border-strong p-2 ${
                cell.inMonth ? '' : 'bg-surface-overlay/40 text-content-muted'
              } ${hariIni ? 'outline outline-2 outline-accent outline-offset-[-2px]' : ''}`}
            >
              <a
                href={`/internal/schedule?bulan=${cell.bulanHref}&hari=${cell.iso}`}
                className={`inline-flex min-h-11 items-start font-display text-label uppercase ${KELAS_FOKUS}`}
              >
                {cell.day}
                {hariIni ? <span className="ms-2 text-content-secondary">Hari ini</span> : null}
              </a>
              {tampil.map((event) => (
                <p key={event.id} className="truncate border-2 border-border-strong px-2 py-1 text-small">
                  {toDatetimeLocal(event.startAt).slice(11, 16)} {potong(event.title)}
                </p>
              ))}
              {sisa > 0 ? <p className="text-small text-content-muted">{`+${sisa} event`}</p> : null}
            </div>
          )
        })}
      </div>

      {dialogTerbuka ? (
        <JadwalDialog judul={judulDialog} tutupHref={tutupHref}>
          {daftarHari && hari ? (
            <div className="flex flex-col gap-4">
              {isiHari.length === 0 ? (
                <p className="text-body text-content-secondary">Tidak ada event.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {isiHari.map((event) => (
                    <li key={event.id}>
                      <a
                        href={`/internal/schedule?bulan=${bulan}&hari=${hari}&id=${event.id}`}
                        className={`flex min-h-11 items-center border-2 border-border-strong px-4 text-body ${KELAS_FOKUS}`}
                      >
                        {toDatetimeLocal(event.startAt).slice(11, 16)} {event.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {bisaTambah ? (
                <a
                  href={`/internal/schedule?bulan=${bulan}&hari=${hari}&baru=1`}
                  className={`inline-flex min-h-11 items-center justify-center bg-accent px-6 font-display text-label uppercase text-surface-raised ${KELAS_FOKUS}`}
                >
                  Buat event
                </a>
              ) : null}
            </div>
          ) : null}

          {selected && bisaTulisSelected ? (
            <>
              <form action={saveEvent} className="flex flex-col gap-4">
                <p className="text-small text-content-secondary">{selected.owner.name} sebagai pemilik.</p>
                <input type="hidden" name="id" value={selected.id} />
                <input type="hidden" name="bulan" value={bulan} />
                <Field id="title" label="Judul">
                  <input
                    id="title"
                    name="title"
                    required
                    defaultValue={selected.title}
                    className={KELAS_KONTROL}
                  />
                </Field>
                <Field id="startAt" label="Mulai">
                  <input
                    id="startAt"
                    name="startAt"
                    type="datetime-local"
                    required
                    defaultValue={toDatetimeLocal(selected.startAt)}
                    className={KELAS_KONTROL}
                  />
                </Field>
                <Field id="endAt" label="Selesai">
                  <input
                    id="endAt"
                    name="endAt"
                    type="datetime-local"
                    required
                    defaultValue={toDatetimeLocal(selected.endAt)}
                    className={KELAS_KONTROL}
                  />
                </Field>
                <Field id="location" label="Lokasi">
                  <input id="location" name="location" defaultValue={selected.location} className={KELAS_KONTROL} />
                </Field>
                <Field id="notes" label="Catatan">
                  <textarea id="notes" name="notes" rows={3} defaultValue={selected.notes} className={KELAS_KONTROL} />
                </Field>
                <Button type="submit">Simpan event</Button>
              </form>
              <form action={deleteEvent} className="mt-6">
                <input type="hidden" name="id" value={selected.id} />
                <input type="hidden" name="bulan" value={bulan} />
                <ConfirmSubmit message="Hapus event ini?" variant="destructive">
                  Hapus
                </ConfirmSubmit>
              </form>
            </>
          ) : null}

          {selected && !bisaTulisSelected ? (
            <div className="flex flex-col gap-4">
              <p className="font-display text-body font-semibold">{selected.title}</p>
              <p className="text-small text-content-muted">
                {toDatetimeLocal(selected.startAt).replace('T', ' ')} –{' '}
                {toDatetimeLocal(selected.endAt).replace('T', ' ')}
              </p>
              <p className="text-body">{selected.location || 'Tanpa lokasi'}</p>
              {selected.notes ? <p className="text-body">{selected.notes}</p> : null}
              <p className="text-small text-content-muted">{selected.owner.name}</p>
            </div>
          ) : null}

          {buatBaru && range ? (
            <form action={saveEvent} className="flex flex-col gap-4">
              <p className="text-small text-content-secondary">{user.name} sebagai pemilik.</p>
              <input type="hidden" name="bulan" value={bulan} />
              <Field id="title" label="Judul">
                <input id="title" name="title" required autoFocus className={KELAS_KONTROL} />
              </Field>
              <Field id="startAt" label="Mulai">
                <input
                  id="startAt"
                  name="startAt"
                  type="datetime-local"
                  required
                  defaultValue={range.startAt}
                  className={KELAS_KONTROL}
                />
              </Field>
              <Field id="endAt" label="Selesai">
                <input
                  id="endAt"
                  name="endAt"
                  type="datetime-local"
                  required
                  defaultValue={range.endAt}
                  className={KELAS_KONTROL}
                />
              </Field>
              <Field id="location" label="Lokasi">
                <input id="location" name="location" className={KELAS_KONTROL} />
              </Field>
              <Field id="notes" label="Catatan">
                <textarea id="notes" name="notes" rows={3} className={KELAS_KONTROL} />
              </Field>
              <Button type="submit">Simpan event</Button>
            </form>
          ) : null}
        </JadwalDialog>
      ) : null}
    </div>
  )
}
