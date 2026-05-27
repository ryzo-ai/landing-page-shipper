# Admin Dashboard Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade `/admin/scan` into a two-section dashboard: the existing URL scanner (unchanged) plus a live client list with completion scoring, status badges, and a "Generate Page" button that commits a content JSON to GitHub and updates Airtable.

**Architecture:** Five new files — two shared libs (`lib/airtable.ts`, `lib/airtable-to-content.ts`), two new API routes (`GET /api/clients`, `POST /api/clients/[recordId]/generate`), and a modified scan page that adds a `<ClientList>` section below the existing scanner. The generate route fetches all Airtable tables for the slug, maps them to `LandingPageContent`, base64-encodes the JSON, commits it via the GitHub Contents API, then patches the Airtable Status field to `In Build`.

**Tech Stack:** Next.js 16 App Router · Airtable REST API · GitHub Contents API · TypeScript · existing `LandingPageContent` schema from `types/content.ts`

**New env vars required** (add to `.env.local`):
```
GITHUB_TOKEN=ghp_...          # PAT with repo scope
GITHUB_REPO=owner/repo        # e.g. ryzo-revops/landing-page-shipper
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

**Completion scoring — 13 checkpoints:**
| # | Check | Source |
|---|-------|--------|
| 1 | `FieldTypeSlug` filled | Clients record |
| 2 | `Company Name` filled | Clients record |
| 3 | `Primary Color` filled | Clients record |
| 4 | `Font Preference` filled | Clients record |
| 5 | `Headline` filled | Copy record |
| 6 | `Subheadline` filled | Copy record |
| 7 | `CTA Text` filled | Copy record |
| 8 | `Problem Statement` filled | Copy record |
| 9 | `Outcome Statement` filled | Copy record |
| 10 | ≥1 Service linked | Clients `Services` array length |
| 11 | ≥2 Process Steps linked | Clients `Process Steps` array length |
| 12 | ≥1 Testimonial linked | Clients `Testimonials` array length |
| 13 | ≥1 FAQ linked | Clients `FAQs` array length |

**Note on Status field:** Actual Airtable values observed are `Planning`, `Active`, `Paused`. The spec calls for `Intake / In Build / Live / Archived`. Add these options to your Airtable Status select field before testing the Generate button. The generate route will write `In Build`.

---

## Task 1: Create `lib/airtable.ts` — shared Airtable fetch helpers

**Files:**
- Create: `lib/airtable.ts`

**Step 1: Write the file**

```typescript
const BASE_ID = (process.env.AIRTABLE_BASE_ID ?? '').split('/')[0]
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export interface AirtableRecord<T = Record<string, unknown>> {
  id: string
  fields: T
}

export interface AirtableListResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export type AirtableClientFields = {
  FieldTypeSlug?: string
  'Campaign Name'?: string
  'Company Name'?: string
  'Website URL'?: string
  'Primary Color'?: string
  'Secondary Color'?: string
  'Font Preference'?: string
  'Tone of Voice'?: string
  'Target Keywords'?: string
  Status?: string
  Notes?: string
  Copy?: string[]
  Services?: string[]
  'Process Steps'?: string[]
  Testimonials?: string[]
  'Case Studies'?: string[]
  FAQs?: string[]
}

export type AirtableCopyFields = {
  Headline?: string
  Subheadline?: string
  'CTA Text'?: string
  'Problem Statement'?: string
  'Outcome Statement'?: string
  Client?: string[]
}

export type AirtableServiceFields = {
  Title?: string
  Description?: string
  OrderNumber?: number
  Client?: string[]
}

export type AirtableProcessStepFields = {
  'Step Title'?: string
  'Step Description'?: string
  OrderNumber?: number
  Client?: string[]
}

export type AirtableTestimonialFields = {
  Quote?: string
  Name?: string
  'Job Title'?: string
  Company?: string
  Client?: string[]
}

export type AirtableCaseStudyFields = {
  'Client Label'?: string
  'Key Stat'?: string
  Description?: string
  Client?: string[]
}

