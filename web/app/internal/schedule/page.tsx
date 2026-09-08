import { deleteEvent, saveEvent } from '@/app/internal/schedule/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { canWriteSchedule } from '@/lib/auth/permissions'
import { requireGrant, requireInternalUser } from '@/lib/auth/require'
import { formatMatchDate } from '@/lib/content/format'
import { toDatetimeLocal } from '@/lib/datetime'
import { prisma } from '@/lib/db'

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; peringatan?: string }>
}) {
  const user = await requireInternalUser()
  requireGrant(user, 'jadwal', 'view')
  const bisaTambah = canWriteSchedule(user.matrix, user.id, user.id)
  const params = await searchParams
  const now = new Date()
  const bulan = params.bulan ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [tahun, bulanAngka] = bulan.split('-').map(Number)
  const awal = new Date(tahun, bulanAngka - 1, 1)
  const akhir = new Date(tahun, bulanAngka, 1)

  const events = await prisma.scheduleEvent.findMany({
    where: { startAt: { gte: awal, lt: akhir } },
    include: { owner: true },
    orderBy: { startAt: 'asc' },
  })

  const prev = new Date(tahun, bulanAngka - 2, 1)
  const next = new Date(tahun, bulanAngka, 1)
  const fmt = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-section uppercase">Jadwal</h2>
          <div className="flex gap-2">
            <a href={`/internal/schedule?bulan=${fmt(prev)}`} className="inline-flex min-h-11 items-center border-2 border-border-strong px-4">
              Bulan lalu
            </a>
            <a href={`/internal/schedule?bulan=${fmt(next)}`} className="inline-flex min-h-11 items-center border-2 border-border-strong px-4">
              Bulan depan
            </a>
          </div>
        </div>
        {params.peringatan === 'tumpang' ? (
          <p role="status" className="mb-4 text-body text-accent">
            Event tersimpan, tetapi menimpa jadwal lain.
          </p>
        ) : null}
        {events.length === 0 ? (
          <p className="text-content-secondary">Belum ada event di bulan ini.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <li key={event.id} className="border-2 border-border-strong p-4">
                <p className="font-display text-body font-semibold">{event.title}</p>
                <p className="text-small text-content-muted">
                  {formatMatchDate(event.startAt.toISOString())} · {event.location || 'Tanpa lokasi'} · {event.owner.name}
                </p>
                {event.notes ? <p className="mt-2 text-body">{event.notes}</p> : null}
                {canWriteSchedule(user.matrix, event.ownerId, user.id) ? (
                <form action={deleteEvent} className="mt-3">
                  <input type="hidden" name="id" value={event.id} />
                  <Button type="submit" variant="destructive">
                    Hapus
                  </Button>
                </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
      {bisaTambah ? (
      <form action={saveEvent} className="flex flex-col gap-4">
        <h3 className="font-display text-label uppercase text-accent">Event baru</h3>
        <p className="text-small text-content-secondary">{user.name} sebagai pemilik.</p>
        <Field id="title" label="Judul">
          <input id="title" name="title" required className={KELAS_KONTROL} />
        </Field>
        <Field id="startAt" label="Mulai">
          <input id="startAt" name="startAt" type="datetime-local" required defaultValue={toDatetimeLocal(new Date())} className={KELAS_KONTROL} />
        </Field>
        <Field id="endAt" label="Selesai">
          <input id="endAt" name="endAt" type="datetime-local" required defaultValue={toDatetimeLocal(new Date(Date.now() + 3600000))} className={KELAS_KONTROL} />
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
    </div>
  )
}
