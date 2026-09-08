'use client'

import { type ChangeEvent, useRef, useState } from 'react'
import { KELAS_LABEL } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { MAX_IMAGE_BYTES } from '@/lib/media/constants'
import { validateImageBuffer } from '@/lib/media/validate'

const HINT = 'JPG, PNG, atau WebP. Maksimal 15 MB.'

const PESAN = {
  jenis: 'Pilih file JPG, PNG, atau WebP.',
  ukuran: 'Ukuran file maksimal 15 MB.',
  gagal: 'Unggahan gagal. Coba lagi.',
} as const

function pesanDariKode(kode: unknown): string {
  if (kode === 'jenis' || kode === 'ukuran' || kode === 'gagal') {
    return PESAN[kode]
  }
  return PESAN.gagal
}

export function ImageUpload({
  name,
  label,
  defaultValue = '',
  required = false,
}: {
  name: string
  label: string
  defaultValue?: string
  required?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [path, setPath] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileId = `${name}-file`
  const errorId = `${name}-error`

  function tampilkanError(kode: unknown) {
    setError(pesanDariKode(kode))
    fileRef.current?.focus()
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    void unggah(file)
  }

  async function unggah(file: File) {
    setError(null)
    if (file.size > MAX_IMAGE_BYTES) {
      tampilkanError('ukuran')
      return
    }
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
    const hasil = validateImageBuffer(header)
    if (!hasil.ok) {
      tampilkanError(hasil.error)
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.set('file', file)
      const res = await fetch('/api/media', {
        method: 'POST',
        body: form,
        credentials: 'include',
      })
      const json: unknown = await res.json().catch(() => null)
      const data =
        json && typeof json === 'object' ? (json as { path?: unknown; error?: unknown }) : null
      if (!res.ok || typeof data?.path !== 'string') {
        tampilkanError(data?.error)
        return
      }
      setPath(data.path)
      setError(null)
    } catch {
      tampilkanError('gagal')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fileId} className={KELAS_LABEL}>
        {label}
      </label>
      {path ? (
        <img
          src={path}
          alt={`Pratinjau ${label}`}
          className="max-h-48 w-auto max-w-full outline outline-1 outline-content-primary/10"
        />
      ) : null}
      <input type="hidden" name={name} value={path} required={required} />
      <input
        ref={fileRef}
        id={fileId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={onChange}
      />
      <Button type="button" variant="secondary" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? 'Mengunggah…' : 'Pilih gambar'}
      </Button>
      <p className="text-small text-content-muted">{HINT}</p>
      {error ? (
        <p id={errorId} role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
