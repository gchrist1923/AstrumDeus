import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { MENU_FLAGS } from '@/lib/content/flags'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Astrum Deus',
  description: 'Tim esports PUBG Mobile Astrum Deus, roster dan hasil pertandingannya.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-surface-base font-text text-body text-content-primary antialiased">
        <SiteHeader flags={MENU_FLAGS} />
        {children}
        <SiteFooter flags={MENU_FLAGS} />
      </body>
    </html>
  )
}
