import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { LandingPageContent } from '../../../types/content'
import LandingPage from '../../../components/LandingPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

function readContent(slug: string): LandingPageContent | null {
  try {
    const filePath = path.join(process.cwd(), 'content', 'lp', `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as LandingPageContent
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'lp')
    const files = fs.readdirSync(contentDir)
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({ slug: f.replace(/\.json$/, '') }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
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
  const content = readContent(slug)
  if (!content) notFound()
  return <LandingPage content={content} />
}