export type AirtableFAQFields = {
  Question?: string
  Answer?: string
  OrderNumber?: number
  Client?: string[]
}

async function fetchAll<T>(table: string, params = ''): Promise<AirtableRecord<T>[]> {
  const records: AirtableRecord<T>[] = []
  let offset: string | undefined

  do {
    const qs = new URLSearchParams()
    if (offset) qs.set('offset', offset)
    if (params) params.split('&').forEach(p => {
      const [k, v] = p.split('=')
      if (k && v) qs.set(k, decodeURIComponent(v))
    })

    const res = await fetch(
      `${BASE_URL}/${encodeURIComponent(table)}?${qs.toString()}`,
      { headers: headers() }
    )
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Airtable error (${table}): ${err}`)
    }
    const data: AirtableListResponse<T> = await res.json()
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  return records
}

export async function fetchAllClients() {
  return fetchAll<AirtableClientFields>('Clients')
}

export async function fetchAllCopy() {
  return fetchAll<AirtableCopyFields>('Copy')
}

export async function fetchRecordById<T>(table: string, id: string): Promise<AirtableRecord<T>> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(table)}/${id}`, { headers: headers() })
  if (!res.ok) throw new Error(`Airtable error fetching ${table}/${id}: ${await res.text()}`)
  return res.json()
}

export async function fetchByClientId<T>(table: string, clientId: string): Promise<AirtableRecord<T>[]> {
  const formula = encodeURIComponent(`FIND("${clientId}", ARRAYJOIN({Client}, ",")) > 0`)
  return fetchAll<T>(table, `filterByFormula=${formula}&sort[0][field]=OrderNumber&sort[0][direction]=asc`)
}

export async function patchRecord(table: string, id: string, fields: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(table)}/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`Airtable PATCH error (${table}/${id}): ${await res.text()}`)
  return res.json()
}
```

**Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | grep "error TS" | head -5
```
Expected: no errors

**Step 3: Commit**

```bash
git add lib/airtable.ts
git commit -m "feat: shared Airtable fetch helpers"
```

---

## Task 2: Create `lib/airtable-to-content.ts` — Airtable → LandingPageContent mapper

**Files:**
- Create: `lib/airtable-to-content.ts`

**Step 1: Write the mapper**

