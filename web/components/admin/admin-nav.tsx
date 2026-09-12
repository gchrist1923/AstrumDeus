'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/login/actions'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { Button } from '@/components/ui/button'
import { adminPathAktif } from '@/lib/admin/nav-aktif'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export type AdminTautan = { href: string; label: string }

export function AdminMobileTrigger({ tautan, name }: { tautan: AdminTautan[]; name: string }) {
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <MobileMenu
        items={tautan}
        pathname={pathname}
        dialogLabel="Navigasi admin"
        panelId="menu-admin"
        isActive={adminPathAktif}
        footer={
          <div className="flex flex-col gap-3">
            <p className="text-small text-content-secondary">{name}</p>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary" className="w-full">
                Keluar
              </Button>
            </form>
          </div>
        }
      />
    </div>
  )
}

export function AdminSidebar({ tautan }: { tautan: AdminTautan[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi admin" className="hidden w-full flex-col gap-1 md:flex md:w-52 md:shrink-0">
      {tautan.map((link) => {
        const aktif = adminPathAktif(link.href, pathname)

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={aktif ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center px-3 font-display text-label uppercase tracking-[0.12em] ${KELAS_FOKUS} ${
              aktif ? 'text-content-primary' : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminNav({ tautan, name }: { tautan: AdminTautan[]; name: string }) {
  return (
    <>
      <AdminMobileTrigger tautan={tautan} name={name} />
      <AdminSidebar tautan={tautan} />
    </>
  )
}
