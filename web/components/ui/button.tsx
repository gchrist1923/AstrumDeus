import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

const KELAS_DASAR = [
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2',
  'px-6 py-3 font-display text-label uppercase tracking-[0.12em]',
  'transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')

const KELAS_VARIAN: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-surface-raised hover:bg-accent-strong',
  secondary: 'border-2 border-border-strong text-content-primary hover:border-content-primary',
  destructive: 'bg-danger-solid text-content-primary hover:bg-danger',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${KELAS_DASAR} ${KELAS_VARIAN[variant]} ${className}`.trim()}
      {...props}
    />
  )
})
