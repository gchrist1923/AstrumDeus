import Link from 'next/link'
import type { Player } from '@/lib/content/types'

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/roster/${player.slug}`}
      className="relative block min-h-11 overflow-hidden bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <img
        src={player.photo}
        alt={`Pemain ${player.ign}`}
        className="aspect-[3/4] w-full object-cover grayscale contrast-[1.1] brightness-[.88]"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-raised from-40% to-transparent px-4 pb-4 pt-12">
        <h3 className="font-display text-card uppercase leading-none">{player.ign}</h3>
        <p className="mt-2 font-display text-label uppercase text-accent">{player.role}</p>
      </span>
    </Link>
  )
}
