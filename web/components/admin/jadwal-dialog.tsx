'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { KELAS_FOKUS } from '@/components/admin/form-field'

export function JadwalDialog({
  judul,
  tutupHref,
  children,
}: {
  judul: string
  tutupHref: string
  children: ReactNode
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    dialogRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        router.push(tutupHref)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [router, tutupHref])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Tutup"
        onClick={() => router.push(tutupHref)}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[min(36rem,calc(100vh-2rem))] w-full max-w-lg flex-col overflow-y-auto border-2 border-border-strong bg-surface-raised p-6 outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-card uppercase text-content-primary">
            {judul}
          </h2>
          <a
            href={tutupHref}
            className={`inline-flex min-h-11 shrink-0 items-center font-display text-label uppercase ${KELAS_FOKUS}`}
          >
            Tutup
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
