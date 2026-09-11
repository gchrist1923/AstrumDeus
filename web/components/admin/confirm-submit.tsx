'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'

export function ConfirmSubmit({
  message,
  children,
  variant = 'destructive',
  onConfirm,
  ...props
}: ButtonProps & { message: string; onConfirm?: () => void }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const pernahBuka = useRef(false)

  function tutup() {
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      pernahBuka.current = true
      dialogRef.current?.focus()
      function onKey(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          event.preventDefault()
          setOpen(false)
        }
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
    if (pernahBuka.current) {
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <Button
        {...props}
        ref={triggerRef}
        type="button"
        variant={variant}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Tutup"
            onClick={tutup}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative z-10 w-full max-w-md border-2 border-border-strong bg-surface-raised p-6 outline-none"
          >
            <h2 id={titleId} className="font-display text-card uppercase text-content-primary">
              Hapus
            </h2>
            <p className="mt-4 text-body text-content-primary">{message}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={tutup}>
                Batal
              </Button>
              <Button
                type={onConfirm ? 'button' : 'submit'}
                variant="destructive"
                onClick={
                  onConfirm
                    ? () => {
                        onConfirm()
                        tutup()
                      }
                    : undefined
                }
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
