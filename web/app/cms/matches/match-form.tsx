import { deleteMatch, saveMatch } from '@/app/cms/matches/actions'
import { Field, KELAS_KONTROL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { toDatetimeLocal } from '@/lib/datetime'

interface MatchFormValues {
  id?: string
  tournamentId: string
  stage: string
  scheduledAt: Date
  status: string
  placement: number | null
  points: number | null
  wwcdCount: number | null
  location: string
  recapSlug: string
  map: string
  streamUrl: string
}

export function MatchForm({
  match,
  tournaments,
  canSave = true,
  canDelete = false,
}: {
  match?: MatchFormValues
  tournaments: { id: string; name: string }[]
  canSave?: boolean
  canDelete?: boolean
}) {
  return (
    <form action={saveMatch} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {match?.id ? <input type="hidden" name="id" value={match.id} /> : null}
      <Field id="tournamentId" label="Turnamen">
        <select id="tournamentId" name="tournamentId" required defaultValue={match?.tournamentId} disabled={!canSave} className={KELAS_KONTROL}>
          {tournaments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id="stage" label="Babak">
        <input id="stage" name="stage" required defaultValue={match?.stage} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="scheduledAt" label="Jadwal">
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          defaultValue={toDatetimeLocal(match?.scheduledAt ?? new Date())}
          disabled={!canSave}
          className={KELAS_KONTROL}
        />
      </Field>
      <Field id="status" label="Status">
        <select id="status" name="status" defaultValue={match?.status ?? 'scheduled'} disabled={!canSave} className={KELAS_KONTROL}>
          <option value="scheduled">Terjadwal</option>
          <option value="live">Live</option>
          <option value="completed">Selesai</option>
        </select>
      </Field>
      <Field id="location" label="Lokasi">
        <input id="location" name="location" defaultValue={match?.location ?? 'Online'} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="placement" label="Placement">
        <input id="placement" name="placement" type="number" defaultValue={match?.placement ?? ''} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="points" label="Poin">
        <input id="points" name="points" type="number" defaultValue={match?.points ?? ''} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="wwcdCount" label="WWCD">
        <input id="wwcdCount" name="wwcdCount" type="number" defaultValue={match?.wwcdCount ?? ''} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="map" label="Map">
        <input id="map" name="map" defaultValue={match?.map} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="streamUrl" label="Tautan siaran">
        <input id="streamUrl" name="streamUrl" defaultValue={match?.streamUrl} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <Field id="recapSlug" label="Slug recap">
        <input id="recapSlug" name="recapSlug" defaultValue={match?.recapSlug} disabled={!canSave} className={KELAS_KONTROL} />
      </Field>
      <div className="flex flex-wrap gap-3">
        {canSave ? <Button type="submit">Simpan</Button> : null}
        {match?.id && canDelete ? (
          <Button formAction={deleteMatch} variant="destructive" type="submit">
            Hapus
          </Button>
        ) : null}
      </div>
    </form>
  )
}