```typescript
import {
  AirtableRecord,
  AirtableClientFields,
  AirtableCopyFields,
  AirtableServiceFields,
  AirtableProcessStepFields,
  AirtableTestimonialFields,
  AirtableCaseStudyFields,
  AirtableFAQFields,
} from './airtable'
import {
  LandingPageContent,
  ServiceCard,
  ProcessStep,
  Testimonial,
  CaseStudy,
  FAQItem,
  NextStepCard,
  ProblemCard,
} from '../types/content'

const DEFAULT_ICON = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
const DEFAULT_NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]
const DEFAULT_NEXT_STEPS: [NextStepCard, NextStepCard, NextStepCard] = [
  { title: 'Book a Call', description: 'Schedule a free 30-minute discovery call with our team.' },
  { title: 'Get a Proposal', description: 'Receive a tailored proposal within 48 hours.' },
  { title: 'Start Today', description: 'Kick off your project and see results fast.' },
]

function padTo<T>(arr: T[], length: number, make: (i: number) => T): T[] {
  const result = [...arr]
  while (result.length < length) result.push(make(result.length))
  return result.slice(0, length)
}

export function mapAirtableToContent(
  client: AirtableRecord<AirtableClientFields>,
  copy: AirtableRecord<AirtableCopyFields> | null,
  services: AirtableRecord<AirtableServiceFields>[],
  processSteps: AirtableRecord<AirtableProcessStepFields>[],
  testimonials: AirtableRecord<AirtableTestimonialFields>[],
  caseStudies: AirtableRecord<AirtableCaseStudyFields>[],
  faqs: AirtableRecord<AirtableFAQFields>[]
): LandingPageContent {
  const cf = client.fields
  const cp = copy?.fields ?? {}
  const slug = cf.FieldTypeSlug ?? client.id
  const companyName = cf['Company Name'] ?? 'Company'
  const ctaLabel = cp['CTA Text'] ?? 'Get Started'
  const year = new Date().getFullYear()

  const serviceCards = padTo<ServiceCard>(
    services.map(s => ({
      icon: DEFAULT_ICON,
      title: s.fields.Title ?? 'Service',
      description: s.fields.Description ?? '',
    })),
    3,
    i => ({ icon: DEFAULT_ICON, title: `Service ${i + 1}`, description: 'Coming soon.' })
  ) as [ServiceCard, ServiceCard, ServiceCard]

  const problemCards = padTo<ProblemCard>(
    services.slice(0, 3).map(s => ({
      icon: DEFAULT_ICON,
      title: s.fields.Title ?? 'Challenge',
      description: s.fields.Description ?? '',
    })),
    3,
    i => ({ icon: DEFAULT_ICON, title: `Challenge ${i + 1}`, description: 'To be defined.' })
  ) as [ProblemCard, ProblemCard, ProblemCard]

  const processStepsMapped = padTo<ProcessStep>(
    processSteps.map(s => ({
      title: s.fields['Step Title'] ?? `Step ${s.fields.OrderNumber ?? ''}`,
      description: s.fields['Step Description'] ?? '',
    })),
    4,
    i => ({ title: `Step ${i + 1}`, description: 'To be defined.' })
  ) as [ProcessStep, ProcessStep, ProcessStep, ProcessStep]

  const testimonialsMapped: Testimonial[] = testimonials.map(t => ({
    quote: t.fields.Quote ?? '',
    name: t.fields.Name ?? '',
    title: t.fields['Job Title'] ?? '',
    company: t.fields.Company,
  }))

  const caseStudiesMapped: CaseStudy[] = caseStudies.map(cs => ({
    title: cs.fields['Client Label'] ?? '',
    resultStat: cs.fields['Key Stat'] ?? '',
    description: cs.fields.Description ?? '',
  }))

  const faqsMapped = padTo<FAQItem>(
    faqs.map(f => ({
      question: f.fields.Question ?? '',
      answer: f.fields.Answer ?? '',
    })),
    6,
    i => ({ question: `Question ${i + 1}`, answer: 'Answer coming soon.' })
  ) as [FAQItem, FAQItem, FAQItem, FAQItem, FAQItem, FAQItem]

  return {
    slug,
    meta: {
      title: `${companyName} — ${cp['CTA Text'] ?? cf['Campaign Name'] ?? ''}`,
      description: cp['Outcome Statement'] ?? cp['Problem Statement'] ?? '',
    },
    navbar: {
      logo: { text: companyName },
      links: DEFAULT_NAV_LINKS,
      cta: { label: ctaLabel, href: '#cta' },
    },
    hero: {
      headline: cp.Headline ?? '',
      subheadline: cp.Subheadline ?? '',
      cta: { label: ctaLabel, href: '#cta' },
      socialProof: '',
    },
    mediaBlock: { type: 'placeholder', aspectRatio: '16/9', alt: `${companyName} product screenshot` },
    problemSection: {
      eyebrow: 'The Problem',
      headline: cp['Problem Statement'] ?? '',
      cards: problemCards,
    },
    valueProposition: {
      eyebrow: 'The Solution',
      headline: cp['Outcome Statement'] ?? '',
      body: cp['Problem Statement'] ?? '',
    },
    partnerLogos: { logos: [] },
    services: {
      eyebrow: 'What We Do',
      headline: 'Our Services',
      cards: serviceCards,
    },
    process: {
      eyebrow: 'How It Works',
      headline: 'Our Process',
      steps: processStepsMapped,
    },
    testimonials: {
      eyebrow: 'What Our Customers Say',
      headline: `Teams love ${companyName}`,
      items: testimonialsMapped,
    },
    caseStudies: {
      eyebrow: 'Case Studies',
      headline: 'Real results from real customers',
      items: caseStudiesMapped,
    },
    nextSteps: {
      eyebrow: 'Get Started',
      headline: 'Three ways to begin',
      cards: DEFAULT_NEXT_STEPS,
    },
    ctaSection: {
      headline: 'Ready to get started?',
      subheadline: cp['Outcome Statement'] ?? '',
      cta: { label: ctaLabel, href: '#cta' },
    },
    faq: {
      eyebrow: 'FAQ',
      headline: 'Everything you need to know',
      items: faqsMapped,
    },
    footer: {
      logo: { text: companyName },
      links: DEFAULT_NAV_LINKS,
      socialLinks: [],
      copyright: `© ${year} ${companyName}. All rights reserved.`,
    },
  }
}
```

**Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | grep "error TS" | head -5
```
Expected: no errors

**Step 3: Commit**

```bash
git add lib/airtable-to-content.ts
git commit -m "feat: Airtable to LandingPageContent mapper"
```

---

## Task 3: Create `app/api/clients/route.ts` — GET all clients with completion scores

**Files:**
- Create: `app/api/clients/route.ts`

**Step 1: Write the route**

```typescript
import { NextResponse } from 'next/server'
import { fetchAllClients, fetchAllCopy, AirtableClientFields } from '../../../lib/airtable'

export interface ClientSummary {
  id: string
  slug: string
  companyName: string
  status: string
  completion: number
  missing: string[]
  copyRecordId: string | null
}

function scoreClient(
  fields: AirtableClientFields,
  copyFields: Record<string, string | undefined> | null
): { completion: number; missing: string[] } {
  const checks: Array<[string, boolean]> = [
    ['Slug', !!fields.FieldTypeSlug],
    ['Company Name', !!fields['Company Name']],
    ['Primary Color', !!fields['Primary Color']],
    ['Font Preference', !!fields['Font Preference']],
    ['Headline', !!copyFields?.Headline],
    ['Subheadline', !!copyFields?.Subheadline],
    ['CTA Text', !!copyFields?.['CTA Text']],
    ['Problem Statement', !!copyFields?.['Problem Statement']],
    ['Outcome Statement', !!copyFields?.['Outcome Statement']],
    ['≥1 Service', (fields.Services?.length ?? 0) >= 1],
    ['≥2 Process Steps', (fields['Process Steps']?.length ?? 0) >= 2],
    ['≥1 Testimonial', (fields.Testimonials?.length ?? 0) >= 1],
    ['≥1 FAQ', (fields.FAQs?.length ?? 0) >= 1],
  ]

  const passed = checks.filter(([, ok]) => ok).length
  const missing = checks.filter(([, ok]) => !ok).map(([label]) => label)
  return { completion: Math.round((passed / checks.length) * 100), missing }
}

