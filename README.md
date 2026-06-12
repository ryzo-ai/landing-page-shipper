# Landing Page Builder

Generates on-brand landing pages from JSON content configs. One JSON file per page — no code changes needed for a new variant. Built for Ryzo's own campaigns, with per-client deployment (subdomain on the client's domain) as the intended end state.

**Status:** runs locally only. Not yet linked to a Vercel project or deployed anywhere.

**Repo:** this is its own git repository (`ryzo-revops/landing-page-shipper`), checked out in place inside ryzo-ops at `ryzo-management/marketing/tools/landing-page-builder/`. Commit landing-page work here, not in ryzo-ops.

## Stack

Next.js 16 (App Router, TypeScript) · React 19 · Tailwind CSS 4 · Framer Motion · Anthropic SDK (page scanner) · Airtable (client/page records)

## How it works

1. **Content configs** live in `content/*.json`. Each file defines a page: slug, template type (`pitch`, `sprint`), section list, and per-section copy. See `content/_template-pitch.json` and `content/_template-sprint.json` for the schema, `content/ryzo.json` for a full example.
2. **Routes**: each config renders at `/[slug]`; ad-specific variants live in `content/lp/` and render at `/lp/[slug]`.
3. **Theme**: all visual tokens (colors, fonts, spacing, radius, design style `flat | gradient | skeuomorphic`, light/dark) live in `theme.config.ts`. Restyle for a client by editing that one file — never hardcode tokens in components.
4. **Admin** (`/admin`, password-gated via `middleware.ts`):
   - **Scan** (`/admin/scan`): give it a URL → it scrapes the page (cheerio), has Claude extract structured landing page data, and writes the result to Airtable.
   - **Generate** (`POST /api/clients/[recordId]/generate`): turns an Airtable client record into a content config and commits it to a GitHub repo (`GITHUB_REPO`).

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Environment variables

| Var | Used for |
|---|---|
| `ADMIN_PASSWORD` | Gates `/admin` (cookie check in `middleware.ts`) |
| `ANTHROPIC_API_KEY` | Page scanner (`/api/scan`) |
| `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` | Client/page records (base ID may be `appXXX/tblXXX`; only the base part is used) |
| `GITHUB_TOKEN`, `GITHUB_REPO` | Generate flow commits content configs to a repo |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs/meta |

## Key files

- `theme.config.ts` — design tokens, the only place visual style lives
- `content/` — page configs (`_template-*.json` = schemas)
- `lib/airtable.ts`, `lib/airtable-to-content.ts` — Airtable client + record→config mapping
- `landing-engine/claude.md` — agent working reference (note: partly aspirational — it describes a `useAdParams` URL-override hook and Next 14; neither matches the current code)
- `tasks/todo.md` — active task plans

## Deployment (planned)

Intended model: one deployment per client, hosted on a subdomain of the client's main domain, themed via `theme.config.ts` and fed by that client's content configs. Until that exists, run locally.
