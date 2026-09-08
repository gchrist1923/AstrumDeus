import { notFound } from 'next/navigation'
import { PlayerForm } from '@/app/cms/players/player-form'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsUser()
  requireGrant(user, 'roster', 'view')
  const { id } = await params
  const player = await prisma.player.findUnique({ where: { id } })

  if (!player) {
    notFound()
  }

  return (
    <PlayerForm
      player={player}
      canSave={can(user.matrix, 'roster', 'update')}
      canDelete={can(user.matrix, 'roster', 'delete')}
    />
  )
}
