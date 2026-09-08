import Link from 'next/link'
import type { ReactNode } from 'react'
import { logoutAction } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import {
  canAccessCms,
  canAccessInternal,
  canManageSettings,
  canReadReports,
  canToggleMenu,
  type Role,
} from '@/lib/auth/roles'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

interface NavLink {
  href: string
  label: string
}

function cmsLinks(roles: Role[]): NavLink[] {
  const links: NavLink[] = [{ href: '/cms', label: 'Ringkasan' }]

  if (canAccessCms(roles)) {
    links.push(
      { href: '/cms/news', label: 'Berita' },
      { href: '/cms/players', label: 'Roster' },
      { href: '/cms/matches', label: 'Pertandingan' },
      { href: '/cms/media-kit', label: 'Media Kit' },
      { href: '/cms/partners', label: 'Partners' },
      { href: '/cms/inbox', label: 'Kotak masuk' },
    )
  }

  if (canToggleMenu(roles)) {
    links.push({ href: '/cms/menu', label: 'Menu' })
  }

  if (canManageSettings(roles)) {
    links.push({ href: '/cms/settings', label: 'Situs' }, { href: '/cms/users', label: 'Pengguna' })
  }

  if (canAccessInternal(roles)) {
    links.push({ href: '/internal', label: 'Internal' })
  }

  return links
}

function internalLinks(roles: Role[]): NavLink[] {
  const links: NavLink[] = [{ href: '/internal', label: 'Ringkasan' }, { href: '/internal/schedule', label: 'Jadwal' }]

  links.push({ href: '/internal/cash', label: 'Kas' })

  if (canReadReports(roles)) {
    links.push({ href: '/internal/reports', label: 'Laporan' })
  }

  if (canAccessCms(roles)) {
    links.push({ href: '/cms', label: 'CMS' })
  }

  return links
}

export function AdminShell({
  title,
  area,
  roles,
  name,
  children,
}: {
  title: string
  area: 'cms' | 'internal'
  roles: Role[]
  name: string
  children: ReactNode
}) {
  const links = area === 'cms' ? cmsLinks(roles) : internalLinks(roles)

  return (
    <div className="min-h-screen bg-surface-base text-content-primary">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="font-display text-label uppercase tracking-[0.16em] text-accent">
              {area === 'cms' ? 'CMS' : 'Internal'}
            </p>
            <h1 className="font-display text-card uppercase">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-small text-content-secondary">{name}</p>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary">
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-page flex-col gap-10 px-5 py-10 md:flex-row md:px-8">
        <nav aria-label="Navigasi admin" className="flex w-full flex-col gap-1 md:w-52 md:shrink-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-11 items-center px-3 font-display text-label uppercase tracking-[0.12em] text-content-secondary hover:text-content-primary ${KELAS_FOKUS}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
