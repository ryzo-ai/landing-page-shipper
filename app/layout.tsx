import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import themeConfig from '../theme.config'
import { buildCSSVars } from '../lib/theme'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Playlist Push — Campaign Landing Pages',
  description: 'Playlist Push campaign landing pages',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tokens = themeConfig[themeConfig.defaultMode]

  return (
    <html lang="en">
      <head>
        <style>{`:root { ${buildCSSVars(tokens)} }`}</style>
      </head>
      <body className={`${geist.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
