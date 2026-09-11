import Image from 'next/image'
import Link from 'next/link'
import { getVisibleNavItems, mergeNav, type ExtraNavItem, type MenuFlags } from '@/lib/nav'

export function SiteFooter({
  flags,
  extra = [],
  logoSrc = '/logo-astrum-deus.png',
  siteName = 'Astrum Deus',
}: {
  flags?: MenuFlags
  extra?: ExtraNavItem[]
  logoSrc?: string
  siteName?: string
}) {
  const items = mergeNav(getVisibleNavItems(flags), extra)

  return (
    <footer className="mt-24 border-t border-border bg-surface-raised">
      <div className="mx-auto max-w-page px-5 py-16 md:px-8">
        <div className="flex flex-wrap items-start gap-12">
          <Image src={logoSrc} alt="" width={52} height={52} unoptimized={logoSrc.startsWith('/media/')} />

          <nav aria-label="Navigasi footer" className="ml-auto">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-label uppercase text-content-secondary hover:text-content-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-14 border-t border-border pt-6 text-small text-content-muted">
          {siteName}. Tim esports PUBG Mobile.
        </p>
      </div>
    </footer>
  )
}
