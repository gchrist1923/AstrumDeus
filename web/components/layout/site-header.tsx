'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { getVisibleNavItems, type MenuFlags } from '@/lib/nav'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function SiteHeader({ flags }: { flags?: MenuFlags }) {
  const pathname = usePathname()
  const items = getVisibleNavItems(flags)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-base/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-page items-center gap-8 px-5 md:px-8">
        <Link href="/" className={`flex items-center ${KELAS_FOKUS}`}>
          <Image src="/logo-astrum-deus.png" alt="Astrum Deus" width={40} height={40} priority />
        </Link>

        <nav aria-label="Navigasi utama" className="ml-auto hidden md:block">
          <ul className="flex gap-7">
            {items.map((item) => {
              const aktif = item.href === pathname

              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={aktif ? 'page' : undefined}
                    className={`border-b-2 pb-1 font-display text-label uppercase ${KELAS_FOKUS} ${
                      aktif
                        ? 'border-accent text-content-primary'
                        : 'border-transparent text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto md:hidden">
          <MobileMenu items={items} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
