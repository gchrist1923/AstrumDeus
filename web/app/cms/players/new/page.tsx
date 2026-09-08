import { PlayerForm } from '@/app/cms/players/player-form'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'

export default async function NewPlayerPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'roster', 'create')
  return <PlayerForm canSave />
}