export async function GET() {
  try {
    const [clients, allCopy] = await Promise.all([fetchAllClients(), fetchAllCopy()])

    // Index copy records by their Airtable record ID
    const copyById = Object.fromEntries(allCopy.map(r => [r.id, r.fields]))

    const summaries: ClientSummary[] = clients.map(client => {
      const copyRecordId = client.fields.Copy?.[0] ?? null
      const copyFields = copyRecordId ? (copyById[copyRecordId] as Record<string, string | undefined>) : null
      const { completion, missing } = scoreClient(client.fields, copyFields)

      return {
        id: client.id,
        slug: client.fields.FieldTypeSlug ?? '',
        companyName: client.fields['Company Name'] ?? client.fields.FieldTypeSlug ?? client.id,
        status: client.fields.Status ?? '',
        completion,
        missing,
        copyRecordId,
      }
    })

    // Sort by completion descending
    summaries.sort((a, b) => b.completion - a.completion)

    return NextResponse.json({ clients: summaries })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | grep "error TS" | head -5
```
Expected: no errors

**Step 3: Commit**

```bash
git add app/api/clients/route.ts
git commit -m "feat: GET /api/clients with completion scoring"
```

---

## Task 4: Create `app/api/clients/[recordId]/generate/route.ts`

Fetches all data for the client, maps to LandingPageContent, commits to GitHub, updates Airtable status.

**Files:**
- Create: `app/api/clients/[recordId]/generate/route.ts`

**Step 1: Write the route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import {
  fetchRecordById,
  fetchByClientId,
  patchRecord,
  AirtableClientFields,
  AirtableCopyFields,
  AirtableServiceFields,
  AirtableProcessStepFields,
  AirtableTestimonialFields,
  AirtableCaseStudyFields,
  AirtableFAQFields,
} from '../../../../../lib/airtable'
import { mapAirtableToContent } from '../../../../../lib/airtable-to-content'

async function commitToGitHub(slug: string, content: object): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPO env vars are required')

  const path = `content/${slug}.json`
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`
  const fileContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64')

  // Check if file already exists (need SHA to update)
  let sha: string | undefined
  const existing = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })
  if (existing.ok) {
    const data = await existing.json()
    sha = data.sha
  }

  const body: Record<string, unknown> = {
    message: `feat: generate content for ${slug}`,
    content: fileContent,
  }
  if (sha) body.sha = sha

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub API error: ${err}`)
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const { recordId } = await params

    // Fetch client record
    const client = await fetchRecordById<AirtableClientFields>('Clients', recordId)
    const copyRecordId = client.fields.Copy?.[0]
    if (!copyRecordId) throw new Error('No Copy record linked to this client')

    // Fetch all related records in parallel
    const [copy, services, processSteps, testimonials, caseStudies, faqs] = await Promise.all([
      fetchRecordById<AirtableCopyFields>('Copy', copyRecordId),
      fetchByClientId<AirtableServiceFields>('Services', recordId),
      fetchByClientId<AirtableProcessStepFields>('Process Steps', recordId),
      fetchByClientId<AirtableTestimonialFields>('Testimonials', recordId),
      fetchByClientId<AirtableCaseStudyFields>('Case Studies', recordId),
      fetchByClientId<AirtableFAQFields>('FAQs', recordId),
    ])

    // Map to LandingPageContent
    const content = mapAirtableToContent(
      client, copy, services, processSteps, testimonials, caseStudies, faqs
    )

    // Commit to GitHub
    await commitToGitHub(content.slug, content)

    // Update Airtable status to "In Build"
    await patchRecord('Clients', recordId, { Status: 'In Build' })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
    const previewUrl = siteUrl ? `${siteUrl}/${content.slug}` : `/${content.slug}`

    return NextResponse.json({ ok: true, previewUrl, slug: content.slug })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

**Step 2: Verify build**

```bash
npm run build 2>&1 | grep "error TS" | head -5
```
Expected: no errors

**Step 3: Commit**

```bash
git add app/api/clients/[recordId]/generate/route.ts
git commit -m "feat: generate route — map Airtable to content JSON and commit to GitHub"
```

---

## Task 5: Update `app/admin/scan/page.tsx` — add ClientList section

Keep the entire existing scanner section verbatim. Add a `<ClientList>` component below it that auto-refreshes every 30 seconds.

**Files:**
- Modify: `app/admin/scan/page.tsx`

**Step 1: Replace the entire file with this**

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ScanResult, FieldScore } from '../../../types/airtable'
import { ClientSummary } from '../../api/clients/route'

// ─── Scan section helpers (unchanged) ────────────────────────────────────────

type ScanState = 'idle' | 'scanning' | 'done' | 'writing' | 'written' | 'error'

function scoreColor(score: FieldScore) {
  if (score === 'missing') return 'bg-amber-50 border-amber-200 text-amber-800'
  return 'bg-green-50 border-green-200 text-green-800'
}

function ScoreBadge({ score }: { score: FieldScore }) {
  const colors =
    score === 'missing'
      ? 'bg-amber-100 text-amber-700'
      : score === 'inferred'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700'
  return (
    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${colors}`}>
      {score}
    </span>
  )
}

interface FieldRowProps {
  label: string
  value: string | number | null
  score: FieldScore
}

