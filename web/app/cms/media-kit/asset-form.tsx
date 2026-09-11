import { deleteAsset, saveAsset } from '@/app/cms/media-kit/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'

type AssetValues = {
  id?: string
  name: string
  description: string
  groupName: string
  href: string
  fileType: string
  fileSize: string
  sortOrder: number
}

export function MediaKitAssetForm({
  asset,
  canSave,
  canDelete = false,
}: {
  asset?: AssetValues
  canSave: boolean
  canDelete?: boolean
}) {
  return (
    <form action={saveAsset} className="mx-auto flex w-full max-w-xl flex-col gap-4">
      {asset?.id ? <input type="hidden" name="id" value={asset.id} /> : null}
      <Field id="name" label="Nama">
        <input id="name" name="name" required defaultValue={asset?.name} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="description" label="Deskripsi">
        <textarea id="description" name="description" rows={3} defaultValue={asset?.description} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="groupName" label="Grup">
        <select id="groupName" name="groupName" defaultValue={asset?.groupName ?? 'logo'} disabled={!canSave} className={KELAS_KONTROL}>
          <option value="logo">Logo</option>
          <option value="warna">Warna</option>
          <option value="foto">Foto</option>
          <option value="tipografi">Tipografi</option>
        </select>
      </Field>
      <ImageUpload
        name="href"
        label="Berkas"
        defaultValue={asset?.href}
        required
        disabled={!canSave}
        meta={{
          fileTypeName: 'fileType',
          fileSizeName: 'fileSize',
          defaultFileType: asset?.fileType,
          defaultFileSize: asset?.fileSize,
        }}
      />
      <Field id="sortOrder" label="Urutan">
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={asset?.sortOrder ?? 1}
          disabled={!canSave}
          className={KELAS_KONTROL}
        />
      </Field>
      <div className="flex flex-wrap gap-3">
        {canSave ? <Button type="submit">Simpan</Button> : null}
        {asset?.id && canDelete ? (
          <Button formAction={deleteAsset} variant="destructive" type="submit">
            Hapus
          </Button>
        ) : null}
      </div>
    </form>
  )
}
