import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import themeConfig from '../theme.config'
import { buildCSSVars } from '../lib/theme'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GloPros — SAP Detachering & Werving',
  description: 'GloPros levert ervaren SAP professionals voor Nederlandse opdrachtgevers.',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tokens = themeConfig[themeConfig.defaultMode]

  return (
    <html lang="nl">
      <head>
        <style>{`:root { ${buildCSSVars(tokens)} }`}</style>
      </head>
      <body className={`${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