function FieldRow({ label, value, score }: FieldRowProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded border ${scoreColor(score)}`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-0.5">{label}</p>
        <p className="text-sm break-words">{value ?? '—'}</p>
      </div>
      <ScoreBadge score={score} />
    </div>
  )
}

function flattenResult(result: ScanResult): { populated: FieldRowProps[]; missing: FieldRowProps[] } {
  const populated: FieldRowProps[] = []
  const missing: FieldRowProps[] = []

  function add(label: string, value: string | number | null, score: FieldScore) {
    const row = { label, value, score }
    score === 'missing' ? missing.push(row) : populated.push(row)
  }

  add('Slug', result.client.slug.value, result.client.slug.score)
  add('Campaign Name', result.client.campaignName.value, result.client.campaignName.score)
  add('Company Name', result.client.companyName.value, result.client.companyName.score)
  add('Website URL', result.client.websiteUrl.value, result.client.websiteUrl.score)
  add('Headline', result.copy.headline.value, result.copy.headline.score)
  add('Subheadline', result.copy.subheadline.value, result.copy.subheadline.score)
  add('CTA Text', result.copy.ctaText.value, result.copy.ctaText.score)
  add('Problem Statement', result.copy.problemStatement.value, result.copy.problemStatement.score)
  add('Outcome Statement', result.copy.outcomeStatement.value, result.copy.outcomeStatement.score)

  result.services.forEach((s, i) => {
    add(`Service ${i + 1} Title`, s.title.value, s.title.score)
    add(`Service ${i + 1} Description`, s.description.value, s.description.score)
  })
  result.processSteps.forEach((s, i) => {
    add(`Step ${i + 1} Title`, s.stepTitle.value, s.stepTitle.score)
    add(`Step ${i + 1} Description`, s.stepDescription.value, s.stepDescription.score)
  })
  result.testimonials.forEach((t, i) => {
    add(`Testimonial ${i + 1} Quote`, t.quote.value, t.quote.score)
    add(`Testimonial ${i + 1} Name`, t.name.value, t.name.score)
    add(`Testimonial ${i + 1} Job Title`, t.jobTitle.value, t.jobTitle.score)
    add(`Testimonial ${i + 1} Company`, t.company.value, t.company.score)
  })
  result.caseStudies.forEach((cs, i) => {
    add(`Case Study ${i + 1} Label`, cs.clientLabel.value, cs.clientLabel.score)
    add(`Case Study ${i + 1} Key Stat`, cs.keyStat.value, cs.keyStat.score)
    add(`Case Study ${i + 1} Description`, cs.description.value, cs.description.score)
  })
  result.faqs.forEach((f, i) => {
    add(`FAQ ${i + 1} Question`, f.question.value, f.question.score)
    add(`FAQ ${i + 1} Answer`, f.answer.value, f.answer.score)
  })

  return { populated, missing }
}

// ─── Client List ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  'Intake':    'bg-gray-100 text-gray-700',
  'In Build':  'bg-blue-100 text-blue-700',
  'Live':      'bg-green-100 text-green-700',
  'Archived':  'bg-red-100 text-red-700',
  'Planning':  'bg-gray-100 text-gray-700',
  'Active':    'bg-green-100 text-green-700',
  'Paused':    'bg-amber-100 text-amber-700',
}

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors}`}>{status || '—'}</span>
  )
}

function ProgressBar({ value }: { value: number }) {
  const color = value === 100 ? 'bg-green-500' : value >= 60 ? 'bg-blue-500' : 'bg-amber-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{value}%</span>
    </div>
  )
}

