'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import type { ExtraNavItem, MenuFlags } from '@/lib/nav'

function isBarePath(path: string): boolean {
  return path.startsWith('/cms') || path.startsWith('/internal') || path.startsWith('/login')
}

export function SiteChrome({
  flags,
  extra = [],
  logoSrc = '/logo-astrum-deus.png',
  children,
}: {
  flags: MenuFlags
  extra?: ExtraNavItem[]
  logoSrc?: string
  children: ReactNode
}) {
  const path = usePathname()

  if (isBarePath(path)) {
    return children
  }

  return (
    <>
      <SiteHeader flags={flags} extra={extra} logoSrc={logoSrc} />
      {children}
      <SiteFooter flags={flags} extra={extra} logoSrc={logoSrc} />
    </>
  )
}
