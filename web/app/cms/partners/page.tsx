import { savePartner } from '@/app/cms/partners/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function CmsPartnersPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'partners', 'view')
  const bisaTambah = can(user.matrix, 'partners', 'create')
  const bisaUbah = can(user.matrix, 'partners', 'update')
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <h2 className="mb-6 font-display text-section uppercase">Partners</h2>
        <ul className="flex flex-col gap-3">
          {partners.map((partner) => (
            <li key={partner.id} className="flex flex-wrap items-center justify-between gap-3 border-2 border-border-strong p-4">
              <div>
                <p className="font-display text-body font-semibold">{partner.name}</p>
                <p className="text-small text-content-muted">{partner.tier}</p>
              </div>
              {bisaUbah ? (
                <a href={`/cms/partners/${partner.id}`} className="inline-flex min-h-11 items-center text-accent underline">
                  Ubah
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {bisaTambah ? (
        <form action={savePartner} className="flex flex-col gap-4">
          <h3 className="font-display text-label uppercase text-accent">Tambah partner</h3>
          <Field id="name" label="Nama">
            <input id="name" name="name" required className={KELAS_KONTROL} />
          </Field>
          <Field id="slug" label="Slug">
            <input id="slug" name="slug" required className={KELAS_KONTROL} />
          </Field>
          <Field id="tier" label="Tier">
            <input id="tier" name="tier" required defaultValue="Official" className={KELAS_KONTROL} />
          </Field>
          <ImageUpload name="logo" label="Logo" />
          <Field id="logoText" label="Teks logo">
            <input id="logoText" name="logoText" required className={KELAS_KONTROL} />
          </Field>
          <Field id="href" label="Tautan">
            <input id="href" name="href" className={KELAS_KONTROL} />
          </Field>
          <Field id="sortOrder" label="Urutan">
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={partners.length + 1} className={KELAS_KONTROL} />
          </Field>
          <Button type="submit">Simpan</Button>
        </form>
      ) : null}
    </div>
  )
}
