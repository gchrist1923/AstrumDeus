'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canWriteSchedule } from '@/lib/auth/permissions'
import { requireInternalUser } from '@/lib/auth/require'
import { fromDatetimeLocal } from '@/lib/datetime'
import { pathDenganFlash } from '@/lib/flash'
import { adaKosong, checked, teks } from '@/lib/form'
import { eventsOverlap } from '@/lib/schedule/overlap'
import { prisma } from '@/lib/db'

export async function saveEvent(formData: FormData): Promise<void> {
  const user = await requireInternalUser()
  const id = teks(formData, 'id')
  const existing = id ? await prisma.scheduleEvent.findUnique({ where: { id } }) : null

  if (existing && !canWriteSchedule(user.matrix, existing.ownerId, user.id)) {
    redirect('/internal/schedule')
  }

  if (!existing && !canWriteSchedule(user.matrix, user.id, user.id)) {
    redirect('/internal/schedule')
  }

  if (adaKosong(formData, ['title', 'startAt', 'endAt'])) {
    redirect(pathDenganFlash('/internal/schedule', { kesalahan: 'isi' }))
  }

  const startAt = fromDatetimeLocal(teks(formData, 'startAt'))
  const endAt = fromDatetimeLocal(teks(formData, 'endAt'))
  const data = {
    title: teks(formData, 'title'),
    startAt,
    endAt,
    isAllDay: checked(formData, 'isAllDay'),
    location: teks(formData, 'location'),
    notes: teks(formData, 'notes'),
    ownerId: existing?.ownerId ?? user.id,
  }

  const others = await prisma.scheduleEvent.findMany({
    where: id ? { id: { not: id } } : undefined,
  })
  const overlap = others.some((event) => eventsOverlap(event, data))

  if (id) {
    await prisma.scheduleEvent.update({ where: { id }, data })
  } else {
    await prisma.scheduleEvent.create({ data })
  }

  revalidatePath('/internal/schedule')
  const bulan = teks(formData, 'bulan')
  redirect(
    pathDenganFlash(
      '/internal/schedule',
      {
        ok: id ? 'ubah' : 'simpan',
        peringatan: overlap ? 'tumpang' : undefined,
      },
      /^\d{4}-\d{2}$/.test(bulan) ? { bulan } : {},
    ),
  )
}

export async function deleteEvent(formData: FormData): Promise<void> {
  const user = await requireInternalUser()
  const id = teks(formData, 'id')
  const existing = await prisma.scheduleEvent.findUnique({ where: { id } })

  if (!existing || !canWriteSchedule(user.matrix, existing.ownerId, user.id)) {
    return
  }

  await prisma.scheduleEvent.delete({ where: { id } })
  revalidatePath('/internal/schedule')
  const bulan = teks(formData, 'bulan')
  redirect(
    pathDenganFlash(
      '/internal/schedule',
      { ok: 'hapus' },
      /^\d{4}-\d{2}$/.test(bulan) ? { bulan } : {},
    ),
  )
}
