import type { Metadata } from 'next'
import type { ReactNode } from 'react'
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
        {children}
      </body>
    </html>
  )
}
