import type { SiteStats } from '@/lib/content/types'

export function StatTrio({ stats }: { stats: SiteStats }) {
  const item = [
    { value: stats.titles, label: 'Gelar' },
    { value: stats.tournaments, label: 'Turnamen' },
    { value: stats.wwcd, label: 'WWCD' },
  ]

  return (
    <dl className="mt-12 flex flex-wrap gap-10">
      {item.map((angka) => (
        <div key={angka.label} className="border-l-2 border-accent pl-4">
          <dt className="font-display text-label uppercase text-content-muted">{angka.label}</dt>
          <dd className="font-display text-[38px] font-bold leading-none tabular-nums">{angka.value}</dd>
        </div>
      ))}
    </dl>
  )
}
