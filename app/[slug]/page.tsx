import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { LandingPageContent } from '../../types/content'
import LandingPage from '../../components/LandingPage'
import MirrorPage from '../../components/mirror/MirrorPage'
import MirrorAnalytics from '../../components/mirror/MirrorAnalytics'
import { mirrorSlugs, readMirror } from '../../lib/mirror-pages'

// Only serve slugs that were known at build time — blocks dynamic traversal attempts
export const dynamicParams = false

interface PageProps {
  params: Promise<{ slug: string }>
}

function readContent(slug: string): LandingPageContent | null {
  // Allowlist: slugs may only contain letters, digits, and hyphens
  if (!/^[a-z0-9-]+$/i.test(slug)) return null

  const base = path.resolve(process.cwd(), 'content')
  const filePath = path.resolve(base, `${slug}.json`)

  // Belt-and-suspenders: confirm resolved path stays inside content/
  if (!filePath.startsWith(base + path.sep)) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as LandingPageContent
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const contentDir = path.join(process.cwd(), 'content')
    const files = fs.readdirSync(contentDir)
    return [
      ...files.filter((f) => f.endsWith('.json')).map((f) => ({ slug: f.replace(/\.json$/, '') })),
      ...mirrorSlugs().map((slug) => ({ slug })),
    ]
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const mirror = readMirror(slug)
  if (mirror) return { title: mirror.title, description: mirror.description, robots: { index: false, follow: false } }
  const content = readContent(slug)
  if (!content) return {}
  return {
    title: content.meta.title,
    description: content.meta.description,
    robots: { index: false, follow: false },
    openGraph: content.meta.ogImage
      ? { images: [{ url: content.meta.ogImage }] }
      : undefined,
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const mirror = readMirror(slug)
  if (mirror) {
    return (
      <>
        {/* Webflow CSS sets type in Montserrat + Roboto by family name */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500;600;700&display=swap"
        />
        <MirrorAnalytics />
        <MirrorPage slug={slug} html={mirror.html} />
      </>
    )
  }
  const content = readContent(slug)
  if (!content) notFound()
  return <LandingPage content={content} />
}
