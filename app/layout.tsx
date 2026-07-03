import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import themeConfig from '../theme.config'
import { buildCSSVars } from '../lib/theme'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Playlist Push — Campaign Landing Pages',
  description: 'Playlist Push campaign landing pages',
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
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
