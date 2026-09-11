import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteChrome } from '@/components/layout/site-chrome'
import { getPublicSiteSettings } from '@/lib/content/public-site'
import { getMenuFlags } from '@/lib/content/flags'
import type { ExtraNavItem } from '@/lib/nav'
import { extraNavFromPages } from '@/lib/pages/public-visibility'
import { fontVariables } from './fonts'
import './globals.css'

async function getExtraNav(): Promise<ExtraNavItem[]> {
  try {
    const { prisma } = await import('@/lib/db')
    const pages = await prisma.sitePage.findMany({
      where: { kind: 'custom' },
      select: {
        title: true,
        slug: true,
        kind: true,
        status: true,
        isEnabled: true,
        showInNav: true,
      },
    })
    return extraNavFromPages(pages)
  } catch {
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const situs = await getPublicSiteSettings()
  return {
    title: situs.metaTitle,
    description: situs.metaDescription,
    icons: { icon: situs.favicon },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const flags = await getMenuFlags()
  const situs = await getPublicSiteSettings()
  const extra = await getExtraNav()

  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        <SiteChrome flags={flags} extra={extra} logoSrc={situs.logo} siteName={situs.siteName}>
          {children}
        </SiteChrome>
      </body>
    </html>
  )
}
