import Link from 'next/link'
import type { LiveEvent } from '@/lib/content/types'

export function LiveBar({ event }: { event: LiveEvent | null }) {
  if (!event) {
    return null
  }

  return (
    <div className="bg-accent text-surface-raised">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-4 px-5 py-3 font-display text-small font-bold uppercase tracking-wide md:px-8">
        <span className="inline-block size-2 bg-surface-raised" aria-hidden="true" />
        <span>Live</span>
        <span className="text-surface-raised/70" aria-hidden="true">
          ·
        </span>
        <span>
          {event.tournament} {event.stage}
          {event.map ? ` · ${event.map}` : ''}
        </span>
        <Link
          href={event.href}
          className="ml-auto min-h-11 border-b-2 border-surface-raised font-display text-label uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-raised"
        >
          Tonton stream
        </Link>
      </div>
    </div>
  )
}
