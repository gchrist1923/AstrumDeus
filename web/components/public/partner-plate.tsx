import type { Partner } from '@/lib/content/types'

const KELAS_PLAT =
  'flex min-h-24 min-w-11 items-center justify-center bg-content-primary px-4 py-8 font-display text-label uppercase tracking-[0.2em] text-surface-raised'

export function PartnerPlate({ partner }: { partner: Partner }) {
  if (!partner.href) {
    return <div className={KELAS_PLAT}>{partner.logoText}</div>
  }

  return (
    <a
      href={partner.href}
      className={`${KELAS_PLAT} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      {partner.logoText}
    </a>
  )
}
