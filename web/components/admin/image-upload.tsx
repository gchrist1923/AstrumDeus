'use client'

import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { KELAS_FOKUS, KELAS_LABEL } from '@/components/admin/form-field'
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
  const uploadingRef = useRef(false)
  const [path, setPath] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileId = `${name}-file`
  const errorId = `${name}-error`

  useEffect(() => {
    if (error && !uploading) {
      fileRef.current?.focus()
    }
  }, [error, uploading])

  function tampilkanError(kode: unknown) {
    setError(pesanDariKode(kode))
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || uploadingRef.current) return
    void unggah(file)
  }

  async function unggah(file: File) {
    if (uploadingRef.current) return
    uploadingRef.current = true
    setError(null)
    try {
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
    } finally {
      uploadingRef.current = false
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fileId} className={`${KELAS_LABEL}${uploading ? ' pointer-events-none' : ''}`}>
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
      <div
        className={`relative inline-flex ${KELAS_FOKUS} focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent`}
      >
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Mengunggah…' : 'Pilih gambar'}
        </Button>
        <input
          ref={fileRef}
          id={fileId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          className="absolute inset-0 opacity-0"
          tabIndex={-1}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={onChange}
        />
      </div>
      <p className="text-small text-content-muted">{HINT}</p>
      {error ? (
        <p id={errorId} role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
