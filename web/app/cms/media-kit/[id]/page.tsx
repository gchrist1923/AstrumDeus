import { notFound } from 'next/navigation'
import { deleteAsset, saveAsset } from '@/app/cms/media-kit/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const asset = await prisma.mediaKitAsset.findUnique({ where: { id } })

  if (!asset) {
    notFound()
  }

  return (
    <form action={saveAsset} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="id" value={asset.id} />
      <Field id="name" label="Nama">
        <input id="name" name="name" required defaultValue={asset.name} className={KELAS_KONTROL} />
      </Field>
      <Field id="description" label="Deskripsi">
        <textarea id="description" name="description" rows={3} defaultValue={asset.description} className={KELAS_KONTROL} />
      </Field>
      <Field id="groupName" label="Grup">
        <select id="groupName" name="groupName" defaultValue={asset.groupName} className={KELAS_KONTROL}>
          <option value="logo">Logo</option>
          <option value="warna">Warna</option>
          <option value="foto">Foto</option>
          <option value="tipografi">Tipografi</option>
        </select>
      </Field>
      <Field id="href" label="Berkas">
        <input id="href" name="href" required defaultValue={asset.href} className={KELAS_KONTROL} />
      </Field>
      <Field id="fileType" label="Jenis">
        <input id="fileType" name="fileType" defaultValue={asset.fileType} className={KELAS_KONTROL} />
      </Field>
      <Field id="fileSize" label="Ukuran">
        <input id="fileSize" name="fileSize" defaultValue={asset.fileSize} className={KELAS_KONTROL} />
      </Field>
      <Field id="sortOrder" label="Urutan">
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={asset.sortOrder} className={KELAS_KONTROL} />
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Simpan</Button>
        <Button formAction={deleteAsset} variant="destructive" type="submit">
          Hapus
        </Button>
      </div>
    </form>
  )
}
