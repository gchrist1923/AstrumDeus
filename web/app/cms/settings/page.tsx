import { saveSettings } from '@/app/cms/settings/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { can } from '@/lib/auth/grants'
import { requireCmsUser, requireGrant } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function SettingsPage() {
  const user = await requireCmsUser()
  requireGrant(user, 'situs', 'view')
  const bisaUbah = can(user.matrix, 'situs', 'update')

  const setting = await prisma.siteSetting.findUnique({ where: { id: 'default' } })

  if (!setting) {
    return <p className="text-content-secondary">Pengaturan belum di-seed.</p>
  }

  return (
    <form action={saveSettings} className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <h2 className="font-display text-section uppercase">Situs</h2>
      <Field id="siteName" label="Nama situs">
        <input id="siteName" name="siteName" defaultValue={setting.siteName} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <ImageUpload name="logo" label="Logo" defaultValue={setting.logo} disabled={!bisaUbah} />
      <ImageUpload name="favicon" label="Favicon" defaultValue={setting.favicon} disabled={!bisaUbah} />
      <Field id="defaultMetaTitle" label="Judul meta">
        <input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue={setting.defaultMetaTitle} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="defaultMetaDesc" label="Deskripsi meta">
        <textarea id="defaultMetaDesc" name="defaultMetaDesc" rows={3} defaultValue={setting.defaultMetaDesc} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <h3 className="font-display text-label uppercase text-content-muted">Beranda</h3>
      <Field id="heroEyebrow" label="Eyebrow">
        <input id="heroEyebrow" name="heroEyebrow" defaultValue={setting.heroEyebrow} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="heroTitle" label="Judul hero">
        <input id="heroTitle" name="heroTitle" defaultValue={setting.heroTitle} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="heroTagline" label="Paragraf hero">
        <textarea id="heroTagline" name="heroTagline" rows={3} defaultValue={setting.heroTagline} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <ImageUpload name="heroImage" label="Gambar hero" defaultValue={setting.heroImage} disabled={!bisaUbah} />
      <Field id="heroImageAlt" label="Alt foto">
        <input id="heroImageAlt" name="heroImageAlt" defaultValue={setting.heroImageAlt} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="contactEmail" label="Email kontak">
        <input id="contactEmail" name="contactEmail" defaultValue={setting.contactEmail} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="contactAddress" label="Alamat">
        <input id="contactAddress" name="contactAddress" defaultValue={setting.contactAddress} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="contactPhone" label="Telepon">
        <input id="contactPhone" name="contactPhone" defaultValue={setting.contactPhone} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="titles" label="Gelar">
        <input id="titles" name="titles" type="number" defaultValue={setting.titles} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="tournaments" label="Turnamen">
        <input id="tournaments" name="tournaments" type="number" defaultValue={setting.tournaments} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      <Field id="wwcd" label="WWCD">
        <input id="wwcd" name="wwcd" type="number" defaultValue={setting.wwcd} disabled={!bisaUbah} className={KELAS_KONTROL} />
      </Field>
      {bisaUbah ? <Button type="submit">Simpan pengaturan</Button> : null}
    </form>
  )
}
