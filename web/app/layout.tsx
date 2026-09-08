import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteChrome } from '@/components/layout/site-chrome'
import { getMenuFlags } from '@/lib/content/flags'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Astrum Deus',
  description: 'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const flags = await getMenuFlags()

  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        <SiteChrome flags={flags}>{children}</SiteChrome>
      </body>
    </html>
  )
}
