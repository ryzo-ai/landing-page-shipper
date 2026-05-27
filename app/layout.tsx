import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
})

const junicode = localFont({
  src: './fonts/JunicodeVF-Roman.woff2',
  variable: '--font-albra',
  weight: '300 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ryzo — Campaign Landing Pages',
  description: 'Ryzo campaign landing pages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${junicode.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
