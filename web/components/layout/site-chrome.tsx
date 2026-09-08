'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import type { MenuFlags } from '@/lib/nav'

function isBarePath(path: string): boolean {
  return path.startsWith('/cms') || path.startsWith('/internal') || path.startsWith('/login')
}

export function SiteChrome({ flags, children }: { flags: MenuFlags; children: ReactNode }) {
  const path = usePathname()

  if (isBarePath(path)) {
    return children
  }

  return (
    <>
      <SiteHeader flags={flags} />
      {children}
      <SiteFooter flags={flags} />
    </>
  )
}
