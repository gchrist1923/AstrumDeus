import { notFound } from 'next/navigation'
import { PlayerForm } from '@/app/cms/players/player-form'
import { prisma } from '@/lib/db'

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = await prisma.player.findUnique({ where: { id } })

  if (!player) {
    notFound()
  }

  return <PlayerForm player={player} />
}
