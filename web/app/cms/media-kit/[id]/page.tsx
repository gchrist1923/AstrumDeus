import { notFound } from 'next/navigation'
import { deleteAsset, saveAsset } from '@/app/cms/media-kit/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
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

  return (
    <form action={saveAsset} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="id" value={asset.id} />
      <Field id="name" label="Nama">
        <input id="name" name="name" required defaultValue={asset.name} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="description" label="Deskripsi">
        <textarea id="description" name="description" rows={3} defaultValue={asset.description} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="groupName" label="Grup">
        <select id="groupName" name="groupName" defaultValue={asset.groupName} disabled={!bisaUbah} className={KELAS_KONTROL}>
          <option value="logo">Logo</option>
          <option value="warna">Warna</option>
          <option value="foto">Foto</option>
          <option value="tipografi">Tipografi</option>
        </select>
      </Field>
      <ImageUpload name="href" label="Berkas" defaultValue={asset.href} required disabled={!bisaUbah} />
      <Field id="fileType" label="Jenis">
        <input id="fileType" name="fileType" defaultValue={asset.fileType} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="fileSize" label="Ukuran">
        <input id="fileSize" name="fileSize" defaultValue={asset.fileSize} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="sortOrder" label="Urutan">
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={asset.sortOrder} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <div className="flex flex-wrap gap-3">
        {bisaUbah ? <Button type="submit">Simpan</Button> : null}
        {bisaHapus ? (
          <Button formAction={deleteAsset} variant="destructive" type="submit">
            Hapus
          </Button>
        ) : null}
      </div>
    </form>
  )
}
