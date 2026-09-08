import { MatchForm } from '@/app/cms/matches/match-form'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function NewMatchPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'matches', 'create')
  const tournaments = await prisma.tournament.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
  return <MatchForm tournaments={tournaments} canSave />
}
