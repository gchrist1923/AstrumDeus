import { MediaKitAssetForm } from '@/app/cms/media-kit/asset-form'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'

export default async function NewMediaKitPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'media-kit', 'create')
  return <MediaKitAssetForm canSave />
}
