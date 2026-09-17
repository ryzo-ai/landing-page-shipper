import type { Metadata } from 'next'
import { Montserrat, Roboto } from 'next/font/google'
import themeConfig from '../theme.config'
import { buildCSSVars } from '../lib/theme'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

// glopros.ai sets headings in Montserrat (600 in practice, 500 for small labels)
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
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
    <html lang="nl" className={`${roboto.variable} ${montserrat.variable}`}>
      <head>
        <style>{`:root { ${buildCSSVars(tokens)} }`}</style>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