function ClientRow({ client, onGenerated }: { client: ClientSummary; onGenerated: () => void }) {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{ previewUrl: string } | null>(null)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/api/clients/${client.id}/generate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generate failed')
      setResult(data)
      onGenerated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{client.companyName}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{client.slug}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={client.status} />
          <button
            onClick={handleGenerate}
            disabled={client.completion < 100 || generating}
            title={client.completion < 100 ? `Missing: ${client.missing.join(', ')}` : 'Generate landing page'}
            className="text-xs px-3 py-1.5 rounded font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? 'Generating…' : 'Generate Page'}
          </button>
        </div>
      </div>

      <ProgressBar value={client.completion} />

      {client.missing.length > 0 && (
        <p className="text-xs text-amber-700">
          Missing: {client.missing.join(', ')}
        </p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {result && (
        <p className="text-xs text-green-700 font-medium">
          ✓ Generated.{' '}
          <a href={result.previewUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View page →
          </a>
        </p>
      )}
    </div>
  )
}

function ClientList() {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to load clients')
      setClients(data.clients)
      setLastRefresh(new Date())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Clients</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {clients.length} client{clients.length !== 1 ? 's' : ''} · auto-refreshes every 30s
            {lastRefresh && (
              <span className="ml-2 text-gray-400">
                (last: {lastRefresh.toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 py-8 text-center">Loading clients…</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm">{error}</div>
      )}

      {!loading && clients.length === 0 && !error && (
        <p className="text-sm text-gray-400 py-8 text-center">No clients found.</p>
      )}

      <div className="space-y-3">
        {clients.map(client => (
          <ClientRow key={client.id} client={client} onGenerated={load} />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminScanPage() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<ScanState>('idle')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleScan(e: React.FormEvent) {
    e.preventDefault()
    setState('scanning')
    setResult(null)
    setErrorMsg('')
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Scan failed')
      setResult(data.result)
      setState('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }

  async function handleWrite() {
    if (!result) return
    setState('writing')
    setErrorMsg('')
    try {
      const res = await fetch('/api/scan/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Write failed')
      setState('written')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }

  const { populated, missing } = result ? flattenResult(result) : { populated: [], missing: [] }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* ── Section 1: URL Scanner ── */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Landing Page Scanner</h1>
            <p className="text-sm text-gray-500 mt-1">
              Scrape a URL and extract structured data for Airtable.
            </p>
          </div>

          <form onSubmit={handleScan} className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={state === 'scanning' || state === 'writing'}
              className="bg-blue-600 text-white rounded px-5 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {state === 'scanning' ? 'Scanning…' : 'Scan'}
            </button>
          </form>

          {state === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm">
              {errorMsg}
            </div>
          )}

          {state === 'written' && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded p-4 text-sm font-medium">
              ✓ Written to Airtable successfully.
            </div>
          )}

          {result && state !== 'written' && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="text-green-700 font-semibold">{populated.length} populated</span>
                  {' · '}
                  <span className="text-amber-700 font-semibold">{missing.length} missing</span>
                </p>
                <button
                  onClick={handleWrite}
                  disabled={state === 'writing'}
                  className="bg-emerald-600 text-white rounded px-5 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {state === 'writing' ? 'Writing…' : 'Write to Airtable'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-green-800 uppercase tracking-wide">
                    Populated ({populated.length})
                  </h2>
                  {populated.map((f, i) => <FieldRow key={i} {...f} />)}
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                    Missing ({missing.length})
                  </h2>
                  {missing.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No missing fields.</p>
                  ) : (
                    missing.map((f, i) => <FieldRow key={i} {...f} />)
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Divider ── */}
        <hr className="border-gray-200" />

        {/* ── Section 2: Client List ── */}
        <ClientList />

      </div>
    </div>
  )
}
```

**Step 2: Verify full build**

```bash
npm run build 2>&1 | tail -20
```
Expected: zero errors, routes include `/admin/scan`, `/api/clients`, `/api/clients/[recordId]/generate`

**Step 3: Commit**

```bash
git add app/admin/scan/page.tsx
git commit -m "feat: admin dashboard — client list with completion scoring and Generate Page"
```

---

## Verification Checklist

- [ ] `npm run build` — zero TypeScript errors
- [ ] Visit `/admin/scan` — both sections render
- [ ] Client list loads with completion % and status badges
- [ ] Client with < 100% has "Generate Page" button greyed out; tooltip shows missing fields
- [ ] Client with 100% has active "Generate Page" button
- [ ] Click Generate → `content/{slug}.json` appears in GitHub repo
- [ ] Airtable Status updated to "In Build"
- [ ] Success message shows preview URL link
- [ ] Page auto-refreshes client list every 30 seconds
- [ ] Existing URL scanner still works end-to-end
