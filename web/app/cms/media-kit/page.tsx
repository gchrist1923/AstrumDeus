import { saveAsset } from '@/app/cms/media-kit/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

export default async function CmsMediaKitPage() {
  const assets = await prisma.mediaKitAsset.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div>
      <h2 className="mb-6 font-display text-section uppercase">Media Kit</h2>
      <ul className="mb-10 flex flex-col gap-3">
        {assets.map((asset) => (
          <li key={asset.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong px-4 py-3">
            <div>
              <p className="font-display text-body font-semibold">{asset.name}</p>
              <p className="text-small text-content-muted">{asset.groupName}</p>
            </div>
            <a href={`/cms/media-kit/${asset.id}`} className="inline-flex min-h-11 items-center text-accent underline">
              Ubah
            </a>
          </li>
        ))}
      </ul>
      <form action={saveAsset} className="flex max-w-xl flex-col gap-4">
        <h3 className="font-display text-label uppercase text-accent">Tambah aset</h3>
        <Field id="name" label="Nama">
          <input id="name" name="name" required className={KELAS_KONTROL} />
        </Field>
        <Field id="description" label="Deskripsi">
          <textarea id="description" name="description" rows={3} className={KELAS_KONTROL} />
        </Field>
        <Field id="groupName" label="Grup">
          <select id="groupName" name="groupName" className={KELAS_KONTROL}>
            <option value="logo">Logo</option>
            <option value="warna">Warna</option>
            <option value="foto">Foto</option>
            <option value="tipografi">Tipografi</option>
          </select>
        </Field>
        <ImageUpload name="href" label="Berkas" defaultValue="/logo-astrum-deus.png" required />
        <Field id="fileType" label="Jenis">
          <input id="fileType" name="fileType" defaultValue="PNG" className={KELAS_KONTROL} />
        </Field>
        <Field id="fileSize" label="Ukuran">
          <input id="fileSize" name="fileSize" defaultValue="—" className={KELAS_KONTROL} />
        </Field>
        <Field id="sortOrder" label="Urutan">
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={assets.length + 1} className={KELAS_KONTROL} />
        </Field>
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  )
}
