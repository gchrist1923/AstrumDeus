import { MatchForm } from '@/app/cms/matches/match-form'
import { prisma } from '@/lib/db'

export default async function NewMatchPage() {
  const tournaments = await prisma.tournament.findMany({ orderBy: { name: 'asc' } })
  return <MatchForm tournaments={tournaments} />
}
