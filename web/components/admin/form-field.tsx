import type { ReactNode } from 'react'

export const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
export const KELAS_KONTROL = `min-h-11 w-full border-2 border-border-strong bg-surface-raised px-4 text-body text-content-primary disabled:cursor-not-allowed ${KELAS_FOKUS}`
export const KELAS_LABEL = 'font-display text-label uppercase text-content-muted'

export function Field({
  id,
  label,
  children,
  hint,
}: {
  id: string
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={KELAS_LABEL}>
        {label}
      </label>
      {children}
      {hint ? <p className="text-small text-content-muted">{hint}</p> : null}
    </div>
  )
}
