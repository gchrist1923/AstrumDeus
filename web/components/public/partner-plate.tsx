import type { Partner } from '@/lib/content/types'

const KELAS_PLAT =
  'flex min-h-24 min-w-11 items-center justify-center bg-content-primary px-4 py-8 font-display text-label uppercase tracking-[0.2em] text-surface-raised'

function isiPlat(partner: Partner) {
  if (partner.logo) {
    return (
      <img
        src={partner.logo}
        alt={partner.name}
        className="max-h-12 w-auto max-w-full object-contain outline outline-1 outline-black/10"
      />
    )
  }

  return partner.logoText
}

export function PartnerPlate({ partner }: { partner: Partner }) {
  if (!partner.href) {
    return <div className={KELAS_PLAT}>{isiPlat(partner)}</div>
  }

  return (
    <a
      href={partner.href}
      className={`${KELAS_PLAT} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      {isiPlat(partner)}
    </a>
  )
}
