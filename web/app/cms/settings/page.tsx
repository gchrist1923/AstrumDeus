import { saveSettings } from '@/app/cms/settings/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { canManageSettings } from '@/lib/auth/roles'
import { requireCmsUser } from '@/lib/auth/require'
import { prisma } from '@/lib/db'

export default async function SettingsPage() {
  const user = await requireCmsUser()
  if (!canManageSettings(user.roles)) {
    return <p className="text-content-secondary">Hanya Admin yang mengubah pengaturan situs.</p>
  }

  const setting = await prisma.siteSetting.findUnique({ where: { id: 'default' } })

  if (!setting) {
    return <p className="text-content-secondary">Pengaturan belum di-seed.</p>
  }

  return (
    <form action={saveSettings} className="flex max-w-xl flex-col gap-6">
      <h2 className="font-display text-section uppercase">Situs</h2>
      <Field id="siteName" label="Nama situs">
        <input id="siteName" name="siteName" defaultValue={setting.siteName} className={KELAS_KONTROL} />
      </Field>
      <ImageUpload name="logo" label="Logo" defaultValue={setting.logo} />
      <ImageUpload name="favicon" label="Favicon" defaultValue={setting.favicon} />
      <Field id="defaultMetaTitle" label="Judul meta">
        <input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue={setting.defaultMetaTitle} className={KELAS_KONTROL} />
      </Field>
      <Field id="defaultMetaDesc" label="Deskripsi meta">
        <textarea id="defaultMetaDesc" name="defaultMetaDesc" rows={3} defaultValue={setting.defaultMetaDesc} className={KELAS_KONTROL} />
      </Field>
      <Field id="contactEmail" label="Email kontak">
        <input id="contactEmail" name="contactEmail" defaultValue={setting.contactEmail} className={KELAS_KONTROL} />
      </Field>
      <Field id="contactAddress" label="Alamat">
        <input id="contactAddress" name="contactAddress" defaultValue={setting.contactAddress} className={KELAS_KONTROL} />
      </Field>
      <Field id="contactPhone" label="Telepon">
        <input id="contactPhone" name="contactPhone" defaultValue={setting.contactPhone} className={KELAS_KONTROL} />
      </Field>
      <Field id="titles" label="Gelar">
        <input id="titles" name="titles" type="number" defaultValue={setting.titles} className={KELAS_KONTROL} />
      </Field>
      <Field id="tournaments" label="Turnamen">
        <input id="tournaments" name="tournaments" type="number" defaultValue={setting.tournaments} className={KELAS_KONTROL} />
      </Field>
      <Field id="wwcd" label="WWCD">
        <input id="wwcd" name="wwcd" type="number" defaultValue={setting.wwcd} className={KELAS_KONTROL} />
      </Field>
      <Button type="submit">Simpan pengaturan</Button>
    </form>
  )
}
