'use client'

import { type FormEvent, useState } from 'react'
import { kirimPesan } from '@/app/contact/actions'
import { Button } from '@/components/ui/button'

const TUJUAN = [
  { value: 'sponsor', label: 'Kerja sama sponsor' },
  { value: 'media', label: 'Media dan pers' },
  { value: 'tryout', label: 'Tryout pemain' },
  { value: 'lainnya', label: 'Lainnya' },
] as const

const URUTAN = ['nama', 'email', 'tujuan', 'pesan'] as const

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const KELAS_KONTROL = `min-h-11 w-full border-2 border-border-strong bg-surface-raised px-4 text-body text-content-primary ${KELAS_FOKUS}`
const KELAS_LABEL = 'font-display text-label uppercase text-content-muted'

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ok, setOk] = useState(false)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setOk(false)

    const form = event.currentTarget
    const result = await kirimPesan(new FormData(form))
    setPending(false)

    if (result.ok) {
      setErrors({})
      setOk(true)
      form.reset()
      return
    }

    setErrors(result.errors)
    const pertama = URUTAN.find((kunci) => result.errors[kunci])
    if (pertama) {
      document.getElementById(`contact-${pertama}`)?.focus()
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-nama" className={KELAS_LABEL}>
          Nama
        </label>
        <input
          id="contact-nama"
          name="nama"
          type="text"
          autoComplete="name"
          aria-invalid={errors.nama ? true : undefined}
          aria-describedby={errors.nama ? 'contact-nama-error' : undefined}
          className={KELAS_KONTROL}
        />
        {errors.nama ? (
          <p id="contact-nama-error" className="text-small text-danger">
            {errors.nama}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className={KELAS_LABEL}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={KELAS_KONTROL}
        />
        {errors.email ? (
          <p id="contact-email-error" className="text-small text-danger">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-tujuan" className={KELAS_LABEL}>
          Tujuan
        </label>
        <select
          id="contact-tujuan"
          name="tujuan"
          defaultValue=""
          aria-invalid={errors.tujuan ? true : undefined}
          aria-describedby={errors.tujuan ? 'contact-tujuan-error' : undefined}
          className={KELAS_KONTROL}
        >
          <option value="">Pilih tujuan</option>
          {TUJUAN.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.tujuan ? (
          <p id="contact-tujuan-error" className="text-small text-danger">
            {errors.tujuan}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-pesan" className={KELAS_LABEL}>
          Pesan
        </label>
        <textarea
          id="contact-pesan"
          name="pesan"
          rows={5}
          aria-invalid={errors.pesan ? true : undefined}
          aria-describedby={errors.pesan ? 'contact-pesan-error' : undefined}
          className={`min-h-32 w-full border-2 border-border-strong bg-surface-raised px-4 py-3 text-body text-content-primary ${KELAS_FOKUS}`}
        />
        {errors.pesan ? (
          <p id="contact-pesan-error" className="text-small text-danger">
            {errors.pesan}
          </p>
        ) : null}
      </div>

      {ok ? (
        <p role="status" className="text-body text-content-secondary">
          Pesan terkirim. Kami baca kotak masuk secara berkala.
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        Kirim pesan
      </Button>
    </form>
  )
}
