import Link from 'next/link'
import type { ReactNode } from 'react'
import { logoutAction } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { can, type AccessModule, type GrantMatrix } from '@/lib/auth/grants'
import { canAccessCms, canAccessInternal } from '@/lib/auth/permissions'

const KELAS_FOKUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

interface NavLink {
  href: string
  label: string
}

const CMS_NAV: { href: string; label: string; module: AccessModule }[] = [
  { href: '/cms/news', label: 'Berita', module: 'news' },
  { href: '/cms/players', label: 'Roster', module: 'roster' },
  { href: '/cms/matches', label: 'Pertandingan', module: 'matches' },
  { href: '/cms/media-kit', label: 'Media Kit', module: 'media-kit' },
  { href: '/cms/partners', label: 'Partners', module: 'partners' },
  { href: '/cms/inbox', label: 'Kotak masuk', module: 'inbox' },
  { href: '/cms/menu', label: 'Menu', module: 'menu' },
  { href: '/cms/settings', label: 'Situs', module: 'situs' },
  { href: '/cms/users', label: 'Pengguna', module: 'users' },
  { href: '/cms/kategori', label: 'Kategori', module: 'kategori' },
  { href: '/cms/peran', label: 'Peran', module: 'peran' },
  { href: '/cms/halaman', label: 'Halaman', module: 'halaman' },
]

function cmsLinks(matrix: GrantMatrix): NavLink[] {
  const links: NavLink[] = [{ href: '/cms', label: 'Ringkasan' }]

  for (const item of CMS_NAV) {
    if (can(matrix, item.module, 'view')) {
      links.push({ href: item.href, label: item.label })
    }
  }

  if (canAccessInternal(matrix)) {
    links.push({ href: '/internal', label: 'Internal' })
  }

  return links
}

function internalLinks(matrix: GrantMatrix): NavLink[] {
  const links: NavLink[] = [{ href: '/internal', label: 'Ringkasan' }]

  if (can(matrix, 'jadwal', 'view')) {
    links.push({ href: '/internal/schedule', label: 'Jadwal' })
  }

  if (can(matrix, 'kas-operasional', 'view') || can(matrix, 'kas-tim', 'view')) {
    links.push({ href: '/internal/cash', label: 'Kas' })
  }

  if (can(matrix, 'laporan', 'view')) {
    links.push({ href: '/internal/reports', label: 'Laporan' })
  }

  if (canAccessCms(matrix)) {
    links.push({ href: '/cms', label: 'CMS' })
  }

  return links
}

export function AdminShell({
  title,
  area,
  matrix,
  name,
  children,
}: {
  title: string
  area: 'cms' | 'internal'
  matrix: GrantMatrix
  name: string
  children: ReactNode
}) {
  const links = area === 'cms' ? cmsLinks(matrix) : internalLinks(matrix)

  return (
    <div className="min-h-screen bg-surface-base text-content-primary">
      <header className="border-b border-border">
        <div className="flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
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
      <div className="flex w-full flex-col gap-10 px-5 py-10 md:flex-row md:px-8">
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
