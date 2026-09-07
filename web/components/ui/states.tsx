'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="border border-border bg-surface-raised px-6 py-12 text-center">
      <h3 className="font-display text-card uppercase">{title}</h3>
      <p className="mx-auto mt-3 max-w-prose text-content-secondary">{description}</p>

      {action ? (
        <Link
          href={action.href}
          className={`mt-6 inline-flex min-h-11 items-center border-2 border-border-strong px-6 font-display text-label uppercase ${KELAS_FOKUS}`}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string
  description: string
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="border-l-4 border-danger bg-surface-raised px-6 py-8"
    >
      <h3 className="font-display text-card uppercase text-danger">{title}</h3>
      <p className="mt-3 max-w-prose text-content-secondary">{description}</p>

      <Button variant="secondary" onClick={onRetry} className="mt-6">
        Coba lagi
      </Button>
    </div>
  )
}

export function Skeleton({ className = '', label }: { className?: string; label?: string }) {
  const kelas = `animate-pulse bg-surface-overlay ${className}`.trim()

  if (label) {
    return <div role="status" aria-label={label} className={kelas} />
  }

  return <div aria-hidden="true" className={kelas} />
}
