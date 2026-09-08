import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteChrome } from '@/components/layout/site-chrome'
import { getSiteBranding } from '@/lib/content/branding'
import { getMenuFlags } from '@/lib/content/flags'
import { fontVariables } from './fonts'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteBranding()
  return {
    title: 'Astrum Deus',
    description: 'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.',
    icons: { icon: branding.favicon },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const flags = await getMenuFlags()
  const branding = await getSiteBranding()

  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        <SiteChrome flags={flags} logoSrc={branding.logo}>
          {children}
        </SiteChrome>
      </body>
    </html>
  )
}
