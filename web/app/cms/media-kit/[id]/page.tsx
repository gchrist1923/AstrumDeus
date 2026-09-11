import { notFound } from 'next/navigation'
import { MediaKitAssetForm } from '@/app/cms/media-kit/asset-form'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsUser()
  requireGrant(user, 'media-kit', 'view')
  const { id } = await params
  const asset = await prisma.mediaKitAsset.findUnique({ where: { id } })

  if (!asset) {
    notFound()
  }

  const bisaUbah = can(user.matrix, 'media-kit', 'update')
  const bisaHapus = can(user.matrix, 'media-kit', 'delete')

  return <MediaKitAssetForm asset={asset} canSave={bisaUbah} canDelete={bisaHapus} />
}
