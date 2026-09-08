import { notFound } from 'next/navigation'
import { MatchForm } from '@/app/cms/matches/match-form'
import { activePlusCurrent } from '@/lib/content/active-options'
import { prisma } from '@/lib/db'

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [match, tournaments] = await Promise.all([
    prisma.match.findUnique({ where: { id }, include: { recap: true } }),
    prisma.tournament.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!match) {
    notFound()
  }

  return (
    <MatchForm
      tournaments={activePlusCurrent(tournaments, match.tournamentId)}
      match={{
        id: match.id,
        tournamentId: match.tournamentId,
        stage: match.stage,
        scheduledAt: match.scheduledAt,
        status: match.status,
        placement: match.placement,
        points: match.points,
        wwcdCount: match.wwcdCount,
        location: match.location,
        recapSlug: match.recap?.slug ?? '',
        map: match.map ?? '',
        streamUrl: match.streamUrl ?? '',
      }}
    />
  )
}
