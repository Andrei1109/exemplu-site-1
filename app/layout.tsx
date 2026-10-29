import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter_Tight } from 'next/font/google'
import type { CSSProperties } from 'react'
import { invitationConfig } from '@/lib/invitation-config'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const { couple, theme } = invitationConfig

export const metadata: Metadata = {
  title: `${couple.first} & ${couple.second} — 12 iunie 2027`,
  description: `Invitație de nuntă: ${couple.first} și ${couple.second} vă invită să le fiți alături. Confirmați participarea online.`,
  generator: 'v0.app',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: theme.ivory,
  width: 'device-width',
  initialScale: 1,
}

const themeVars = {
  '--inv-ivory': theme.ivory,
  '--inv-paper': theme.paper,
  '--inv-espresso': theme.espresso,
  '--inv-sage': theme.sage,
  '--inv-champagne': theme.champagne,
} as CSSProperties

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${cormorant.variable} ${interTight.variable} bg-background`} style={themeVars}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
