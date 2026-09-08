import { describe, expect, it } from 'vitest'
import { eventsOverlap } from '@/lib/schedule/overlap'

describe('eventsOverlap', () => {
  it('mendeteksi dua event yang saling menimpa', () => {
    expect(
      eventsOverlap(
        { startAt: '2026-09-08T10:00:00+07:00', endAt: '2026-09-08T12:00:00+07:00' },
        { startAt: '2026-09-08T11:00:00+07:00', endAt: '2026-09-08T13:00:00+07:00' },
      ),
    ).toBe(true)
  })

  it('mengizinkan event yang hanya bersentuhan di ujung', () => {
    expect(
      eventsOverlap(
        { startAt: '2026-09-08T10:00:00+07:00', endAt: '2026-09-08T12:00:00+07:00' },
        { startAt: '2026-09-08T12:00:00+07:00', endAt: '2026-09-08T13:00:00+07:00' },
      ),
    ).toBe(false)
  })
})
