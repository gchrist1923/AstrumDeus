'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FLASH_KEYS, flashDariQuery, type Flash } from '@/lib/flash'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function flashDariParams(params: URLSearchParams): Flash | null {
  return flashDariQuery({
    ok: params.get('ok'),
    kesalahan: params.get('kesalahan'),
    peringatan: params.get('peringatan'),
    n: params.get('n'),
    pakai: params.get('pakai'),
  })
}

export function FlashToast() {
  const params = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const replaceRef = useRef(replace)
  replaceRef.current = replace
  const rawQuery = params.toString()
  const [flash, setFlash] = useState<Flash | null>(() => flashDariParams(params))
  const [terbuka, setTerbuka] = useState(() => Boolean(flashDariParams(params)))

  useEffect(() => {
    const current = new URLSearchParams(rawQuery)
    const dariUrl = flashDariParams(current)
    if (!dariUrl) {
      return
    }

    setFlash(dariUrl)
    setTerbuka(true)

    const next = new URLSearchParams(rawQuery)
    for (const kunci of FLASH_KEYS) {
      next.delete(kunci)
    }
    const qs = next.toString()
    replaceRef.current(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [rawQuery, pathname])

  useEffect(() => {
    if (!terbuka || !flash || flash.jenis === 'error') {
      return
    }
    const timer = window.setTimeout(() => setTerbuka(false), 4000)
    return () => window.clearTimeout(timer)
  }, [terbuka, flash])

  useEffect(() => {
    if (!terbuka) {
      return
    }
    const tutup = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTerbuka(false)
      }
    }
    window.addEventListener('keydown', tutup)
    return () => window.removeEventListener('keydown', tutup)
  }, [terbuka])

  if (!terbuka || !flash) {
    return null
  }

  const error = flash.jenis === 'error'
  const garis = error ? 'border-danger text-danger' : 'border-accent text-accent'

  return (
    <div
      role={error ? 'alert' : 'status'}
      className={`fixed top-4 right-4 left-4 z-50 flex max-w-md items-start gap-3 border-l-4 bg-surface-raised px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)] md:left-auto ${garis}`}
    >
      <p className="min-w-0 flex-1 text-body text-content-primary">{flash.pesan}</p>
      <button
        type="button"
        aria-label="Tutup"
        onClick={() => setTerbuka(false)}
        className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-content-secondary hover:text-content-primary ${KELAS_FOKUS}`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
