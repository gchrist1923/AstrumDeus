import { notFound } from 'next/navigation'
import { deletePartner, savePartner } from '@/app/cms/partners/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireCmsUser()
  requireGrant(user, 'partners', 'view')
  const { id } = await params
  const partner = await prisma.partner.findUnique({ where: { id } })

  if (!partner) {
    notFound()
  }

  const bisaUbah = can(user.matrix, 'partners', 'update')
  const bisaHapus = can(user.matrix, 'partners', 'delete')

  return (
    <form action={savePartner} className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <h2 className="font-display text-section uppercase">Ubah partner</h2>
      <input type="hidden" name="id" value={partner.id} />
      <Field id="name" label="Nama">
        <input id="name" name="name" required defaultValue={partner.name} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="slug" label="Slug">
        <input id="slug" name="slug" required defaultValue={partner.slug} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="tier" label="Tier">
        <input id="tier" name="tier" required defaultValue={partner.tier} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <ImageUpload name="logo" label="Logo" defaultValue={partner.logo ?? ''} disabled={!bisaUbah} />
      <Field id="logoText" label="Teks logo">
        <input id="logoText" name="logoText" required defaultValue={partner.logoText} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="href" label="Tautan">
        <input id="href" name="href" defaultValue={partner.href ?? ''} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="sortOrder" label="Urutan">
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={partner.sortOrder} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <div className="flex flex-wrap gap-3">
        {bisaUbah ? <Button type="submit">Simpan</Button> : null}
        {bisaHapus ? (
          <Button formAction={deletePartner} variant="destructive" type="submit">
            Hapus
          </Button>
        ) : null}
      </div>
    </form>
  )
}
