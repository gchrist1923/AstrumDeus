import { deletePlayer, savePlayer } from '@/app/cms/players/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { ImageUpload } from '@/components/admin/image-upload'
import { Button } from '@/components/ui/button'
import { parseSocials } from '@/lib/content/map'
import { toDateInput } from '@/lib/datetime'

const ROLES = ['IGL', 'Assaulter', 'Sniper', 'Support', 'Filter']

interface PlayerFormValues {
  id?: string
  slug: string
  ign: string
  realName: string
  role: string
  photo: string
  joinedAt: Date
  leftAt: Date | null
  isActive: boolean
  socials: string
  sortOrder: number
}

export function PlayerForm({
  player,
  canSave = true,
  canDelete = false,
}: {
  player?: PlayerFormValues
  canSave?: boolean
  canDelete?: boolean
}) {
  const socials = player ? parseSocials(player.socials).map((item) => `${item.label}|${item.href}`).join('\n') : ''

  return (
    <form action={savePlayer} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {player?.id ? <input type="hidden" name="id" value={player.id} /> : null}
      <Field id="ign" label="IGN">
        <input id="ign" name="ign" required defaultValue={player?.ign} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="slug" label="Slug">
        <input id="slug" name="slug" required defaultValue={player?.slug} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="realName" label="Nama asli">
        <input id="realName" name="realName" defaultValue={player?.realName} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="role" label="Role">
        <select id="role" name="role" defaultValue={player?.role ?? 'IGL'} disabled={!canSave} className={KELAS_KONTROL}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </Field>
      <ImageUpload name="photo" label="Foto" defaultValue={player?.photo ?? '/portrait.jpg'} disabled={!canSave} />
      <Field id="joinedAt" label="Bergabung">
        <input id="joinedAt" name="joinedAt" type="date" required defaultValue={toDateInput(player?.joinedAt ?? new Date())} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="leftAt" label="Keluar">
        <input id="leftAt" name="leftAt" type="date" defaultValue={player?.leftAt ? toDateInput(player.leftAt) : ''} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <label className="flex min-h-11 items-center gap-3">
        <input type="checkbox" name="isActive" defaultChecked={player?.isActive ?? true} disabled={!canSave} className="size-5 accent-accent" />
        <span className="font-display text-label uppercase">Pemain aktif</span>
      </label>
      <Field id="socials" label="Sosial" hint="Satu baris: Label|https://...">
        <textarea id="socials" name="socials" rows={3} defaultValue={socials} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="sortOrder" label="Urutan">
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={player?.sortOrder ?? 0} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <div className="flex flex-wrap gap-3">
        {canSave ? <Button type="submit">Simpan</Button> : null}
        {player?.id && canDelete ? (
          <Button formAction={deletePlayer} variant="destructive" type="submit">
            Hapus
          </Button>
        ) : null}
      </div>
    </form>
  )
}
