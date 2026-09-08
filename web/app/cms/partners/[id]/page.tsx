import { notFound } from 'next/navigation'
import { deletePartner, savePartner } from '@/app/cms/partners/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partner = await prisma.partner.findUnique({ where: { id } })

  if (!partner) {
    notFound()
  }

  return (
    <form action={savePartner} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="id" value={partner.id} />
      <Field id="name" label="Nama">
        <input id="name" name="name" required defaultValue={partner.name} className={KELAS_KONTROL} />
      </Field>
      <Field id="slug" label="Slug">
        <input id="slug" name="slug" required defaultValue={partner.slug} className={KELAS_KONTROL} />
      </Field>
      <Field id="tier" label="Tier">
        <input id="tier" name="tier" required defaultValue={partner.tier} className={KELAS_KONTROL} />
      </Field>
      <ImageUpload name="logo" label="Logo" defaultValue={partner.logo ?? ''} />
      <Field id="logoText" label="Teks logo">
        <input id="logoText" name="logoText" required defaultValue={partner.logoText} className={KELAS_KONTROL} />
      </Field>
      <Field id="href" label="Tautan">
        <input id="href" name="href" defaultValue={partner.href ?? ''} className={KELAS_KONTROL} />
      </Field>
      <Field id="sortOrder" label="Urutan">
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={partner.sortOrder} className={KELAS_KONTROL} />
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Simpan</Button>
        <Button formAction={deletePartner} variant="destructive" type="submit">
          Hapus
        </Button>
      </div>
    </form>
  )
}
